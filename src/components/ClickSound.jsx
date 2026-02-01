export const playClickSound = () => {
  const audio = new Audio("/mixkit-typewriter-soft-click-1125.mp3");
  audio.volume = 0.5;
  audio.play().catch((err) => console.log("Audio play error:", err));
};
