export type ColorCategory =
  | "All"
  | "Black"
  | "White"
  | "Grey"
  | "Red"
  | "Orange"
  | "Yellow"
  | "Green"
  | "Blue"
  | "Purple";

export const getColorCategory = (hex: string): ColorCategory => {
  if (!hex) return "All";

  // Remove # if present
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  const s = max === 0 ? 0 : d / max;
  const v = max / 255;

  // Grayscale detection
  if (v < 0.2) return "Black";
  if (v > 0.8 && s < 0.2) return "White";
  if (s < 0.15) return "Grey";

  // Hue calculation
  let h = 0;
  if (d !== 0) {
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h /= 6;
  }

  const hueDegrees = h * 360;

  if (hueDegrees < 20 || hueDegrees >= 330) return "Red";
  if (hueDegrees < 50) return "Orange";
  if (hueDegrees < 75) return "Yellow";
  if (hueDegrees < 165) return "Green";
  if (hueDegrees < 260) return "Blue";
  if (hueDegrees < 330) return "Purple";

  return "All";
};
