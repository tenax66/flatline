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

    // State machine: "top" -> normal brand, "min" -> "-" after glitch
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
      // Run glitch once, then set to "-"
      elements.forEach(({ el, original }) => {
        cancelLast = animateOnce(el, original, intensity, duration);
        // After finishing, force to "-"; use a timer slightly longer than duration
        window.setTimeout(() => {
          el.textContent = MIN_SYMBOL;
        }, duration + 16);
      });
    }

    function transitionToTop() {
      // Immediately restore original; no glitch at top per spec
      elements.forEach(({ el, original }) => {
        el.textContent = original;
      });
    }

    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const delta = Math.abs(y - lastY);
      lastY = y;

      if (y === 0) {
        if (state !== "top") {
          state = "top";
          transitionToTop();
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

