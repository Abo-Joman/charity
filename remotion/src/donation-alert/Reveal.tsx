import { interpolate, useCurrentFrame } from "remotion";
import { EASE_OUT } from "../theme";
import type { Span } from "./timing";

type Props = {
  span: Span;
  /** Direction the wipe opens from. Matches the reading direction. */
  rtl: boolean;
  lift?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
};

/**
 * Wipes content into view along the reading direction while lifting it a few
 * pixels. The padding/negative-margin pair keeps glows and descenders inside
 * the clip box so nothing gets sliced.
 */
export const Reveal: React.FC<Props> = ({
  span,
  rtl,
  lift = 26,
  style,
  children,
}) => {
  const frame = useCurrentFrame();

  const progress = interpolate(frame, [span.start, span.end], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT,
  });

  const hidden = (1 - progress) * 100;
  const clipPath = rtl
    ? `inset(0% 0% 0% ${hidden}%)`
    : `inset(0% ${hidden}% 0% 0%)`;

  return (
    <div
      style={{
        ...style,
        padding: "22px 0",
        margin: "-22px 0",
        clipPath,
        opacity: interpolate(
          frame,
          [span.start, span.start + (span.end - span.start) * 0.4],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        ),
        translate: `0px ${(1 - progress) * lift}px`,
      }}
    >
      {children}
    </div>
  );
};
