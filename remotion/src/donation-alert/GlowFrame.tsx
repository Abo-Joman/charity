import { interpolate, useCurrentFrame } from "remotion";
import { CARD, CARD_SURFACE, withAlpha } from "../theme";
import type { Timing } from "./timing";

type Props = {
  timing: Timing;
  accentFrom: string;
  accentTo: string;
  goldFrom: string;
  children: React.ReactNode;
};

/**
 * The card shell: a rotating conic-gradient ring plus the glass body.
 *
 * The ambient glow is built from layered box-shadows rather than a blurred
 * element — a blurred div large enough to read as glow also bands badly once
 * it is composited against transparency.
 */
export const GlowFrame: React.FC<Props> = ({
  timing,
  accentFrom,
  accentTo,
  goldFrom,
  children,
}) => {
  const frame = useCurrentFrame();
  const { sec } = timing;

  const conic = `conic-gradient(from 0deg, ${accentFrom} 0%, ${goldFrom} 22%, ${accentTo} 44%, ${accentFrom} 62%, ${goldFrom} 80%, ${accentFrom} 100%)`;

  // Flares on arrival, then settles into a slow breath.
  const glow =
    interpolate(frame, [0, sec(0.55)], [1, 0.62], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }) + Math.sin((frame / sec(2.1)) * Math.PI * 2) * 0.07;

  return (
    <div
      style={{
        position: "relative",
        width: CARD.width,
        borderRadius: CARD.radius,
        // One hue only. Mixing accent colours across different blur radii
        // stacks into visible concentric rings instead of a bloom.
        // One hue only, and kept tight. Mixing accent colours across radii
        // stacks into concentric rings, and a wide low-alpha falloff
        // quantises into visible steps against a transparent canvas.
        boxShadow: [
          `0 0 16px ${withAlpha(accentFrom, 0.38 * glow)}`,
          `0 0 38px ${withAlpha(accentFrom, 0.14 * glow)}`,
          "0 24px 56px rgba(0,0,0,0.55)",
        ].join(", "),
      }}
    >
      {/* Rotating ring */}
      <div
        style={{
          position: "relative",
          borderRadius: CARD.radius,
          padding: CARD.ringWidth,
          overflow: "hidden",
          isolation: "isolate",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: CARD.width * 2.2,
            height: CARD.width * 2.2,
            marginTop: -CARD.width * 1.1,
            marginLeft: -CARD.width * 1.1,
            background: conic,
            rotate: `${frame * 2.6}deg`,
          }}
        />

        {/* Glass body */}
        <div
          style={{
            position: "relative",
            borderRadius: CARD.radius - CARD.ringWidth,
            overflow: "hidden",
            ...CARD_SURFACE,
          }}
        >
          {/* Top sheen + accent corner tints keep the fill from going flat. */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: [
                "radial-gradient(120% 70% at 50% -20%, rgba(255,255,255,0.14) 0%, transparent 60%)",
                `radial-gradient(70% 90% at 100% 0%, ${withAlpha(accentFrom, 0.12)} 0%, transparent 70%)`,
                `radial-gradient(70% 90% at 0% 100%, ${withAlpha(accentTo, 0.1)} 0%, transparent 70%)`,
              ].join(", "),
              pointerEvents: "none",
            }}
          />
          {children}
        </div>
      </div>
    </div>
  );
};
