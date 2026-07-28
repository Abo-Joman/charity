import { interpolate, useCurrentFrame } from "remotion";
import { EASE_IN_OUT } from "../theme";
import type { Span } from "./timing";

/**
 * A specular highlight that travels once across the glass, the way light
 * catches a physical card as it turns.
 */
export const ShineSweep: React.FC<{ span: Span }> = ({ span }) => {
  const frame = useCurrentFrame();

  const progress = interpolate(frame, [span.start, span.end], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_IN_OUT,
  });

  if (progress <= 0 || progress >= 1) {
    return null;
  }

  return (
    <div
      style={{
        position: "absolute",
        top: "-40%",
        left: 0,
        width: "38%",
        height: "180%",
        background:
          "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.02) 30%, rgba(255,255,255,0.20) 50%, rgba(255,255,255,0.02) 70%, transparent 100%)",
        rotate: "16deg",
        translate: `${interpolate(progress, [0, 1], [-120, 320])}%`,
        pointerEvents: "none",
      }}
    />
  );
};
