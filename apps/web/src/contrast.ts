/** Kontrast zu Weiß (WCAG) – die Hausfarbe dient als Hintergrund weißer Schrift und als Schriftfarbe */
export function contrast(hex: string) {
  if (!/^#[0-9a-f]{6}$/i.test(hex)) return 0;
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 1.05 / (0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2] + 0.05);
}
