export type Span = { start: number; end: number };

/**
 * The whole choreography in one place, expressed in seconds and converted to
 * frames, so changing `fps` or `durationInFrames` rescales the alert instead
 * of breaking it.
 */
export const getTiming = (fps: number, durationInFrames: number) => {
  const sec = (seconds: number) => seconds * fps;

  const outDuration = sec(0.85);
  const outStart = Math.max(sec(1.6), durationInFrames - outDuration);

  return {
    sec,
    // Everything lands by ~2.2s so a 5s alert still gets a real hold before
    // it leaves. Alerts that read slowly get talked over.
    burst: { start: 0, end: sec(0.55) } satisfies Span,
    card: { start: 0, end: sec(0.58) } satisfies Span,
    badge: { start: sec(0.2), end: sec(0.78) } satisfies Span,
    label: { start: sec(0.3), end: sec(0.7) } satisfies Span,
    name: { start: sec(0.4), end: sec(0.92) } satisfies Span,
    divider: { start: sec(0.58), end: sec(1.0) } satisfies Span,
    amount: { start: sec(0.62), end: sec(1.75) } satisfies Span,
    message: { start: sec(0.9), end: sec(1.38) } satisfies Span,
    goal: { start: sec(1.1), end: sec(2.2) } satisfies Span,
    shine: { start: sec(0.85), end: sec(1.75) } satisfies Span,
    out: { start: outStart, end: outStart + outDuration } satisfies Span,
  };
};

export type Timing = ReturnType<typeof getTiming>;
