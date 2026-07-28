import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { CARD, EASE_OUT, withAlpha } from "../theme";
import type { Timing } from "./timing";

type Props = {
  timing: Timing;
  accentFrom: string;
  accentTo: string;
};

/**
 * The hit on frame 0: the card's rim flashes white and blooms outward.
 *
 * Two shapes this deliberately avoids. A radial flash would strobe the whole
 * stream and band against a transparent canvas. An expanding outline of the
 * card silhouette can't work either — the card is 880px of a 1080px canvas, so
 * anything past ~1.2x pushes its left and right edges off-frame and the
 * remaining top and bottom edges read as full-width horizontal lines.
 * A rim that stays on the card has neither problem.
 */
export const ImpactBurst: React.FC<Props> = ({
  timing,
  accentFrom,
  accentTo,
}) => {
  const frame = useCurrentFrame();
  const { sec } = timing;
  const span = sec(0.45);

  const fade = interpolate(frame, [0, span * 0.12, span], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const spread = interpolate(frame, [0, span], [1, 1.055], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT,
  });

  return (
    <AbsoluteFill>
      {/* Soft bloom — feathered, so the little that overflows never shows a seam. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: CARD.radius,
          boxShadow: [
            `0 0 70px 12px ${withAlpha(accentFrom, 0.3 * fade)}`,
            `0 0 130px 30px ${withAlpha(accentTo, 0.14 * fade)}`,
          ].join(", "),
        }}
      />
      {/* Hard rim */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: CARD.radius,
          border: `3px solid rgba(255,255,255,${0.95 * fade})`,
          scale: spread,
        }}
      />
    </AbsoluteFill>
  );
};
