# Donation Alert — TikTok Live overlay

A parameterised donation alert built with [Remotion](https://remotion.dev),
rendered as a **transparent** video so it can be dropped onto a TikTok Live
scene in OBS (or any streaming software) as a media source.

Arabic (RTL) and English (LTR) are both first-class.

## Compositions

| ID | Size | Purpose |
|----|------|---------|
| `DonationAlert-Vertical` | 1080×1920 | Full TikTok canvas. Align to the scene edges and the card lands in the safe zone automatically. |
| `DonationAlert-Compact`  | 1080×920  | Cropped to the card. Smaller file — position it yourself in OBS. |
| `DonationAlert-EN`       | 1080×920  | Same, with LTR defaults. |
| `Demo-OverStream`        | 1080×1920 | **Opaque preview** over a stand-in camera feed, for reviewing the design. Not for OBS. |
| `DonationAlert-Poster`   | 1080×920  | Still, for thumbnails. |

```bash
npm i
npm run dev      # Remotion Studio — edit every prop live in the sidebar
```

## Rendering

Transparency needs three things agreeing: PNG frames, an alpha pixel format,
and a codec that carries alpha. All three are already set as composition
defaults, so a bare render comes out transparent:

```bash
npx remotion render DonationAlert-Compact out/alert.webm
```

For a video editor (Premiere / Final Cut / Resolve), ProRes 4444 is the better
container:

```bash
npx remotion render DonationAlert-Compact \
  --codec=prores --prores-profile=4444 \
  --pixel-format=yuva444p10le --image-format=png \
  out/alert.mov
```

Both carry the alert's audio — a whoosh on entry, a chime as the amount lands.

### Using it in OBS

Add a **Media Source** pointing at the `.webm`, uncheck *Loop*, and check
*Restart playback when source becomes active*. Activating the source then plays
the alert once. OBS respects WebM/VP9 alpha, so the card composites over your
camera with no black box.

## Parameters

Every field is exposed through a Zod schema, so it is editable in the Studio
sidebar and overridable per render:

```bash
npx remotion render DonationAlert-Compact out/alert.webm \
  --props='{"donorName":"سارة العتيبي","amount":250,"message":"بالتوفيق"}'
```

| Prop | Notes |
|------|-------|
| `label` | Kicker above the name (`تبرّع جديد`). |
| `donorName` | Auto-shrinks to fit; see below. |
| `amount`, `currency` | The amount counts up from zero. |
| `message` | Donor note. Empty string hides the row. Clamped to 3 lines. |
| `giftImage` | URL of gift artwork. Empty string uses the built-in gift mark. |
| `accentFrom`, `accentTo` | Ring, rim and glow colours. |
| `goldFrom`, `goldTo` | Amount chip colours. |
| `showGoal`, `goalLabel`, `goalRaised`, `goalTarget` | Campaign progress bar. |
| `withSound` | Set `false` for a silent overlay. |
| `offsetTop` | Distance from the top of the canvas to the card. `0` centres it. |
| `rtl` | Reading direction. Drives text alignment, the reveal wipe and the goal bar fill. |

Duration, fps and dimensions live in `src/Root.tsx`. The whole choreography is
derived from `fps` in `src/donation-alert/timing.ts`, so changing either
rescales the animation rather than breaking it.

## Notes on the implementation

A few decisions that aren't obvious from the code:

- **Donor names auto-fit.** Names are user data — they range from three letters
  to a full four-part Arabic name, and Latin runs wider than Arabic at the same
  size. `useFittedFontSize` measures the string and shrinks it to fit its
  column, with a 40px floor past which it ellipsizes instead. Measurement waits
  on the real font; measuring against a fallback face sizes for the wrong
  glyphs.
- **The glow is a single hue, kept tight.** Layering different accent colours at
  different blur radii stacks into concentric coloured rings, and a wide
  low-alpha falloff quantises into visible steps against a transparent canvas.
- **The entry hit is a rim flash, not an expanding ring.** The card is 880px of
  a 1080px canvas, so an expanding outline of its silhouette pushes its left and
  right edges off-frame past ~1.2×, leaving the top and bottom edges reading as
  full-width horizontal lines. A radial flash was rejected too — over live video
  it strobes the whole stream.
- **Confetti renders in front of the card, the rim flash behind it**, and the
  throw distance is bounded so nothing clips at the canvas edge.
- **No CSS transitions or animations anywhere** — they don't render. Everything
  is driven by `useCurrentFrame()`.

## Fonts and sound are fetched at render time

The font comes from `@remotion/google-fonts` and the two sound effects from
`@remotion/sfx`, so rendering needs network access. Behind a TLS-intercepting
proxy, Chromium may reject the certificate; add `--ignore-certificate-errors`
to the render command, or vendor the assets into `public/` and reference them
with `staticFile()`.
