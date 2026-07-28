// Web Audio API Sound Synthesizer for Bruno Simon Clone Portfolio
class SoundSystem {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private engineOsc: OscillatorNode | null = null;
  private engineGain: GainNode | null = null;
  private driftOsc: OscillatorNode | null = null;
  private driftGain: GainNode | null = null;
  private isMuted: boolean = false;

  constructor() {
    // AudioContext will be initialized on first user gesture
  }

  private init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.15, this.ctx.currentTime); // keep overall volume comfortable
      this.masterGain.connect(this.ctx.destination);
      this.startEngineSound();
      this.startDriftSound();
    } catch (e) {
      console.warn("Web Audio API not supported", e);
    }
  }

  public toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.15, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  public getMuteState() {
    return this.isMuted;
  }

  private startEngineSound() {
    if (!this.ctx || !this.masterGain) return;

    try {
      // Create a low frequency sawtooth wave for the engine rumble
      this.engineOsc = this.ctx.createOscillator();
      this.engineGain = this.ctx.createGain();

      this.engineOsc.type = "sawtooth";
      this.engineOsc.frequency.setValueAtTime(45, this.ctx.currentTime); // low idle pitch

      // Filter high harsh frequencies for a softer rumble
      const filter = this.ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(150, this.ctx.currentTime);

      this.engineGain.gain.setValueAtTime(0.005, this.ctx.currentTime); // very quiet idle

      this.engineOsc.connect(filter);
      filter.connect(this.engineGain);
      this.engineGain.connect(this.masterGain);
      this.engineOsc.start();
    } catch (e) {
      console.error(e);
    }
  }

  private startDriftSound() {
    if (!this.ctx || !this.masterGain) return;

    try {
      // Squealing sound using triangle/sawtooth
      this.driftOsc = this.ctx.createOscillator();
      this.driftGain = this.ctx.createGain();

      this.driftOsc.type = "sine";
      this.driftOsc.frequency.setValueAtTime(800, this.ctx.currentTime);

      // Lowpass filter to make it screechy but not painful
      const filter = this.ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(1000, this.ctx.currentTime);
      filter.Q.setValueAtTime(2, this.ctx.currentTime);

      this.driftGain.gain.setValueAtTime(0, this.ctx.currentTime); // silent by default

      this.driftOsc.connect(filter);
      filter.connect(this.driftGain);
      this.driftGain.connect(this.masterGain);
      this.driftOsc.start();
    } catch (e) {
      console.error(e);
    }
  }

  public setEngineSpeed(speedRatio: number) {
    this.init();
    if (!this.ctx || this.isMuted || !this.engineOsc || !this.engineGain) return;

    // Map speed ratio (0 to 1) to frequency (45Hz to 160Hz)
    const pitch = 45 + speedRatio * 115;
    // Map speed ratio to gain (quieter at idle, louder when accelerating)
    const volume = 0.006 + speedRatio * 0.025;

    this.engineOsc.frequency.setTargetAtTime(pitch, this.ctx.currentTime, 0.1);
    this.engineGain.gain.setTargetAtTime(volume, this.ctx.currentTime, 0.1);
  }

  public setDriftActive(active: boolean) {
    this.init();
    if (!this.ctx || this.isMuted || !this.driftOsc || !this.driftGain) return;

    const targetGain = active ? 0.015 : 0;
    // Modulate pitch slightly for drift realism
    if (active) {
      const pitch = 700 + Math.random() * 150;
      this.driftOsc.frequency.setValueAtTime(pitch, this.ctx.currentTime);
    }
    this.driftGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.05);
  }

  public playCrash(intensity: number = 0.5) {
    this.init();
    if (!this.ctx || this.isMuted || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      // Synthesize a thump using low frequency sine decay and high-frequency noise-like burst
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.exponentialRampToValueAtTime(10, now + 0.35);

      const level = Math.min(0.25, 0.05 + intensity * 0.2);
      gain.gain.setValueAtTime(level, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      const filter = this.ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(300, now);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.4);
    } catch (e) {
      console.error(e);
    }
  }

  public playStrike() {
    this.init();
    const ctx = this.ctx;
    const master = this.masterGain;
    if (!ctx || this.isMuted || !master) return;

    try {
      const now = ctx.currentTime;
      // Strike has multiple high-frequency metallic notes + wooden thuds
      const frequencies = [150, 440, 880, 1200];
      frequencies.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = idx % 2 === 0 ? "triangle" : "sine";
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.5, now + 0.5);

        // Clattering sound has a nice offset for a cascade effect
        const delay = idx * 0.02;
        const volume = (idx === 0 ? 0.08 : 0.04) * (1 - idx * 0.15);

        gain.gain.setValueAtTime(0, now);
        gain.gain.setValueAtTime(volume, now + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.4);

        osc.connect(gain);
        gain.connect(master);

        osc.start(now + delay);
        osc.stop(now + delay + 0.5);
      });
    } catch (e) {
      console.error(e);
    }
  }

  public playCoin() {
    this.init();
    if (!this.ctx || this.isMuted || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      // Double ding sound
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      // Arpeggio
      osc.frequency.setValueAtTime(987.77, now); // B5
      osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.35);
    } catch (e) {
      console.error(e);
    }
  }

  public playJump() {
    this.init();
    if (!this.ctx || this.isMuted || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      // Whoosh sound
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(450, now + 0.25);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.04, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.35);
    } catch (e) {
      console.error(e);
    }
  }

  public playClick() {
    this.init();
    if (!this.ctx || this.isMuted || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.08);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.1);
    } catch (e) {
      console.error(e);
    }
  }

  public playTurbo() {
    this.init();
    if (!this.ctx || this.isMuted || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      // White noise-like roaring whoosh using a low-frequency oscillator and filtered square wave
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(80, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.4);

      filter.type = "bandpass";
      filter.frequency.setValueAtTime(400, now);
      filter.frequency.exponentialRampToValueAtTime(1200, now + 0.4);
      filter.Q.setValueAtTime(3, now);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.07, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.5);
    } catch (e) {
      console.error(e);
    }
  }

  public playPickup() {
    this.init();
    if (!this.ctx || this.isMuted || !this.masterGain) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.1);
      osc.frequency.exponentialRampToValueAtTime(1320, now + 0.2);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      const filter = this.ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(1000, now);
      filter.Q.setValueAtTime(5, now);
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.35);
    } catch (e) { console.error(e); }
  }

  public playAchievement() {
    this.init();
    const ctx = this.ctx;
    const master = this.masterGain;
    if (!ctx || this.isMuted || !master) return;

    try {
      const now = ctx.currentTime;
      // Triumphant arpeggio chords: C4 -> E4 -> G4 -> C5
      const notes = [261.63, 329.63, 392.00, 523.25];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0, now);
        gain.gain.setValueAtTime(0.05, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.4);

        osc.connect(gain);
        gain.connect(master);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.45);
      });
    } catch (e) {
      console.error(e);
    }
  }
}

export const sound = new SoundSystem();
export default sound;
