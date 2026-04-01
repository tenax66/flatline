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
  const INTENT_RATIO = 1.5; // |dx| が |dy| のこの倍以上なら横スワイプ意図とみなす

  let startX = 0;
  let startY = 0;
  let tracking = false;

  const isInteractiveTarget = (el) => {
    if (!el || !(el instanceof Element)) return false;
    return !!el.closest(
      'a, button, input, textarea, select, summary, [role="button"], [data-no-swipe]'
    );
  };

  root.addEventListener(
    "touchstart",
    (e) => {
      if (!e.touches || e.touches.length !== 1) return;
      if (isInteractiveTarget(e.target)) return;

      const t = e.touches[0];
      startX = t.clientX;
      startY = t.clientY;

      const startedAtEdge =
        startX <= EDGE_GUARD_PX || startX >= window.innerWidth - EDGE_GUARD_PX;
      tracking = !startedAtEdge;
    },
    { passive: true }
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

      if (Math.abs(dx) < TRIGGER_DX_PX) return;
      if (Math.abs(dx) < Math.abs(dy) * INTENT_RATIO) return;

      // 左スワイプ（dx<0）で「次（古い記事）」、右スワイプ（dx>0）で「前（新しい記事）」
      if (dx < 0 && nextUrl) {
        window.location.assign(nextUrl);
        return;
      }
      if (dx > 0 && prevUrl) {
        window.location.assign(prevUrl);
      }
    },
    { passive: true }
  );
})();

