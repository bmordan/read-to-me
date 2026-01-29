import { useEffect, useRef, useState } from 'react';

export function useWhisper() {
    const [transcript, setTranscript] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const worker = useRef<Worker | null>(null);

    useEffect(() => {
        // Initialize worker
        worker.current = new Worker(new URL('../whisper.worker.js', import.meta.url), {
            type: 'module'
        });

        worker.current.onmessage = (e) => {
            if (e.data.status === 'complete') {
                setTranscript(e.data.text);
                setIsProcessing(false);
            }
        };

        return () => worker.current?.terminate();
    }, []);

    const transcribe = (audioBlob: Blob) => {
        setIsProcessing(true);
        worker.current?.postMessage({ audio: audioBlob });
    };

    return { transcript, transcribe, isProcessing };
}