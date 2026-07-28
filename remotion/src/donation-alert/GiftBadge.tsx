import { Img, interpolate, useCurrentFrame } from "remotion";
import { EASE_BACK, EASE_OUT } from "../theme";
import type { Span } from "./timing";

export const BADGE_SIZE = 168;
const SIZE = BADGE_SIZE;

const GiftMark: React.FC<{ from: string; to: string }> = ({ from, to }) => (
  <svg width={88} height={88} viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="giftFill" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={from} />
        <stop offset="100%" stopColor={to} />
      </linearGradient>
    </defs>
    <path
      d="M12 6.2c-.9-2-2.2-3-3.9-3A3.1 3.1 0 0 0 5 6.3c0 .7.2 1.3.6 1.9H4a1.6 1.6 0 0 0-1.6 1.6v2.1c0 .6.4 1 1 1h17.2c.6 0 1-.4 1-1v-2.1A1.6 1.6 0 0 0 20 8.2h-1.6c.4-.6.6-1.2.6-1.9a3.1 3.1 0 0 0-3.1-3.1c-1.7 0-3 1-3.9 3Zm-1.7 2h-2.2a1.9 1.9 0 1 1 1.3-3.3c.5.5.8 1.6.9 3.3Zm3.4 0c.1-1.7.4-2.8.9-3.3a1.9 1.9 0 1 1 1.3 3.3h-2.2Z"
      fill="url(#giftFill)"
    />
    <path
      d="M4 14.4h6.9v6.4H5.6A1.6 1.6 0 0 1 4 19.2v-4.8Zm9.1 0H20v4.8a1.6 1.6 0 0 1-1.6 1.6h-5.3v-6.4Z"
      fill="url(#giftFill)"
    />
  </svg>
);

type Props = {
  span: Span;
  accentFrom: string;
  accentTo: string;
  goldFrom: string;
  goldTo: string;
  giftImage: string;
};

/**
 * Circular gift medallion. Pops in with an overshoot and an unwinding rotation,
 * then keeps a slow sheen rotating behind the glyph.
 */
export const GiftBadge: React.FC<Props> = ({
  span,
  accentFrom,
  accentTo,
  goldFrom,
  goldTo,
  giftImage,
}) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        position: "relative",
        width: SIZE,
        height: SIZE,
        flexShrink: 0,
        borderRadius: "50%",
        padding: 4,
        background: `linear-gradient(140deg, ${accentFrom}, ${accentTo})`,
        boxShadow: `0 0 34px ${accentFrom}66, 0 14px 30px rgba(0,0,0,0.45)`,
        opacity: interpolate(
          frame,
          [span.start, span.start + (span.end - span.start) * 0.35],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        ),
        scale: interpolate(frame, [span.start, span.end], [0.2, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: EASE_BACK,
        }),
        rotate: `${interpolate(frame, [span.start, span.end], [-38, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: EASE_OUT,
        })}deg`,
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          overflow: "hidden",
          background:
            "radial-gradient(120% 120% at 30% 15%, #1B1E2B 0%, #0A0C13 70%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Slow sheen behind the glyph */}
        <div
          style={{
            position: "absolute",
            inset: "-50%",
            background: `conic-gradient(from 0deg, transparent 0%, ${goldFrom}3D 18%, transparent 38%, transparent 100%)`,
            rotate: `${frame * 1.8}deg`,
          }}
        />
        {giftImage === "" ? (
          <GiftMark from={goldFrom} to={goldTo} />
        ) : (
          <Img
            src={giftImage}
            style={{ width: 104, height: 104, objectFit: "contain" }}
          />
        )}
      </div>
    </div>
  );
};
