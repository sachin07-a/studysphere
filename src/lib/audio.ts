// Web Audio API procedural sound synthesis engine
// Provides 100% offline ambient soundscapes, procedural Lo-Fi music, and crisp UI audio feedback

export type AmbientType = 'rain' | 'forest' | 'cafe' | 'whitenoise' | 'binaural' | 'lofi' | 'synthwave' | 'piano';

class SoundEngine {
  private ctx: AudioContext | null = null;
  private ambientSourceNodes: AudioNode[] = [];
  private ambientGain: GainNode | null = null;
  private currentAmbientType: AmbientType | null = null;
  private lofiIntervalId: number | null = null;
  private isMuted: boolean = false;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // --- UI Sound Effects ---

  playClick() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch {
      // Audio context restricted
    }
  }

  playSuccess() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 (Major Arpeggio)

      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.18, now + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.4);
      });
    } catch {
      // Audio fallback
    }
  }

  playStreakFire() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const bufferSize = this.ctx.sampleRate * 0.4;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(300, now);
      filter.frequency.exponentialRampToValueAtTime(1800, now + 0.3);
      filter.Q.value = 3.0;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start(now);
      noise.stop(now + 0.4);
    } catch {
      // Audio fallback
    }
  }

  playTimerCompletion() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const baseFreq = 440;
      const harmonics = [1, 2.76, 5.4, 8.93];
      const gains = [0.25, 0.12, 0.06, 0.03];

      harmonics.forEach((h, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(baseFreq * h, now);

        gain.gain.setValueAtTime(gains[i], now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 2.5);
      });
    } catch {
      // Audio fallback
    }
  }

  // --- Procedural Ambient & Lo-Fi Soundscapes ---

  startAmbient(type: AmbientType, volume = 0.35) {
    this.stopAmbient();
    try {
      this.initCtx();
      if (!this.ctx) return;
      this.currentAmbientType = type;

      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(volume, this.ctx.currentTime);
      this.ambientGain.connect(this.ctx.destination);

      switch (type) {
        case 'rain':
          this.createRainSound();
          break;
        case 'forest':
          this.createForestSound();
          break;
        case 'cafe':
          this.createCafeSound();
          break;
        case 'whitenoise':
          this.createWhiteNoiseSound();
          break;
        case 'binaural':
          this.createBinauralSound();
          break;
        case 'lofi':
          this.createLoFiSound();
          break;
        case 'synthwave':
          this.createSynthwaveSound();
          break;
        case 'piano':
          this.createAmbientPianoSound();
          break;
      }
    } catch {
      // Audio restriction
    }
  }

  setAmbientVolume(vol: number) {
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.setTargetAtTime(vol, this.ctx.currentTime, 0.1);
    }
  }

  stopAmbient() {
    if (this.lofiIntervalId !== null) {
      window.clearInterval(this.lofiIntervalId);
      this.lofiIntervalId = null;
    }
    this.ambientSourceNodes.forEach(node => {
      try {
        if ('stop' in node && typeof (node as AudioScheduledSourceNode).stop === 'function') {
          (node as AudioScheduledSourceNode).stop();
        }
        node.disconnect();
      } catch {
        // Ignored
      }
    });
    this.ambientSourceNodes = [];
    this.currentAmbientType = null;
  }

  getCurrentAmbient(): AmbientType | null {
    return this.currentAmbientType;
  }

  private createRainSound() {
    if (!this.ctx || !this.ambientGain) return;
    const bufferSize = 2 * this.ctx.sampleRate;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.08;
      b6 = white * 0.115926;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = buffer;
    whiteNoise.loop = true;

    const lowpass = this.ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.value = 1200;

    whiteNoise.connect(lowpass);
    lowpass.connect(this.ambientGain);

    whiteNoise.start();
    this.ambientSourceNodes.push(whiteNoise, lowpass);
  }

  private createForestSound() {
    if (!this.ctx || !this.ambientGain) return;
    const bufferSize = 2 * this.ctx.sampleRate;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.05;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 450;
    filter.Q.value = 1.2;

    noise.connect(filter);
    filter.connect(this.ambientGain);
    noise.start();
    this.ambientSourceNodes.push(noise, filter);

    const chirpOsc = this.ctx.createOscillator();
    const chirpGain = this.ctx.createGain();
    chirpOsc.type = 'sine';
    chirpOsc.frequency.value = 2800;
    chirpGain.gain.value = 0.02;

    chirpOsc.connect(chirpGain);
    chirpGain.connect(this.ambientGain);
    chirpOsc.start();
    this.ambientSourceNodes.push(chirpOsc, chirpGain);
  }

  private createCafeSound() {
    if (!this.ctx || !this.ambientGain) return;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const cafeGain = this.ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.value = 140;
    osc2.type = 'triangle';
    osc2.frequency.value = 180;

    cafeGain.gain.value = 0.08;

    osc1.connect(cafeGain);
    osc2.connect(cafeGain);
    cafeGain.connect(this.ambientGain);

    osc1.start();
    osc2.start();
    this.ambientSourceNodes.push(osc1, osc2, cafeGain);
  }

  private createWhiteNoiseSound() {
    if (!this.ctx || !this.ambientGain) return;
    const bufferSize = 2 * this.ctx.sampleRate;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.04;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 800;

    noise.connect(filter);
    filter.connect(this.ambientGain);
    noise.start();
    this.ambientSourceNodes.push(noise, filter);
  }

  private createBinauralSound() {
    if (!this.ctx || !this.ambientGain) return;
    const leftOsc = this.ctx.createOscillator();
    const rightOsc = this.ctx.createOscillator();
    const merger = this.ctx.createChannelMerger(2);

    leftOsc.type = 'sine';
    leftOsc.frequency.value = 200;
    rightOsc.type = 'sine';
    rightOsc.frequency.value = 240; // 40Hz Gamma Focus

    leftOsc.connect(merger, 0, 0);
    rightOsc.connect(merger, 0, 1);
    merger.connect(this.ambientGain);

    leftOsc.start();
    rightOsc.start();
    this.ambientSourceNodes.push(leftOsc, rightOsc, merger);
  }

  // --- Procedural Lo-Fi Chords & Vinyl Generator ---
  private createLoFiSound() {
    if (!this.ctx || !this.ambientGain) return;

    // 1. Vinyl Crackle Layer
    const bufferSize = 2 * this.ctx.sampleRate;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      const isPop = Math.random() < 0.003;
      data[i] = isPop ? (Math.random() * 2 - 1) * 0.35 : (Math.random() * 2 - 1) * 0.015;
    }
    const crackle = this.ctx.createBufferSource();
    crackle.buffer = buffer;
    crackle.loop = true;

    const crackleFilter = this.ctx.createBiquadFilter();
    crackleFilter.type = 'bandpass';
    crackleFilter.frequency.value = 2400;
    crackleFilter.Q.value = 2.0;

    const crackleGain = this.ctx.createGain();
    crackleGain.gain.value = 0.08;

    crackle.connect(crackleFilter);
    crackleFilter.connect(crackleGain);
    crackleGain.connect(this.ambientGain);
    crackle.start();
    this.ambientSourceNodes.push(crackle, crackleFilter, crackleGain);

    // 2. Lo-Fi Rhodes Piano Chord Progressions: Dm9 -> G13 -> Cmaj9 -> Am9
    const chords = [
      [293.66, 349.23, 440.00, 523.25, 659.25], // Dm9 (D4, F4, A4, C5, E5)
      [196.00, 293.66, 329.63, 392.00, 523.25], // G13 (G3, D4, E4, G4, C5)
      [261.63, 329.63, 392.00, 493.88, 587.33], // Cmaj9 (C4, E4, G4, B4, D5)
      [220.00, 261.63, 329.63, 440.00, 523.25], // Am9 (A3, C4, E4, A4, C5)
    ];

    let chordIdx = 0;
    const playChord = () => {
      if (!this.ctx || !this.ambientGain) return;
      const notes = chords[chordIdx % chords.length];
      chordIdx++;
      const now = this.ctx.currentTime;

      notes.forEach((freq, i) => {
        if (!this.ctx || !this.ambientGain) return;
        const osc = this.ctx.createOscillator();
        const noteGain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'triangle';
        // Tape flutter detune
        osc.frequency.setValueAtTime(freq + (Math.random() - 0.5) * 1.8, now + i * 0.03);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(900, now);
        filter.frequency.exponentialRampToValueAtTime(450, now + 3.0);

        noteGain.gain.setValueAtTime(0, now + i * 0.03);
        noteGain.gain.linearRampToValueAtTime(0.06, now + i * 0.03 + 0.1);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.03 + 3.2);

        osc.connect(filter);
        filter.connect(noteGain);
        noteGain.connect(this.ambientGain);

        osc.start(now + i * 0.03);
        osc.stop(now + i * 0.03 + 3.3);
      });
    };

    playChord();
    this.lofiIntervalId = window.setInterval(playChord, 3400);
  }

  // --- Procedural Synthwave Focus Generator ---
  private createSynthwaveSound() {
    if (!this.ctx || !this.ambientGain) return;

    // Warm 80s analog saw pad with slow LFO
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const padGain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc1.type = 'sawtooth';
    osc1.frequency.value = 110; // A2
    osc2.type = 'sawtooth';
    osc2.frequency.value = 164.81; // E3

    filter.type = 'lowpass';
    filter.frequency.value = 650;
    padGain.gain.value = 0.09;

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(padGain);
    padGain.connect(this.ambientGain);

    osc1.start();
    osc2.start();
    this.ambientSourceNodes.push(osc1, osc2, filter, padGain);

    // Arpeggiator simulation
    const arpNotes = [220, 261.63, 329.63, 440, 523.25, 440, 329.63, 261.63];
    let arpIdx = 0;
    const playArpNote = () => {
      if (!this.ctx || !this.ambientGain) return;
      const freq = arpNotes[arpIdx % arpNotes.length];
      arpIdx++;
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.ambientGain);

      osc.start(now);
      osc.stop(now + 0.38);
    };

    this.lofiIntervalId = window.setInterval(playArpNote, 420);
  }

  // --- Procedural Ambient Piano Solitude ---
  private createAmbientPianoSound() {
    if (!this.ctx || !this.ambientGain) return;
    const pianoNotes = [
      [261.63, 392.00, 523.25], // C Major
      [220.00, 329.63, 440.00], // A Minor
      [174.61, 261.63, 349.23], // F Major
      [196.00, 293.66, 392.00], // G Major
    ];

    let pIdx = 0;
    const playPiano = () => {
      if (!this.ctx || !this.ambientGain) return;
      const chord = pianoNotes[pIdx % pianoNotes.length];
      pIdx++;
      const now = this.ctx.currentTime;

      chord.forEach((freq, idx) => {
        if (!this.ctx || !this.ambientGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.15);

        gain.gain.setValueAtTime(0.08, now + idx * 0.15);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.15 + 4.0);

        osc.connect(gain);
        gain.connect(this.ambientGain);

        osc.start(now + idx * 0.15);
        osc.stop(now + idx * 0.15 + 4.1);
      });
    };

    playPiano();
    this.lofiIntervalId = window.setInterval(playPiano, 4500);
  }
}

export const soundEngine = new SoundEngine();
