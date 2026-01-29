# Audio Transcription Flow: ReadToMePage → AnalysisPage

## Complete Flow Overview

### Phase 1: Model Initialization (ReadToMePage)

1. **User clicks record button** → `handleRecordClick()` is triggered
2. **Model check**: `checkIfModelDownloaded()` loads the Whisper model (`Xenova/whisper-tiny.en`) using Hugging Face Transformers
3. **Progress UI**: Shows loading indicator while model downloads/loads
4. **Ready state**: `isModelReady` becomes `true`

### Phase 2: Audio Capture Pipeline

When the user clicks record again (after model is ready):

1. **`startRecording()` executes**:
   - Requests microphone access via `getUserMedia()` (16kHz, mono)
   - Creates an `AudioContext` (16kHz sample rate)
   - Loads the AudioWorklet processor module (`audio-processor.worklet.js`)
   - Creates a Web Worker for transcription (`whisper.worker.js`)

2. **AudioWorklet Processor** (`audio-processor.worklet.js`):
   - Runs in a separate audio thread
   - Receives audio samples in real-time (128 samples per render quantum)
   - Accumulates samples into 4096-sample buffers
   - Sends each 4096-sample buffer to the main thread via `port.postMessage()`

3. **Main Thread Processing** (ReadToMePage):
   - Receives 4096-sample chunks from the AudioWorklet
   - Accumulates 4 chunks (~1 second of audio: 4 × 4096 / 16000 Hz ≈ 1.024s)
   - Combines them into a single `Float32Array`
   - Sends the combined audio to the Whisper worker via `worker.postMessage()`

### Phase 3: Transcription (whisper.worker.js)

1. **Worker receives audio data**
2. **Lazy model loading**: Loads the Whisper model on first use (cached afterward)
3. **Transcription**: Runs Whisper on the audio chunk
4. **Result**: Sends `{ status: 'complete', text: '...' }` back to the main thread

### Phase 4: Transcript Accumulation

1. **Main thread receives transcription results** via `worker.onmessage`
2. **Accumulation**: Each text chunk is pushed to `transcriptChunksRef.current`
3. **Real-time updates**: Transcript chunks accumulate as recording continues

### Phase 5: Stop Recording and Navigation

When the user clicks stop:

1. **`stopRecording()` executes**:
   - Disconnects audio nodes and stops the microphone stream
   - Terminates the worker
   - Combines all transcript chunks: `transcriptChunksRef.current.join(' ')`
   - Stores in context: `setTranscript(fullTranscript)` (TranscriptContext)
   - Navigates: `navigate('/analysis')`

### Phase 6: Display on AnalysisPage

1. **AnalysisPage mounts** and calls `useTranscript()`
2. **Reads transcript**: `const { transcript } = useTranscript()` (from TranscriptContext)
3. **Renders**: Displays the transcript text in a `<Typography>` component

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    ReadToMePage (Main Thread)                 │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  AudioWorklet (Audio Thread)                          │   │
│  │  • Captures 4096-sample chunks                       │   │
│  │  • Sends to main thread                               │   │
│  └──────────────────────────────────────────────────────┘   │
│                          ↓                                    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Main Thread Processing                              │   │
│  │  • Accumulates 4 chunks (~1 second)                 │   │
│  │  • Sends to Worker                                    │   │
│  └──────────────────────────────────────────────────────┘   │
│                          ↓                                    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Whisper Worker (Separate Thread)                     │   │
│  │  • Loads Whisper model                                │   │
│  │  • Transcribes audio → text                           │   │
│  │  • Sends text back                                    │   │
│  └──────────────────────────────────────────────────────┘   │
│                          ↓                                    │
│  • Accumulates transcript chunks                            │
│  • On stop: combines & stores in TranscriptContext         │
│  • Navigates to /analysis                                   │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│                    AnalysisPage                              │
│  • Reads from TranscriptContext                              │
│  • Renders transcript text                                   │
└─────────────────────────────────────────────────────────────┘
```

## Key Concepts

1. **Three Threads**:
   - **Audio thread** (AudioWorklet): Real-time audio capture
   - **Main thread**: UI and coordination
   - **Worker thread**: ML model inference

2. **Batching**: Accumulates ~1 second of audio before sending to reduce overhead

3. **State Management**: TranscriptContext holds the final transcript across navigation

4. **Real-time vs. Final**: Chunks accumulate during recording; full transcript is stored on stop

This architecture keeps the UI responsive while processing audio and running the model in the background.

