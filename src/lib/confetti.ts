import confetti from "canvas-confetti";

/**
 * Triggers a grand congratulatory confetti celebration with metallic shiny colors and ribbon strips.
 */
export function fireCongratulationsConfetti() {
  if (typeof window === "undefined") return;

  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
    colors: [
      "#FFD700", // Gold
      "#FF69B4", // Hot Pink
      "#00E5FF", // Cyan
      "#76FF03", // Lime Green
      "#FF3D00", // Bright Orange
      "#E040FB", // Purple
      "#FFFFFF", // Silver/White
    ],
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  // Multi-stage explosion: center burst, sides cannon
  fire(0.25, {
    spread: 26,
    startVelocity: 55,
    scalar: 1.2,
  });

  fire(0.2, {
    spread: 60,
    startVelocity: 45,
    scalar: 1.0,
  });

  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.9,
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.1,
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 45,
    scalar: 1.3,
  });

  // Cannon burst from left and right corners
  setTimeout(() => {
    confetti({
      particleCount: 80,
      angle: 60,
      spread: 70,
      origin: { x: 0, y: 0.8 },
      colors: defaults.colors,
    });
    confetti({
      particleCount: 80,
      angle: 120,
      spread: 70,
      origin: { x: 1, y: 0.8 },
      colors: defaults.colors,
    });
  }, 200);
}
