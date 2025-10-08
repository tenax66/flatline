(() => {
  "use strict";

  const ascii = "@#%&$ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789*+-=/\\|<>[]{}()?!:;";
  const targets = [
    { id: "brandTitleMobile", original: null },
    { id: "brandTitleDesktop", original: null },
  ];

  function scramble(text, intensity) {
    const chars = text.split("");
    const len = Math.ceil(chars.length * intensity);
    for (let i = 0; i < len; i += 1) {
      const idx = Math.floor(Math.random() * chars.length);
      chars[idx] = ascii[Math.floor(Math.random() * ascii.length)];
    }
    return chars.join("");
  }

  function animateOnce(element, originalText, intensity = 0.8, durationMs = 450) {
    const startedAt = performance.now();
    let rafId = 0;
    const tick = (now) => {
      const t = Math.min(1, (now - startedAt) / durationMs);
      const currentIntensity = (1 - t) * intensity;
      element.textContent = scramble(originalText, currentIntensity);
      if (t < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        element.textContent = originalText;
      }
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }

  function setup() {
    const elements = targets
      .map((t) => {
        const el = document.getElementById(t.id);
        if (!el) return null;
        t.original = el.textContent || "";
        return { el, original: t.original };
      })
      .filter(Boolean);

    if (elements.length === 0) return;

    // State machine: "top" -> normal brand, "min" -> "F" after glitch
    let state = window.scrollY === 0 ? "top" : "min";
    const MIN_SYMBOL = "F"
    let glitchCooldownUntil = 0;
    let cancelLast = null;

    // Initialize according to initial position (no effect when at top)
    if (state === "min") {
      elements.forEach(({ el }) => (el.textContent = MIN_SYMBOL));
    }

    function transitionToMin(deltaHint = 200) {
      // Avoid spamming glitch animations
      const now = performance.now();
      if (now < glitchCooldownUntil) return;
      glitchCooldownUntil = now + 400;

      const intensity = Math.max(0.4, Math.min(1, deltaHint / 400));
      const duration = 220 + Math.min(500, deltaHint);

      if (cancelLast) cancelLast();
      // Run glitch once, then shrink text one-by-one to MIN_SYMBOL
      const startShrink = (el, originalText) => {
        const shrinkDuration = 420; // ms
        const startedAt = performance.now();
        let rafId = 0;
        const tick = (now2) => {
          const t = Math.min(1, (now2 - startedAt) / shrinkDuration);
          const remaining = Math.max(1, Math.ceil((1 - t) * originalText.length));
          if (remaining > 1) {
            const base = originalText.slice(0, remaining);
            // add a subtle glitch while shrinking; intensity fades out with t
            const glitchIntensity = 0.12 * (1 - t);
            const withGlitch = glitchIntensity > 0.02 ? scramble(base, glitchIntensity) : base;
            el.textContent = withGlitch;
          } else {
            el.textContent = MIN_SYMBOL;
          }
          if (t < 1) {
            rafId = requestAnimationFrame(tick);
          }
        };
        rafId = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(rafId);
      };

      elements.forEach(({ el, original }) => {
        const cancel = animateOnce(el, original, intensity, duration);
        // After glitch completes, start shrinking
        window.setTimeout(() => {
          cancel();
          cancelLast = startShrink(el, original);
        }, duration + 16);
      });
    }

    function transitionToTop(deltaHint = 200) {
      // Grow from MIN_SYMBOL to full brand text with a subtle glitch
      const now = performance.now();
      if (now < glitchCooldownUntil) return;
      glitchCooldownUntil = now + 400;

      const growDuration = 480; // ms

      if (cancelLast) cancelLast();

      const startGrow = (el, originalText) => {
        const startedAt = performance.now();
        let rafId = 0;
        const tick = (now2) => {
          const t = Math.min(1, (now2 - startedAt) / growDuration);
          const count = Math.max(1, Math.ceil(t * originalText.length));
          const base = originalText.slice(0, count);
          // subtle glitch that fades as we approach full length
          const glitchIntensity = 0.10 * (1 - t);
          const withGlitch = glitchIntensity > 0.02 ? scramble(base, glitchIntensity) : base;
          el.textContent = withGlitch;
          if (t < 1) {
            rafId = requestAnimationFrame(tick);
          } else {
            el.textContent = originalText;
          }
        };
        rafId = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(rafId);
      };

      elements.forEach(({ el, original }) => {
        // Ensure we visually start from the minimal symbol
        el.textContent = MIN_SYMBOL;
        cancelLast = startGrow(el, original);
      });
    }

    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const delta = Math.abs(y - lastY);
      lastY = y;

      if (y === 0) {
        if (state !== "top") {
          transitionToTop(delta || 200);
          state = "top";
        }
        return;
      }

      // y > 0
      if (state !== "min") {
        state = "min";
        transitionToMin(delta || 200);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setup);
  } else {
    setup();
  }
})();

