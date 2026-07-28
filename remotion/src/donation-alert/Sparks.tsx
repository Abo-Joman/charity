import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { EASE_OUT } from "../theme";
import type { Timing } from "./timing";

type Props = {
  timing: Timing;
  colors: string[];
  count?: number;
};

/**
 * Confetti streaks thrown out of the card centre. Seeded through Remotion's
 * `random()` so every frame — and every re-render — agrees on the layout.
 */
export const Sparks: React.FC<Props> = ({ timing, colors, count = 44 }) => {
  const frame = useCurrentFrame();
  const { sec } = timing;
  const travel = sec(1.15);

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      {new Array(count).fill(true).map((_, i) => {
        const angle = random(`angle-${i}`) * Math.PI * 2;
        // Kept inside the compact canvas so confetti never clips at the edge.
        const distance = 160 + random(`dist-${i}`) * 210;
        const delay = Math.round(random(`delay-${i}`) * sec(0.18));
        const isStreak = random(`kind-${i}`) > 0.45;
        const length = isStreak ? 26 + random(`len-${i}`) * 46 : 0;
        const thickness = 6 + random(`thick-${i}`) * 8;
        const color = colors[Math.floor(random(`color-${i}`) * colors.length)];
        const spin = (random(`spin-${i}`) - 0.5) * 540;

        const local = frame - delay;
        const progress = interpolate(local, [0, travel], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: EASE_OUT,
        });

        // Radial throw, then gravity drags everything down.
        const x = Math.cos(angle) * distance * progress;
        const y =
          Math.sin(angle) * distance * progress + 130 * progress * progress;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              width: isStreak ? length : thickness,
              height: thickness,
              borderRadius: thickness,
              backgroundColor: color,
              boxShadow: `0 0 14px ${color}`,
              opacity: interpolate(
                local,
                [0, sec(0.1), travel * 0.6, travel],
                [0, 1, 0.85, 0],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
              ),
              translate: `${x}px ${y}px`,
              rotate: `${(angle * 180) / Math.PI + spin * progress}deg`,
              scale: interpolate(progress, [0, 0.25, 1], [0.4, 1, 0.55]),
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
