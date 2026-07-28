import { z } from "zod";
import { zColor } from "@remotion/zod-types";

export const donationAlertSchema = z.object({
  /** Small kicker above the donor name. */
  label: z.string(),
  donorName: z.string(),
  amount: z.number().min(0),
  currency: z.string(),
  /** Optional note from the donor. Empty string hides the row. */
  message: z.string(),
  /** Optional gift artwork URL. Falls back to a built-in SVG gift mark. */
  giftImage: z.string(),

  accentFrom: zColor(),
  accentTo: zColor(),
  goldFrom: zColor(),
  goldTo: zColor(),

  showGoal: z.boolean(),
  goalLabel: z.string(),
  goalRaised: z.number().min(0),
  goalTarget: z.number().min(1),

  /** Plays a chime on entry. Survives into ProRes / WebM renders. */
  withSound: z.boolean(),
  /**
   * Distance from the top of the canvas to the card. Use it to dodge the
   * TikTok Live chrome. 0 centres the card vertically.
   */
  offsetTop: z.number(),
  /** Right-to-left for Arabic, left-to-right for Latin copy. */
  rtl: z.boolean(),
});

export type DonationAlertProps = z.infer<typeof donationAlertSchema>;
