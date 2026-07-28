import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { DonationAlert } from "./donation-alert/DonationAlert";
import type { DonationAlertProps } from "./donation-alert/schema";

/**
 * Drifting colour blobs standing in for a live camera feed. Only here so the
 * overlay can be reviewed against moving content — the shipped alerts render
 * on a transparent canvas.
 */
const MockStage: React.FC = () => {
  const frame = useCurrentFrame();

  const blobs = [
    { hue: "#2A3E6B", size: 1500, x: -180, y: 240, speed: 1.0 },
    { hue: "#6B2A4E", size: 1300, x: 640, y: 1420, speed: -0.7 },
    { hue: "#1F5A5E", size: 1100, x: 820, y: 520, speed: 0.5 },
    { hue: "#3A2A6B", size: 1250, x: -120, y: 1650, speed: -0.4 },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0B10", overflow: "hidden" }}>
      {blobs.map((blob, i) => {
        const drift = Math.sin((frame / 90) * blob.speed + i) * 70;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: blob.x,
              top: blob.y,
              width: blob.size,
              height: blob.size,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${blob.hue} 0%, transparent 68%)`,
              filter: "blur(50px)",
              opacity: 0.85,
              translate: `${drift}px ${drift * 0.6}px`,
            }}
          />
        );
      })}

      {/* Film grain keeps the flat gradients from banding. */}
      {new Array(340).fill(true).map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: random(`gx-${i}`) * 1080,
            top: random(`gy-${i}`) * 1920,
            width: 3,
            height: 3,
            borderRadius: 3,
            backgroundColor: "#FFFFFF",
            opacity: 0.02 + random(`go-${i}`) * 0.05,
          }}
        />
      ))}

      <AbsoluteFill
        style={{
          background:
            "radial-gradient(120% 80% at 50% 50%, transparent 40%, rgba(0,0,0,0.55) 100%)",
          opacity: interpolate(frame, [0, 30], [0.9, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      />
    </AbsoluteFill>
  );
};

export const DemoStage: React.FC<DonationAlertProps> = (props) => {
  return (
    <AbsoluteFill>
      <MockStage />
      <DonationAlert {...props} />
    </AbsoluteFill>
  );
};
