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

  // File d'attente infinie : toutes les photos en ordre aléatoire, qui reboucle
  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  let queue = shuffle(ALL_PHOTOS);
  let queueIdx = 0;
  function nextPhoto() {
    const src = queue[queueIdx];
    queueIdx++;
    if (queueIdx >= queue.length) { queue = shuffle(ALL_PHOTOS); queueIdx = 0; }
    return src;
  }

  const floaters = [];
  let started = false;

  function rnd(min, max) { return min + Math.random() * (max - min); }

  function createFloater(initialOnScreen) {
    const el = document.createElement('div');
    el.className = 'photo-floater';
    const img = document.createElement('img');
    img.src = nextPhoto();
    img.draggable = false;
    el.appendChild(img);
    document.body.appendChild(el);

    const size  = rnd(110, 170);
    const ratio = rnd(0.75, 1.4);
    const obj   = {
      el, img,
      w: size, h: size * ratio,
      x: 0, y: 0, vx: 0, vy: 0,
      rot: rnd(-25, 25),
      rs:  rnd(-0.035, 0.035),
      opacity: rnd(0.38, 0.58),
    };

    el.style.width   = obj.w + 'px';
    el.style.height  = obj.h + 'px';
    el.style.opacity = obj.opacity;

    if (initialOnScreen) {
      obj.x = rnd(0, window.innerWidth  - obj.w);
      obj.y = rnd(0, window.innerHeight - obj.h);
      const speed = rnd(0.25, 0.55);
      const angle = Math.random() * Math.PI * 2;
      obj.vx = Math.cos(angle) * speed;
      obj.vy = Math.sin(angle) * speed;
    } else {
      spawnFromEdge(obj);
    }
    floaters.push(obj);
  }

  function spawnFromEdge(obj) {
    const w = window.innerWidth, h = window.innerHeight;
    const edge  = Math.floor(Math.random() * 4);
    const speed = rnd(0.25, 0.55);
    let angle;
    if (edge === 0) { obj.x = -obj.w - 5; obj.y = rnd(0, h); angle = rnd(-Math.PI/4, Math.PI/4); }
    else if (edge === 1) { obj.x = w + 5;  obj.y = rnd(0, h); angle = Math.PI + rnd(-Math.PI/4, Math.PI/4); }
    else if (edge === 2) { obj.x = rnd(0, w); obj.y = -obj.h - 5; angle = Math.PI/2 + rnd(-Math.PI/4, Math.PI/4); }
    else                 { obj.x = rnd(0, w); obj.y = h + 5;      angle = -Math.PI/2 + rnd(-Math.PI/4, Math.PI/4); }
    obj.vx = Math.cos(angle) * speed;
    obj.vy = Math.sin(angle) * speed;
    // Charge la photo suivante dans la file
    obj.img.src = nextPhoto();
  }

  function isOffScreen(obj) {
    const m = 220;
    return obj.x < -m - obj.w || obj.x > window.innerWidth  + m
        || obj.y < -m - obj.h || obj.y > window.innerHeight + m;
  }

  function animate() {
    floaters.forEach(obj => {
      obj.x += obj.vx; obj.y += obj.vy; obj.rot += obj.rs;
      obj.el.style.transform = `translate(${obj.x}px,${obj.y}px) rotate(${obj.rot}deg)`;
      if (isOffScreen(obj)) spawnFromEdge(obj);
    });
    requestAnimationFrame(animate);
  }

  // Appelé manuellement (depuis clickOui sur index.html, ou au chargement sur les autres pages)
  window.startPhotosBg = function () {
    if (started) return;
    started = true;
    const NB = 10; // floaters simultanés
    for (let i = 0; i < NB; i++) createFloater(true);
    animate();
  };
})();
