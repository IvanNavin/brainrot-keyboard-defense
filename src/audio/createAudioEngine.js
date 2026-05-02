import { playTone } from "./playTone.js";

export function createAudioEngine() {
  const audio = {
    context: null,
    enabled: true,
    setEnabled(enabled) {
      audio.enabled = enabled;
    },
    resume() {
      if (!audio.enabled) return;
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      if (!audio.context) audio.context = new AudioContext();
      if (audio.context.state === "suspended") audio.context.resume();
    },
    hit() {
      if (!audio.enabled) return;
      playTone(audio, 420, 0.045, "square", 0.035);
      playTone(audio, 760, 0.08, "triangle", 0.025);
    },
    miss() {
      if (!audio.enabled) return;
      playTone(audio, 135, 0.16, "sawtooth", 0.05);
    },
    levelUp() {
      if (!audio.enabled) return;
      playTone(audio, 520, 0.07, "triangle", 0.035);
      window.setTimeout(() => playTone(audio, 780, 0.08, "triangle", 0.03), 70);
    },
    gameOver() {
      if (!audio.enabled) return;
      playTone(audio, 220, 0.16, "sawtooth", 0.045);
      window.setTimeout(() => playTone(audio, 140, 0.22, "sawtooth", 0.04), 130);
    },
  };

  return audio;
}
