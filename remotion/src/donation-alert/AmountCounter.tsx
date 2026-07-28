import { interpolate, useCurrentFrame } from "remotion";
import { EASE_OUT, withAlpha } from "../theme";
import type { Span } from "./timing";

type Props = {
  span: Span;
  amount: number;
  currency: string;
  goldFrom: string;
  goldTo: string;
};

/**
 * Counts the amount up inside a gold chip, then lands with a single scale
 * pulse — the beat the viewer's eye is waiting for.
 */
export const AmountCounter: React.FC<Props> = ({
  span,
  amount,
  currency,
  goldFrom,
  goldTo,
}) => {
  const frame = useCurrentFrame();
  const countEnd = span.start + (span.end - span.start) * 0.72;

  const value = interpolate(frame, [span.start, countEnd], [0, amount], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT,
  });

  // Pulse fires as the counter settles.
  const pulse = interpolate(
    frame,
    [countEnd - 2, countEnd + 4, span.end],
    [1, 1.06, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const goldText: React.CSSProperties = {
    backgroundImage: `linear-gradient(180deg, #FFFFFF 0%, ${goldFrom} 40%, ${goldTo} 100%)`,
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    color: "transparent",
  };

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "baseline",
        gap: 16,
        flexShrink: 0,
        padding: "16px 34px 22px",
        borderRadius: 28,
        background: `linear-gradient(150deg, ${withAlpha(goldFrom, 0.18)} 0%, ${withAlpha(goldTo, 0.05)} 100%)`,
        border: `2px solid ${withAlpha(goldFrom, 0.4)}`,
        boxShadow: [
          `0 0 38px ${withAlpha(goldFrom, 0.22)}`,
          "inset 0 1px 0 rgba(255,255,255,0.14)",
        ].join(", "),
        opacity: interpolate(
          frame,
          [span.start, span.start + (span.end - span.start) * 0.2],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        ),
        scale: pulse,
      }}
    >
      <span
        style={{
          ...goldText,
          fontSize: 108,
          fontWeight: 900,
          lineHeight: 1,
          letterSpacing: -2,
          fontVariantNumeric: "tabular-nums",
          filter: `drop-shadow(0 0 22px ${withAlpha(goldFrom, 0.45)})`,
        }}
      >
        {Math.round(value).toLocaleString("en-US")}
      </span>
      <span style={{ ...goldText, fontSize: 46, fontWeight: 700, lineHeight: 1 }}>
        {currency}
      </span>
    </div>
  );
};
