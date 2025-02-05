export const smoothScrollToWithLinearEasing = (
  target: HTMLElement,
  leftPosition: number,
  duration: number
) => {
  const start = target.scrollLeft;
  const distance = leftPosition - start;
  const startTime = performance.now();

  function animate(time: number): void {
    const elapsed = time - startTime;
    const progress = elapsed / duration;
    const easedProgress = Math.min(1, progress);

    target.scrollLeft = Math.round(start + distance * easedProgress);

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  }

  requestAnimationFrame(animate);
};
