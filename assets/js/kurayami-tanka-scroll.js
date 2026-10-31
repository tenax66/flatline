(() => {
  "use strict";

  const frame = document.querySelector("[data-kurayami-scroll]");
  if (!frame) return;
  const area = frame.querySelector(".tanka-area");
  const tanka = area.querySelector(".tanka");
  let previousMax = 0;

  const updateEdges = () => {
    const max = Math.max(0, area.scrollWidth - area.clientWidth);
    frame.classList.toggle("has-more-left", area.scrollLeft > 1);
    frame.classList.toggle("has-more-right", area.scrollLeft < max - 1);
  };

  // 縦書きの読み始めは右端。フォントや画面幅の変化時も、
  // 右端を読んでいる場合だけ追従し、途中の読書位置は動かさない。
  const updateLayout = () => {
    const wasAtRight = area.scrollLeft >= previousMax - 1;
    previousMax = Math.max(0, area.scrollWidth - area.clientWidth);
    if (wasAtRight) area.scrollLeft = previousMax;
    updateEdges();
  };

  area.addEventListener("scroll", updateEdges, { passive: true });
  updateLayout();
  document.fonts.ready.then(updateLayout);
  if ("ResizeObserver" in window) {
    const observer = new ResizeObserver(updateLayout);
    observer.observe(area);
    observer.observe(tanka);
  } else {
    window.addEventListener("resize", updateLayout);
  }
})();
