// AudioWorklet processor to capture audio samples
class AudioProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.bufferSize = 4096;
    this.buffer = new Float32Array(this.bufferSize);
    this.bufferIndex = 0;
  }

  process(inputs, outputs) {
    const input = inputs[0];
    
    if (input.length > 0) {
      const inputChannel = input[0];
      const samplesToProcess = inputChannel.length;
      
      // Copy input samples to buffer
      for (let i = 0; i < samplesToProcess; i++) {
        this.buffer[this.bufferIndex++] = inputChannel[i];
        
        // When buffer is full, send it to main thread
        if (this.bufferIndex >= this.bufferSize) {
          // Send a copy of the buffer
          this.port.postMessage({
            type: 'audioData',
            data: new Float32Array(this.buffer)
          });
          
          // Reset buffer
          this.bufferIndex = 0;
        }
      }
    }
    
    // Return true to keep the processor alive
    return true;
  }
}

registerProcessor('audio-processor', AudioProcessor);

