export class BinauralAudioEngine {
  private ctx: AudioContext | null = null;
  private leftOsc: OscillatorNode | null = null;
  private rightOsc: OscillatorNode | null = null;
  private leftGain: GainNode | null = null;
  private rightGain: GainNode | null = null;
  private merger: ChannelMergerNode | null = null;
  private masterGain: GainNode | null = null;
  private ambientSource: AudioBufferSourceNode | null = null;
  private ambientGain: GainNode | null = null;
  private noiseNode: AudioWorkletNode | ScriptProcessorNode | null = null;
  private analyser: AnalyserNode | null = null;
  private isPlaying = false;

  async start(carrierHz: number, beatHz: number, volume = 0.5) {
    // Create context and ensure it's running (autoplay policy)
    this.ctx = new AudioContext();
    if (this.ctx.state === "suspended") {
      await this.ctx.resume();
    }

    this.merger = this.ctx.createChannelMerger(2);
    this.masterGain = this.ctx.createGain();

    // Left oscillator
    this.leftOsc = this.ctx.createOscillator();
    this.leftOsc.type = "sine";
    this.leftOsc.frequency.setValueAtTime(carrierHz, this.ctx.currentTime);
    this.leftGain = this.ctx.createGain();
    this.leftGain.gain.setValueAtTime(1, this.ctx.currentTime);
    this.leftOsc.connect(this.leftGain);
    this.leftGain.connect(this.merger, 0, 0);

    // Right oscillator
    this.rightOsc = this.ctx.createOscillator();
    this.rightOsc.type = "sine";
    this.rightOsc.frequency.setValueAtTime(carrierHz + beatHz, this.ctx.currentTime);
    this.rightGain = this.ctx.createGain();
    this.rightGain.gain.setValueAtTime(1, this.ctx.currentTime);
    this.rightOsc.connect(this.rightGain);
    this.rightGain.connect(this.merger, 0, 1);

    // Analyser for visualization
    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 2048;
    this.analyser.smoothingTimeConstant = 0.8;

    // Audio routing: merger -> masterGain -> analyser -> destination
    this.merger.connect(this.masterGain);
    this.masterGain.connect(this.analyser);
    this.analyser.connect(this.ctx.destination);

    // Start oscillators
    this.leftOsc.start(0);
    this.rightOsc.start(0);

    // Fade in: set to 0 first, then ramp up
    this.masterGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    this.masterGain.gain.exponentialRampToValueAtTime(
      Math.max(volume, 0.001),
      this.ctx.currentTime + 2
    );

    this.isPlaying = true;
  }

  setVolume(volume: number) {
    if (this.masterGain && this.ctx) {
      const safeVol = Math.max(volume, 0.001);
      this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, this.ctx.currentTime);
      this.masterGain.gain.exponentialRampToValueAtTime(safeVol, this.ctx.currentTime + 0.3);
    }
  }

  setFrequency(carrierHz: number, beatHz: number) {
    if (this.leftOsc && this.rightOsc && this.ctx) {
      this.leftOsc.frequency.setValueAtTime(this.leftOsc.frequency.value, this.ctx.currentTime);
      this.leftOsc.frequency.linearRampToValueAtTime(carrierHz, this.ctx.currentTime + 0.5);
      this.rightOsc.frequency.setValueAtTime(this.rightOsc.frequency.value, this.ctx.currentTime);
      this.rightOsc.frequency.linearRampToValueAtTime(carrierHz + beatHz, this.ctx.currentTime + 0.5);
    }
  }

  startAmbientNoise(type: "rain" | "whitenoise" | "ocean", volume = 0.3) {
    this.stopAmbient();
    if (!this.ctx) return;

    this.ambientGain = this.ctx.createGain();
    this.ambientGain.gain.setValueAtTime(0.001, this.ctx.currentTime);

    const bufferSize = 4096;
    const processor = this.ctx.createScriptProcessor(bufferSize, 1, 1);

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    processor.onaudioprocess = (e) => {
      const output = e.outputBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;

        if (type === "whitenoise") {
          output[i] = white * 0.5;
        } else if (type === "rain") {
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.969 * b2 + white * 0.153852;
          b3 = 0.8665 * b3 + white * 0.3104856;
          b4 = 0.55 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.016898;
          output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.06;
          b6 = white * 0.115926;
        } else if (type === "ocean") {
          b0 = (b0 + 0.02 * white) / 1.02;
          output[i] = b0 * 3.5;
        }
      }
    };

    processor.connect(this.ambientGain);
    this.ambientGain.connect(this.ctx.destination);
    this.ambientGain.gain.exponentialRampToValueAtTime(
      Math.max(volume, 0.001),
      this.ctx.currentTime + 1
    );
    this.noiseNode = processor as any;
  }

  setAmbientVolume(volume: number) {
    if (this.ambientGain && this.ctx) {
      const safeVol = Math.max(volume, 0.001);
      this.ambientGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.ambientGain.gain.setValueAtTime(this.ambientGain.gain.value, this.ctx.currentTime);
      this.ambientGain.gain.exponentialRampToValueAtTime(safeVol, this.ctx.currentTime + 0.3);
    }
  }

  stopAmbient() {
    if (this.noiseNode) {
      this.noiseNode.disconnect();
      this.noiseNode = null;
    }
    if (this.ambientGain) {
      this.ambientGain.disconnect();
      this.ambientGain = null;
    }
  }

  async pause() {
    if (this.ctx && this.isPlaying) {
      await this.ctx.suspend();
      this.isPlaying = false;
    }
  }

  async resume() {
    if (this.ctx && !this.isPlaying) {
      await this.ctx.resume();
      this.isPlaying = true;
    }
  }

  async stop() {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, this.ctx.currentTime);
      this.masterGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1);
      await new Promise((r) => setTimeout(r, 1100));
    }
    this.stopAmbient();
    try { this.leftOsc?.stop(); } catch {}
    try { this.rightOsc?.stop(); } catch {}
    try { await this.ctx?.close(); } catch {}
    this.ctx = null;
    this.analyser = null;
    this.isPlaying = false;
  }

  getIsPlaying() {
    return this.isPlaying;
  }

  getAnalyser(): AnalyserNode | null {
    return this.analyser;
  }

  getWaveformData(): Uint8Array | null {
    if (!this.analyser) return null;
    const data = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteTimeDomainData(data);
    return data;
  }

  getFrequencyData(): Uint8Array | null {
    if (!this.analyser) return null;
    const data = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(data);
    return data;
  }
}
