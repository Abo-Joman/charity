import { loadFont } from "@remotion/google-fonts/Cairo";

/**
 * Cairo carries both Arabic and Latin glyphs, so donor names in either script
 * render with one consistent face.
 */
const cairoFont = loadFont("normal", {
  weights: ["400", "600", "700", "900"],
  subsets: ["arabic", "latin"],
});

export const cairo = cairoFont.fontFamily;

/**
 * Resolves once the face is actually available to the text-measuring APIs.
 * `loadFont` already blocks the frame capture, but measurement runs during
 * React render, which happens first — so anything measuring text has to wait
 * on this explicitly.
 */
export const waitUntilFontLoaded = cairoFont.waitUntilDone;
