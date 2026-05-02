export function playTone(audio, frequency, duration, type = "square", gain = 0.04) {
  if (!audio.context) return;

  const now = audio.context.currentTime;
  const oscillator = audio.context.createOscillator();
  const volume = audio.context.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, now);
  volume.gain.setValueAtTime(gain, now);
  volume.gain.exponentialRampToValueAtTime(0.001, now + duration);
  oscillator.connect(volume);
  volume.connect(audio.context.destination);
  oscillator.start(now);
  oscillator.stop(now + duration);
}
