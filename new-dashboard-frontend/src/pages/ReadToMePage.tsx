import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, IconButton, CircularProgress } from '@mui/material';
import { CheckCircle, HighlightOffRounded, Mic, StopCircle } from '@mui/icons-material';
import { pipeline } from '@huggingface/transformers';
import { useTranscript } from '../context/TranscriptContext';

function CircularProgressWithLabel({ value }: { value: number }) {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress
        variant="determinate"
        value={value}
        size={80}
        sx={{
          color: 'primary.main',
        }}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="caption" component="div" color="text.secondary">
          {`${Math.round(value)}%`}
        </Typography>
      </Box>
    </Box>
  );
}

async function checkIfModelDownloaded(): Promise<boolean> {
  try {
    // Try to load the model - if it's cached, this will be fast
    // If not cached, it will start downloading
    const transcriber = await pipeline(
      'automatic-speech-recognition',
      'Xenova/whisper-tiny.en',
      {
        device: 'webgpu',
      }
    );

    return transcriber !== null;
  } catch (error) {
    console.error('Error checking model:', error);
    return false;
  }
}

function ReadToMePage() {
  const navigate = useNavigate();
  const { setTranscript, clearTranscript } = useTranscript();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isModelReady, setIsModelReady] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const workerRef = useRef<Worker | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioWorkletNodeRef = useRef<AudioWorkletNode | null>(null);
  const transcriptChunksRef = useRef<string[]>([]);
  const audioBufferRef = useRef<Float32Array[]>([]);

  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      stopRecording();
    };
  }, []);

  const stopRecording = () => {
    if (audioWorkletNodeRef.current) {
      audioWorkletNodeRef.current.disconnect();
      audioWorkletNodeRef.current.port.close();
      audioWorkletNodeRef.current = null;
    }
    
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach(track => track.stop());
      audioStreamRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    if (workerRef.current) {
      workerRef.current.terminate();
      workerRef.current = null;
    }

    // Combine all transcript chunks and store in context
    const fullTranscript = transcriptChunksRef.current.join(' ').trim();
    if (fullTranscript) {
      setTranscript(fullTranscript);
      // Navigate to analysis page
      navigate('/analysis');
    }

    setIsRecording(false);
    audioBufferRef.current = [];
    transcriptChunksRef.current = [];
  };

  const startRecording = async () => {
    // Clear previous transcript when starting new recording
    clearTranscript();
    transcriptChunksRef.current = [];
    audioBufferRef.current = [];
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 16000, // Whisper expects 16kHz
          channelCount: 1, // Mono
          echoCancellation: true,
          noiseSuppression: true,
        }
      });
      audioStreamRef.current = stream;

      // Create AudioContext with 16kHz sample rate (Whisper's expected rate)
      const audioContext = new AudioContext({ sampleRate: 16000 });
      audioContextRef.current = audioContext;

      const worker = new Worker(new URL('../workers/whisper.worker.js', import.meta.url), {
        type: 'module',
      });
      workerRef.current = worker;

      worker.onmessage = (event) => {
        const { status, text } = event.data;
        if (status === 'complete' && text) {
          console.log('Transcription:', text);
          // Accumulate transcript chunks
          transcriptChunksRef.current.push(text);
        }
      };

      worker.onerror = (error) => {
        console.error('Worker error:', error);
      };

      // Load the AudioWorklet processor
      await audioContext.audioWorklet.addModule(
        new URL('../workers/audio-processor.worklet.js', import.meta.url)
      );

      // Create a source node from the stream
      const source = audioContext.createMediaStreamSource(stream);
      
      // Create AudioWorkletNode to capture audio samples (modern replacement for ScriptProcessorNode)
      const audioWorkletNode = new AudioWorkletNode(audioContext, 'audio-processor');
      audioWorkletNodeRef.current = audioWorkletNode;

      // Create a silent gain node to avoid audio feedback
      const silentGain = audioContext.createGain();
      silentGain.gain.value = 0;

      // Process audio chunks from the worklet
      audioWorkletNode.port.onmessage = (event) => {
        if (event.data.type === 'audioData') {
          const audioData = event.data.data;
          
          // Accumulate audio buffers for potential batch processing
          audioBufferRef.current.push(audioData);
          
          // Send audio chunk to worker for transcription
          // We'll send chunks periodically to avoid overwhelming the worker
          if (audioBufferRef.current.length >= 4) { // Send every ~1 second (4 chunks * 4096 samples / 16000 Hz ≈ 1.024s)
            const combinedAudio = new Float32Array(
              audioBufferRef.current.reduce((acc, chunk) => acc + chunk.length, 0)
            );
            let offset = 0;
            for (const chunk of audioBufferRef.current) {
              combinedAudio.set(chunk, offset);
              offset += chunk.length;
            }
            
            worker.postMessage({ audio: combinedAudio });
            audioBufferRef.current = [];
          }
        }
      };

      // Connect the audio nodes
      // Source -> AudioWorkletNode -> SilentGain -> Destination (silent)
      source.connect(audioWorkletNode);
      audioWorkletNode.connect(silentGain);
      silentGain.connect(audioContext.destination);

      setIsRecording(true);
      console.log('Recording started with AudioWorklet');
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Could not access microphone. Please check your browser permissions.');
    }
  };

  const handleRecordClick = async () => {
    if (isModelReady && !isRecording) {
      console.log('Model is ready, starting recording...');
      await startRecording();
      return;
    }

    if (isRecording) {
      return;
    }

    setIsLoading(true);
    setProgress(0);

    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        const newProgress = Math.min(prev + 5, 95);
        return newProgress;
      });
    }, 500);

    try {
      const isDownloaded = await checkIfModelDownloaded();
      console.log('is whisper installed?', isDownloaded);

      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }

      setProgress(100);
      setIsModelReady(true);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to load model:', error);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      setIsLoading(false);
      setProgress(0);
    }
  };

  const handleStopClick = () => {
    stopRecording();
  };

  return (
    <Box
      id="ready-to-read"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        width: '100%',
        gap: 3,
      }}
    >
      <Typography variant="h4" component="p">
        {isLoading && "Getting ready to listen to you..."}
        {isModelReady && !isRecording && "Ready to listen"}
        {isRecording && "Listening..."}
        {!isLoading && !isModelReady && "Ready to read"}
      </Typography>
      {isLoading ? (
        <CircularProgressWithLabel value={progress} />
      ) : isModelReady ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          {!isRecording ? (
            <IconButton
              color="primary"
              onClick={handleRecordClick}
              sx={{
                width: 80,
                height: 80,
                '& .MuiSvgIcon-root': {
                  fontSize: 48,
                }
              }}
            >
              <Mic />
            </IconButton>
          ) : (
            <IconButton
              color="error"
              onClick={handleStopClick}
              sx={{
                width: 80,
                height: 80,
                '& .MuiSvgIcon-root': {
                  fontSize: 48,
                },
                animation: 'pulse 2s ease-in-out infinite',
                '@keyframes pulse': {
                  '0%, 100%': {
                    transform: 'scale(1)',
                    opacity: 1,
                  },
                  '50%': {
                    transform: 'scale(1.1)',
                    opacity: 0.8,
                  },
                },
              }}
            >
              <StopCircle />
            </IconButton>
          )}
        </Box>
      ) : (
        <Box>
          <IconButton
            color="success"
            onClick={handleRecordClick}
            sx={{
              width: 80,
              height: 80,
              '& .MuiSvgIcon-root': {
                fontSize: 48,
              },
            }}
          >
            <CheckCircle />
          </IconButton>
          <IconButton
            color="warning"
            onClick={() => navigate('/')}
            sx={{
              width: 80,
              height: 80,
              '& .MuiSvgIcon-root': {
                fontSize: 48,
              },
            }}
          >
            <HighlightOffRounded />
          </IconButton>
        </Box>
      )}
    </Box>
  );
}

export default ReadToMePage;
