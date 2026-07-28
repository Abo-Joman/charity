import { Easing } from "remotion";

/**
 * Motion curves used across the alert.
 * EASE_BACK overshoots on purpose — it gives the card and badge their "pop".
 */
export const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const EASE_BACK = Easing.bezier(0.34, 1.56, 0.64, 1);
export const EASE_IN_OUT = Easing.bezier(0.65, 0, 0.35, 1);

export const PALETTE = {
  cyan: "#25F4EE",
  pink: "#FE2C55",
  gold: "#FFD873",
  goldDeep: "#FF8A1E",
  ink: "#080A11",
  textPrimary: "#FFFFFF",
  textSecondary: "rgba(255,255,255,0.62)",
  hairline: "rgba(255,255,255,0.10)",
};

export const CARD = {
  width: 880,
  radius: 46,
  ringWidth: 4,
  padding: 52,
};

/**
 * Adds an alpha channel to a `#rrggbb` value so accent colours can be reused
 * inside shadows and tints. Non-hex inputs (`rgba(...)`, named colours) are
 * passed through untouched.
 */
export const withAlpha = (color: string, alpha: number): string => {
  if (!/^#[0-9a-f]{6}$/i.test(color)) {
    return color;
  }
  const hex = Math.round(Math.min(Math.max(alpha, 0), 1) * 255)
    .toString(16)
    .padStart(2, "0");
  return `${color}${hex}`;
};

/** Frosted-glass body of the card. */
export const CARD_SURFACE: React.CSSProperties = {
  background:
    "linear-gradient(155deg, rgba(26,28,40,0.95) 0%, rgba(11,13,20,0.97) 52%, rgba(20,14,26,0.96) 100%)",
  boxShadow: [
    "inset 0 1px 0 rgba(255,255,255,0.15)",
    "inset 0 -1px 0 rgba(0,0,0,0.55)",
    "0 40px 90px rgba(0,0,0,0.55)",
  ].join(", "),
};
