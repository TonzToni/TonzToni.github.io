hljs.highlightAll();

(function () {
  const showcase = document.querySelector('.code-showcase');
  const track = document.querySelector('.code-showcase-grid');
  const prevBtn = document.getElementById('code-prev');
  const nextBtn = document.getElementById('code-next');
  if (!showcase || !track) return;

  const cards = Array.from(track.children);
  if (cards.length < 2) return;

  const firstClone = cards[0].cloneNode(true);
  const lastClone = cards[cards.length - 1].cloneNode(true);
  track.insertBefore(lastClone, cards[0]);
  track.appendChild(firstClone);

  let index = 1;
  let timerId = null;
  let isTransitioning = false;

  function syncCloneScroll(realCard, cloneCard) {
    const realPre = realCard.querySelector('pre');
    const clonePre = cloneCard.querySelector('pre');
    if (realPre && clonePre) {
      clonePre.scrollTop = realPre.scrollTop;
      clonePre.scrollLeft = realPre.scrollLeft;
    }
  }

  function setPosition(animate) {
    track.style.transition = animate ? 'transform 0.6s ease' : 'none';
    track.style.transform = `translateX(calc(-${index * 100}% - ${index * 24}px))`;
  }

  function swipeNext() {
    if (isTransitioning) return;
    syncCloneScroll(cards[0], firstClone);
    isTransitioning = true;
    index += 1;
    setPosition(true);
  }

  function swipePrev() {
    if (isTransitioning) return;
    syncCloneScroll(cards[cards.length - 1], lastClone);
    isTransitioning = true;
    index -= 1;
    setPosition(true);
  }

  track.addEventListener('transitionend', (e) => {
    if (e.target !== track) return;
    isTransitioning = false;
    if (index >= cards.length + 1) {
      index = 1;
      setPosition(false);
    } else if (index <= 0) {
      index = cards.length;
      setPosition(false);
    }
  });

  function start() {
    stop();
    timerId = setInterval(swipeNext, 3000);
  }

  function stop() {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      swipeNext();
      start();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      swipePrev();
      start();
    });
  }

  showcase.addEventListener('mouseenter', stop);
  showcase.addEventListener('mouseleave', start);

  setPosition(false);
  start();
})();
