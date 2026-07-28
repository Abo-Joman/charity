import { Audio } from "@remotion/media";
import { ding, whoosh } from "@remotion/sfx";
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { cairo } from "../fonts";
import { CARD, EASE_BACK, EASE_IN_OUT, EASE_OUT, PALETTE } from "../theme";
import { AmountCounter } from "./AmountCounter";
import { BADGE_SIZE, GiftBadge } from "./GiftBadge";
import { GlowFrame } from "./GlowFrame";
import { GoalBar } from "./GoalBar";
import { ImpactBurst } from "./ImpactBurst";
import { Reveal } from "./Reveal";
import type { DonationAlertProps } from "./schema";
import { ShineSweep } from "./ShineSweep";
import { Sparks } from "./Sparks";
import { getTiming } from "./timing";
import { useFittedFontSize } from "./useFittedFontSize";

const HEADER_GAP = 30;
const NAME_MAX_SIZE = 78;
const NAME_MIN_SIZE = 40;
/** Room left for the donor name once the ring, padding and medallion are out. */
const NAME_WIDTH =
  CARD.width - CARD.ringWidth * 2 - CARD.padding * 2 - BADGE_SIZE - HEADER_GAP;

export const DonationAlert: React.FC<DonationAlertProps> = ({
  label,
  donorName,
  amount,
  currency,
  message,
  giftImage,
  accentFrom,
  accentTo,
  goldFrom,
  goldTo,
  showGoal,
  goalLabel,
  goalRaised,
  goalTarget,
  withSound,
  offsetTop,
  rtl,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const timing = getTiming(fps, durationInFrames);
  const { sec } = timing;

  const nameFontSize = useFittedFontSize({
    text: donorName,
    withinWidth: NAME_WIDTH,
    maxFontSize: NAME_MAX_SIZE,
    minFontSize: NAME_MIN_SIZE,
    fontWeight: 900,
  });

  // ── Entry: overshoot in, blur off ──────────────────────────────────
  const enterScale = interpolate(
    frame,
    [timing.card.start, timing.card.end],
    [0.78, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE_BACK,
    },
  );
  const enterLift = interpolate(
    frame,
    [timing.card.start, timing.card.end],
    [86, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE_OUT },
  );
  const enterBlur = interpolate(
    frame,
    [timing.card.start, timing.card.start + sec(0.3)],
    [16, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // ── Exit: drift up and away ────────────────────────────────────────
  const exitProgress = interpolate(
    frame,
    [timing.out.start, timing.out.end],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE_IN_OUT },
  );

  // ── Idle: a slow breath once everything has landed ─────────────────
  const bob = Math.sin(((frame - sec(1.2)) / sec(2.6)) * Math.PI * 2) * 5;

  return (
    <AbsoluteFill
      style={{
        fontFamily: cairo,
        direction: rtl ? "rtl" : "ltr",
        alignItems: "center",
        justifyContent: offsetTop === 0 ? "center" : "flex-start",
        paddingTop: offsetTop === 0 ? undefined : offsetTop,
      }}
    >
      <div
        style={{
          position: "relative",
          opacity: 1 - exitProgress,
          translate: `0px ${enterLift + bob - exitProgress * 90}px`,
          scale: enterScale * (1 - exitProgress * 0.07),
          filter: enterBlur > 0.4 ? `blur(${enterBlur}px)` : undefined,
        }}
      >
        {/* Shockwave sits behind the card… */}
        <Sequence durationInFrames={Math.ceil(sec(1.0))} layout="none">
          <ImpactBurst
            timing={timing}
            accentFrom={accentFrom}
            accentTo={accentTo}
          />
        </Sequence>

        <GlowFrame
          timing={timing}
          accentFrom={accentFrom}
          accentTo={accentTo}
          goldFrom={goldFrom}
        >
          <div style={{ padding: CARD.padding, position: "relative" }}>
            {/* Header: medallion + who donated */}
            <div style={{ display: "flex", alignItems: "center", gap: HEADER_GAP }}>
              <GiftBadge
                span={timing.badge}
                accentFrom={accentFrom}
                accentTo={accentTo}
                goldFrom={goldFrom}
                goldTo={goldTo}
                giftImage={giftImage}
              />

              <div style={{ minWidth: 0, flex: 1 }}>
                <Reveal span={timing.label} rtl={rtl} lift={16}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      color: accentFrom,
                      fontSize: 36,
                      fontWeight: 700,
                      letterSpacing: rtl ? 0 : 4,
                      textShadow: `0 0 22px ${accentFrom}80`,
                    }}
                  >
                    <span
                      style={{
                        width: 14,
                        height: 14,
                        borderRadius: "50%",
                        backgroundColor: accentFrom,
                        boxShadow: `0 0 16px ${accentFrom}`,
                        flexShrink: 0,
                      }}
                    />
                    {label}
                  </div>
                </Reveal>

                <Reveal
                  span={timing.name}
                  rtl={rtl}
                  style={{ marginTop: 10 }}
                >
                  <div
                    style={{
                      color: PALETTE.textPrimary,
                      fontSize: nameFontSize,
                      fontWeight: 900,
                      lineHeight: 1.14,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      textShadow: "0 6px 24px rgba(0,0,0,0.6)",
                    }}
                  >
                    {donorName}
                  </div>
                </Reveal>
              </div>
            </div>

            {/* Hairline divider, drawn out from the reading edge */}
            <div
              style={{
                height: 2,
                marginTop: 40,
                marginBottom: 34,
                background: `linear-gradient(${
                  rtl ? "270deg" : "90deg"
                }, ${accentFrom}, ${goldFrom} 45%, transparent)`,
                transformOrigin: rtl ? "right center" : "left center",
                scale: `${interpolate(
                  frame,
                  [timing.divider.start, timing.divider.end],
                  [0, 1],
                  {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                    easing: EASE_OUT,
                  },
                )} 1`,
              }}
            />

            {/* Amount and note share a row so neither half of the card
                reads as dead space. */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 30,
              }}
            >
              <AmountCounter
                span={timing.amount}
                amount={amount}
                currency={currency}
                goldFrom={goldFrom}
                goldTo={goldTo}
              />

              {message === "" ? null : (
                <Reveal
                  span={timing.message}
                  rtl={rtl}
                  lift={18}
                  style={{ minWidth: 0, flex: 1 }}
                >
                  <div
                    style={{
                      color: PALETTE.textSecondary,
                      fontSize: 40,
                      fontWeight: 600,
                      lineHeight: 1.38,
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    “{message}”
                  </div>
                </Reveal>
              )}
            </div>

            {showGoal ? (
              <div
                style={{
                  marginTop: 40,
                  paddingTop: 34,
                  borderTop: `1px solid ${PALETTE.hairline}`,
                }}
              >
                <GoalBar
                  span={timing.goal}
                  label={goalLabel}
                  raised={goalRaised}
                  target={goalTarget}
                  accentFrom={accentFrom}
                  accentTo={accentTo}
                  goldFrom={goldFrom}
                  rtl={rtl}
                />
              </div>
            ) : null}

            <ShineSweep span={timing.shine} />
          </div>
        </GlowFrame>

        {/* …confetti flies over it. */}
        <Sequence durationInFrames={Math.ceil(sec(1.6))} layout="none">
          <Sparks
            timing={timing}
            colors={[accentFrom, accentTo, goldFrom, "#FFFFFF"]}
          />
        </Sequence>
      </div>

      {/* Two hits: air on arrival, a chime as the amount lands. */}
      {withSound ? (
        <>
          <Audio src={whoosh} volume={0.55} />
          <Sequence from={Math.round(timing.amount.start)}>
            <Audio src={ding} volume={0.8} />
          </Sequence>
        </>
      ) : null}
    </AbsoluteFill>
  );
};
