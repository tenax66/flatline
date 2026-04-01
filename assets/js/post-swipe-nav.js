(() => {
  "use strict";

  const root = document.getElementById("postSwipeRoot");
  if (!root) return;

  const hasTouch =
    "ontouchstart" in window ||
    (navigator.maxTouchPoints != null && navigator.maxTouchPoints > 0);
  if (!hasTouch) return;

  const nextUrl = root.dataset.swipeNextUrl || "";
  const prevUrl = root.dataset.swipePrevUrl || "";
  if (!nextUrl && !prevUrl) return;

  const EDGE_GUARD_PX = 24; // 画面端スワイプ（戻る/進む）と干渉しやすいので無視
  const TRIGGER_DX_PX = 60; // 遷移確定に必要な横移動量
  const LOCK_DX_PX = 10; // 横スワイプ開始判定（小さすぎると誤爆するので控えめに）
  const INTENT_RATIO = 1.5; // |dx| が |dy| のこの倍以上なら横スワイプ意図とみなす
  const LOCK_RATIO = 1.2; // ロック判定は少し緩め
  const HINT_KEY = "flatline_swipe_hint_v1";
  const HINT_DELAY_MS = 650;
  const HINT_DURATION_MS = 900;
  const HINT_PEAK_DX_PX = 42;

  let startX = 0;
  let startY = 0;
  let tracking = false;
  let lockedAxis = null; // null | "x"
  let lastDx = 0;
  let shadeEl = null;
  let hintTimer = null;
  let hintRaf = 0;
  let hintCanceled = false;

  const isInteractiveTarget = (el) => {
    if (!el || !(el instanceof Element)) return false;
    return !!el.closest(
      'a, button, input, textarea, select, summary, [role="button"], [data-no-swipe]'
    );
  };

  const ensureShade = () => {
    if (shadeEl) return shadeEl;
    const el = document.createElement("div");
    el.setAttribute("data-swipe-shade", "1");
    Object.assign(el.style, {
      position: "fixed",
      inset: "0",
      pointerEvents: "none",
      zIndex: "9999",
      background: "transparent",
      transition: "background 0ms",
    });
    document.body.appendChild(el);
    shadeEl = el;
    return el;
  };

  const cleanupShade = () => {
    if (!shadeEl) return;
    shadeEl.remove();
    shadeEl = null;
  };

  const setSwipeVisual = (dx) => {
    lastDx = dx;
    const w = Math.max(1, window.innerWidth || 1);
    const progress = Math.min(1, Math.abs(dx) / w);

    // ページめくり風: 少しのrotateY＋translateX＋弱い影
    const angle = Math.max(-12, Math.min(12, (dx / w) * 18));
    root.style.willChange = "transform";
    root.style.transition = "transform 0ms";
    root.style.transformOrigin = dx < 0 ? "right center" : "left center";
    root.style.transform =
      `perspective(900px) translate3d(${dx}px, 0, 0) rotateY(${angle}deg)`;

    const shade = ensureShade();
    const alpha = 0.22 * progress;
    shade.style.background =
      dx < 0
        ? `linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,${alpha}) 70%, rgba(0,0,0,${alpha * 1.1}) 100%)`
        : `linear-gradient(270deg, rgba(0,0,0,0) 0%, rgba(0,0,0,${alpha}) 70%, rgba(0,0,0,${alpha * 1.1}) 100%)`;
  };

  const resetSwipeVisual = () => {
    root.style.transition = "transform 180ms ease";
    root.style.transform = "perspective(900px) translate3d(0, 0, 0) rotateY(0deg)";
    const onEnd = () => {
      root.removeEventListener("transitionend", onEnd);
      root.style.transition = "";
      root.style.transform = "";
      root.style.transformOrigin = "";
      root.style.willChange = "";
      cleanupShade();
    };
    root.addEventListener("transitionend", onEnd);
  };

  const isLikelyPhone = () => {
    const coarse = window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
    const small = Math.min(window.innerWidth || 0, window.innerHeight || 0) <= 820;
    return coarse && small;
  };

  const prefersReducedMotion = () => {
    return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  };

  const cancelHint = () => {
    hintCanceled = true;
    if (hintTimer != null) {
      window.clearTimeout(hintTimer);
      hintTimer = null;
    }
    if (hintRaf) {
      window.cancelAnimationFrame(hintRaf);
      hintRaf = 0;
    }
  };

  const runSwipeHintOnce = () => {
    if (!isLikelyPhone()) return;
    if (prefersReducedMotion()) return;
    try {
      if (window.localStorage && localStorage.getItem(HINT_KEY) === "1") return;
    } catch (_) {
      // localStorage が使えない環境でも動作自体は継続
    }

    // ユーザー操作の邪魔をしないよう、少し待ってから一瞬だけ「スワイプっぽい動き→戻る」
    hintTimer = window.setTimeout(() => {
      if (hintCanceled) return;

      const dir = prevUrl ? -1 : 1; // ある方向だけでも「横に動く」を見せれば十分
      const peak = dir * HINT_PEAK_DX_PX;
      const start = performance.now();

      const tick = (now) => {
        if (hintCanceled) return;
        const t = Math.min(1, (now - start) / HINT_DURATION_MS);
        // easeInOutSine: 0→1→0 の往復
        const s = Math.sin(Math.PI * t);
        setSwipeVisual(peak * s);
        if (t < 1) {
          hintRaf = window.requestAnimationFrame(tick);
        } else {
          hintRaf = 0;
          resetSwipeVisual();
          try {
            if (window.localStorage) localStorage.setItem(HINT_KEY, "1");
          } catch (_) {
            // ignore
          }
        }
      };

      hintRaf = window.requestAnimationFrame(tick);
    }, HINT_DELAY_MS);
  };

  const finishSwipeAndNavigate = (url, dx) => {
    const dir = dx < 0 ? -1 : 1;
    const w = Math.max(1, window.innerWidth || 1);
    const endX = dir * w * 1.05;
    const endAngle = dir * 10;

    root.style.willChange = "transform";
    root.style.transition = "transform 220ms ease";
    root.style.transformOrigin = dir < 0 ? "right center" : "left center";
    root.style.transform =
      `perspective(900px) translate3d(${endX}px, 0, 0) rotateY(${endAngle}deg)`;

    window.setTimeout(() => window.location.assign(url), 160);
  };

  root.addEventListener(
    "touchstart",
    (e) => {
      cancelHint();
      if (!e.touches || e.touches.length !== 1) return;
      if (isInteractiveTarget(e.target)) return;

      const t = e.touches[0];
      startX = t.clientX;
      startY = t.clientY;

      const startedAtEdge =
        startX <= EDGE_GUARD_PX || startX >= window.innerWidth - EDGE_GUARD_PX;
      tracking = !startedAtEdge;
      lockedAxis = null;
      lastDx = 0;
    },
    { passive: true }
  );

  // 「初回だけスワイプできる」ヒント（ユーザーが触ったら即中止）
  runSwipeHintOnce();

  root.addEventListener(
    "touchmove",
    (e) => {
      if (!tracking) return;
      if (!e.touches || e.touches.length !== 1) return;

      const t = e.touches[0];
      const dx = t.clientX - startX;
      const dy = t.clientY - startY;

      if (lockedAxis == null) {
        if (Math.abs(dx) >= LOCK_DX_PX && Math.abs(dx) >= Math.abs(dy) * LOCK_RATIO) {
          lockedAxis = "x";
        } else {
          return; // 縦スクロール優先
        }
      }

      if (lockedAxis === "x") {
        // 横スワイプ開始後は縦スクロールを止める
        e.preventDefault();
        setSwipeVisual(dx);
      }
    },
    { passive: false }
  );

  root.addEventListener(
    "touchend",
    (e) => {
      if (!tracking) return;
      tracking = false;

      const t = (e.changedTouches && e.changedTouches[0]) || null;
      if (!t) return;

      const dx = t.clientX - startX;
      const dy = t.clientY - startY;

      const canTrigger =
        Math.abs(dx) >= TRIGGER_DX_PX && Math.abs(dx) >= Math.abs(dy) * INTENT_RATIO;

      if (!canTrigger) {
        if (lockedAxis === "x") resetSwipeVisual();
        lockedAxis = null;
        return;
      }

      // 左スワイプ（dx<0）で「前（新しい記事）」、右スワイプ（dx>0）で「次（古い記事）」
      if (dx < 0 && prevUrl) {
        finishSwipeAndNavigate(prevUrl, dx);
      } else if (dx > 0 && nextUrl) {
        finishSwipeAndNavigate(nextUrl, dx);
      } else if (lockedAxis === "x") {
        resetSwipeVisual();
      }
      lockedAxis = null;
    },
    { passive: true }
  );

  root.addEventListener(
    "touchcancel",
    () => {
      if (!tracking) return;
      tracking = false;
      if (lockedAxis === "x") resetSwipeVisual();
      lockedAxis = null;
    },
    { passive: true }
  );
})();

