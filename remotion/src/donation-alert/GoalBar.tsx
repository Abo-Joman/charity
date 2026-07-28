import { interpolate, useCurrentFrame } from "remotion";
import { EASE_OUT, PALETTE } from "../theme";
import type { Span } from "./timing";

type Props = {
  span: Span;
  label: string;
  raised: number;
  target: number;
  accentFrom: string;
  accentTo: string;
  goldFrom: string;
  rtl: boolean;
};

const TRACK_HEIGHT = 18;

/**
 * Campaign progress. The fill eases out to the real ratio and carries a
 * travelling highlight so the bar never looks like a static PNG.
 */
export const GoalBar: React.FC<Props> = ({
  span,
  label,
  raised,
  target,
  accentFrom,
  accentTo,
  goldFrom,
  rtl,
}) => {
  const frame = useCurrentFrame();
  const ratio = Math.min(raised / target, 1);

  const fill = interpolate(frame, [span.start, span.end], [0, ratio], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT,
  });

  const percent = interpolate(frame, [span.start, span.end], [0, ratio * 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT,
  });

  return (
    <div
      style={{
        opacity: interpolate(
          frame,
          [span.start, span.start + (span.end - span.start) * 0.25],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        ),
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 14,
        }}
      >
        <span
          style={{
            color: PALETTE.textSecondary,
            fontSize: 34,
            fontWeight: 600,
          }}
        >
          {label}
        </span>
        <span
          style={{
            color: goldFrom,
            fontSize: 36,
            fontWeight: 900,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {Math.round(percent)}%
        </span>
      </div>

      <div
        style={{
          position: "relative",
          height: TRACK_HEIGHT,
          borderRadius: TRACK_HEIGHT,
          backgroundColor: "rgba(255,255,255,0.08)",
          boxShadow: "inset 0 1px 2px rgba(0,0,0,0.6)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            transformOrigin: rtl ? "right center" : "left center",
            borderRadius: TRACK_HEIGHT,
            background: `linear-gradient(90deg, ${accentTo}, ${goldFrom} 55%, ${accentFrom})`,
            boxShadow: `0 0 20px ${accentFrom}80`,
            scale: `${fill} 1`,
          }}
        />
        {/* Travelling highlight along the filled portion */}
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            width: "22%",
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)",
            translate: `${interpolate(
              frame % (span.end - span.start),
              [0, span.end - span.start],
              [-40, 460],
            )}%`,
            opacity: fill > 0.02 ? 0.7 : 0,
          }}
        />
      </div>
    </div>
  );
};
