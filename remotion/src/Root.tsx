import "./index.css";
import { CalculateMetadataFunction, Composition, Still } from "remotion";
import { DemoStage } from "./DemoStage";
import { DonationAlert } from "./donation-alert/DonationAlert";
import {
  donationAlertSchema,
  type DonationAlertProps,
} from "./donation-alert/schema";
import { PALETTE } from "./theme";

const FPS = 30;
const DURATION = 5 * FPS;

const defaultProps: DonationAlertProps = {
  label: "تبرّع جديد",
  donorName: "عبدالله الحربي",
  amount: 1500,
  currency: "ر.س",
  message: "جعلها الله في ميزان حسناتكم",
  giftImage: "",
  accentFrom: PALETTE.cyan,
  accentTo: PALETTE.pink,
  goldFrom: PALETTE.gold,
  goldTo: PALETTE.goldDeep,
  showGoal: true,
  goalLabel: "إجمالي الحملة",
  goalRaised: 68400,
  goalTarget: 100000,
  withSound: true,
  offsetTop: 470,
  rtl: true,
};

/**
 * Transparency has to be requested at three levels — PNG frames, an alpha
 * pixel format, and a codec that carries it. Setting them as composition
 * defaults means "Render" in Studio and a bare CLI call both come out with a
 * real alpha channel instead of a black box.
 */
const transparentDefaults: CalculateMetadataFunction<
  DonationAlertProps
> = () => {
  return {
    defaultCodec: "vp9",
    defaultVideoImageFormat: "png",
    defaultPixelFormat: "yuva420p",
  };
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Full TikTok Live canvas — drop straight onto a 1080×1920 scene. */}
      <Composition
        id="DonationAlert-Vertical"
        component={DonationAlert}
        schema={donationAlertSchema}
        defaultProps={defaultProps}
        calculateMetadata={transparentDefaults}
        durationInFrames={DURATION}
        fps={FPS}
        width={1080}
        height={1920}
      />

      {/* Cropped to the card, for positioning freely in OBS. */}
      <Composition
        id="DonationAlert-Compact"
        component={DonationAlert}
        schema={donationAlertSchema}
        defaultProps={{ ...defaultProps, offsetTop: 0 }}
        calculateMetadata={transparentDefaults}
        durationInFrames={DURATION}
        fps={FPS}
        width={1080}
        height={920}
      />

      {/* English / LTR variant. */}
      <Composition
        id="DonationAlert-EN"
        component={DonationAlert}
        schema={donationAlertSchema}
        defaultProps={{
          ...defaultProps,
          offsetTop: 0,
          rtl: false,
          label: "NEW DONATION",
          donorName: "Abdullah Al-Harbi",
          currency: "SAR",
          message: "Keep up the great work!",
          goalLabel: "Campaign total",
        }}
        calculateMetadata={transparentDefaults}
        durationInFrames={DURATION}
        fps={FPS}
        width={1080}
        height={920}
      />

      {/* Opaque preview — the alert over a stand-in camera feed. Not for OBS. */}
      <Composition
        id="Demo-OverStream"
        component={DemoStage}
        schema={donationAlertSchema}
        defaultProps={defaultProps}
        durationInFrames={DURATION}
        fps={FPS}
        width={1080}
        height={1920}
      />

      {/* Still for thumbnails and design review. */}
      <Still
        id="DonationAlert-Poster"
        component={DonationAlert}
        schema={donationAlertSchema}
        defaultProps={{ ...defaultProps, offsetTop: 0 }}
        width={1080}
        height={920}
      />
    </>
  );
};
