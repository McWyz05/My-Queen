// ── Arrière-plan photos flottantes ──────────────────────────────
(function () {
  const ALL_PHOTOS = [
    'Photos/IMG-20231016-WA0001.jpg',
    'Photos/IMG-20231016-WA0003.jpg',
    'Photos/IMG-20231016-WA0005.jpg',
    'Photos/IMG-20231018-WA0011.jpg',
    'Photos/IMG-20231018-WA0012.jpg',
    'Photos/IMG-20231205-WA0016.jpg',
    'Photos/IMG-20231206-WA0017.jpg',
    'Photos/IMG-20231206-WA0018.jpg',
    'Photos/IMG-20240222-WA0031.jpg',
    'Photos/IMG-20240302-WA0010.jpg',
    'Photos/IMG-20240302-WA0011.jpg',
    'Photos/IMG-20240302-WA0012.jpg',
    'Photos/IMG-20240302-WA0013.jpg',
    'Photos/IMG-20240305-WA0017.jpg',
    'Photos/IMG-20240305-WA0018.jpg',
    'Photos/IMG-20240305-WA0019.jpg',
    'Photos/IMG-20240305-WA0020.jpg',
    'Photos/IMG-20240305-WA0021.jpg',
    'Photos/IMG-20250204-WA0003.jpg',
    'Photos/IMG-20250204-WA0006.jpg',
    'Photos/IMG-20250204-WA0009.jpg',
    'Photos/IMG-20250204-WA0010.jpg',
    'Photos/IMG-20250204-WA0011.jpg',
    'Photos/IMG-20250204-WA0012.jpg',
    'Photos/IMG-20250204-WA0013.jpg',
    'Photos/IMG-20250510-WA0018.jpg',
    'Photos/IMG-20250512-WA0018.jpg',
    'Photos/IMG-20250517-WA0016.jpg',
    'Photos/IMG-20250613-WA0044.jpg',
    'Photos/IMG-20250613-WA0045.jpg',
    'Photos/IMG-20250613-WA0046.jpg',
    'Photos/IMG-20250719-WA0058.jpg',
    'Photos/IMG-20260113-WA0064.jpg',
    'Photos/IMG-20260129-WA0027.jpg',
    'Photos/IMG-20260129-WA0031.jpg',
    'Photos/IMG-20260129-WA0033.jpg',
  ];

  // Mélange et prend 12 photos au hasard
  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  const SELECTED = shuffle(ALL_PHOTOS).slice(0, 12);

  const floaters = [];

  function rnd(min, max) { return min + Math.random() * (max - min); }

  function createFloater(src, initialOnScreen) {
    const el = document.createElement('div');
    el.className = 'photo-floater';

    const img = document.createElement('img');
    img.src = src;
    img.draggable = false;
    el.appendChild(img);
    document.body.appendChild(el);

    const w = window.innerWidth;
    const h = window.innerHeight;
    const size = rnd(90, 155);
    const ratio = rnd(0.75, 1.35);

    const obj = {
      el,
      w: size,
      h: size * ratio,
      x: 0, y: 0,
      vx: 0, vy: 0,
      rot: rnd(-28, 28),
      rs: rnd(-0.04, 0.04),
      opacity: rnd(0.18, 0.32),
    };

    el.style.width  = obj.w + 'px';
    el.style.height = obj.h + 'px';
    el.style.opacity = obj.opacity;

    if (initialOnScreen) {
      obj.x = rnd(-obj.w, w);
      obj.y = rnd(-obj.h, h);
    } else {
      spawnFromEdge(obj);
    }

    const speed = rnd(0.18, 0.42);
    const angle = Math.random() * Math.PI * 2;
    obj.vx = Math.cos(angle) * speed;
    obj.vy = Math.sin(angle) * speed;

    floaters.push(obj);
  }

  function spawnFromEdge(obj) {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const edge = Math.floor(Math.random() * 4);
    const speed = rnd(0.18, 0.42);
    let angle;
    if (edge === 0) { // left
      obj.x = -obj.w - 10; obj.y = rnd(0, h);
      angle = rnd(-Math.PI / 4, Math.PI / 4);
    } else if (edge === 1) { // right
      obj.x = w + 10; obj.y = rnd(0, h);
      angle = Math.PI + rnd(-Math.PI / 4, Math.PI / 4);
    } else if (edge === 2) { // top
      obj.x = rnd(0, w); obj.y = -obj.h - 10;
      angle = Math.PI / 2 + rnd(-Math.PI / 4, Math.PI / 4);
    } else { // bottom
      obj.x = rnd(0, w); obj.y = h + 10;
      angle = -Math.PI / 2 + rnd(-Math.PI / 4, Math.PI / 4);
    }
    obj.vx = Math.cos(angle) * speed;
    obj.vy = Math.sin(angle) * speed;
  }

  function isOffScreen(obj) {
    const margin = 200;
    return (
      obj.x < -margin - obj.w ||
      obj.x > window.innerWidth  + margin ||
      obj.y < -margin - obj.h ||
      obj.y > window.innerHeight + margin
    );
  }

  function animate() {
    floaters.forEach(obj => {
      obj.x   += obj.vx;
      obj.y   += obj.vy;
      obj.rot += obj.rs;
      obj.el.style.transform = `translate(${obj.x}px, ${obj.y}px) rotate(${obj.rot}deg)`;
      if (isOffScreen(obj)) spawnFromEdge(obj);
    });
    requestAnimationFrame(animate);
  }

  // Crée les floaters une fois le DOM prêt
  function init() {
    SELECTED.forEach((src, i) => createFloater(src, true));
    animate();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
