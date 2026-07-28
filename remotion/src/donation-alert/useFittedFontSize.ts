import { fitText } from "@remotion/layout-utils";
import { useEffect, useState } from "react";
import { continueRender, delayRender } from "remotion";
import { cairo, waitUntilFontLoaded } from "../fonts";

type Options = {
  text: string;
  withinWidth: number;
  /** Never grow past this — the design size for short strings. */
  maxFontSize: number;
  /**
   * Legibility floor. Past this the text ellipsizes instead of shrinking
   * further; unreadable is worse than clipped.
   */
  minFontSize: number;
  fontWeight: number;
};

/**
 * Shrinks a single line of text just enough to fit its column.
 *
 * Donor names are user data and vary from "Sam" to a full four-part Arabic
 * name, and Latin runs noticeably wider than Arabic at the same size. A fixed
 * size either truncates the long ones or wastes the card on the short ones.
 *
 * Measurement needs the real font, so this holds the frame until Cairo is
 * ready and then re-renders — measuring against a fallback face would size
 * the text for the wrong glyphs.
 */
export const useFittedFontSize = ({
  text,
  withinWidth,
  maxFontSize,
  minFontSize,
  fontWeight,
}: Options): number => {
  const [fontReady, setFontReady] = useState(false);

  useEffect(() => {
    const handle = delayRender("Loading Cairo before measuring the donor name");
    let cancelled = false;

    waitUntilFontLoaded()
      .then(() => {
        if (!cancelled) {
          setFontReady(true);
        }
      })
      .finally(() => continueRender(handle));

    return () => {
      cancelled = true;
    };
  }, []);

  if (!fontReady) {
    return maxFontSize;
  }

  const { fontSize } = fitText({
    text,
    withinWidth,
    fontFamily: cairo,
    fontWeight,
  });

  return Math.max(Math.min(fontSize, maxFontSize), minFontSize);
};
