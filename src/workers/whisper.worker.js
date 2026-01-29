import { pipeline } from '@huggingface/transformers';

let transcriber = null;

self.onmessage = async (event) => {
    const { audio } = event.data;

    // Load the model lazily (only the first time)
    if (!transcriber) {
        transcriber = await pipeline('automatic-speech-recognition', 'Xenova/whisper-tiny.en', {
            device: 'webgpu', // Use 'wasm' if the user doesn't have a GPU
        });
    }

    // Run transcription
    const output = await transcriber(audio, {
        chunk_length_s: 30,
        stride_length_s: 5,
    });

    // Handle both single output and array output
    const text = Array.isArray(output) ? output[0]?.text : output.text;
    self.postMessage({ status: 'complete', text });
};

