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
  track.appendChild(firstClone);

  let index = 0;
  let timerId = null;
  let isTransitioning = false;

  function setPosition(animate) {
    track.style.transition = animate ? 'transform 0.6s ease' : 'none';
    track.style.transform = `translateX(calc(-${index * 100}% - ${index * 24}px))`;
  }

  function swipeNext() {
    if (isTransitioning) return;
    isTransitioning = true;
    index += 1;
    setPosition(true);
  }

  function swipePrev() {
    if (isTransitioning) return;
    isTransitioning = true;
    if (index === 0) {
      index = cards.length;
      setPosition(false);
      track.offsetHeight; // force reflow before animating backward
    }
    index -= 1;
    setPosition(true);
  }

  track.addEventListener('transitionend', () => {
    isTransitioning = false;
    if (index >= cards.length) {
      index = 0;
      setPosition(false);
    }
  });

  function start() {
    stop();
    timerId = setInterval(swipeNext, 6000);
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
  start();
})();
