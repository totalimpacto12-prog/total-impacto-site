document.getElementById("ano").textContent = new Date().getFullYear();

const navToggle = document.getElementById("nav-toggle");
const navLinks = document.getElementById("nav-links");

navToggle.addEventListener("click", () => {
  navLinks.classList.toggle("is-open");
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => navLinks.classList.remove("is-open"));
});

document.querySelectorAll(".review-more").forEach((btn) => {
  btn.addEventListener("click", () => {
    btn.remove();
  });
});

// Carrossel de avaliações
(() => {
  const carousel = document.querySelector(".reviews-carousel");
  const viewport = document.querySelector(".reviews-viewport");
  const track = document.getElementById("reviews-track");
  const prevBtn = document.getElementById("reviews-prev");
  const nextBtn = document.getElementById("reviews-next");
  if (!carousel || !track) return;

  const cards = Array.from(track.children);
  const gap = 20;
  let index = 0;
  let timer = null;

  function step() {
    return cards[0].getBoundingClientRect().width + gap;
  }

  function maxIndex() {
    const visible = Math.max(1, Math.round(viewport.clientWidth / step()));
    return Math.max(0, cards.length - visible);
  }

  function render() {
    index = Math.min(index, maxIndex());
    track.style.transform = `translateX(-${index * step()}px)`;
  }

  function next() {
    index = index >= maxIndex() ? 0 : index + 1;
    render();
  }

  function prev() {
    index = index <= 0 ? maxIndex() : index - 1;
    render();
  }

  function play() {
    stop();
    timer = setInterval(next, 4500);
  }

  function stop() {
    if (timer) clearInterval(timer);
  }

  nextBtn.addEventListener("click", () => {
    next();
    play();
  });

  prevBtn.addEventListener("click", () => {
    prev();
    play();
  });

  carousel.addEventListener("mouseenter", stop);
  carousel.addEventListener("mouseleave", play);
  window.addEventListener("resize", render);

  render();
  play();
})();

// Revelação em cascata (efeito dominó) do portfólio
(() => {
  const grid = document.getElementById("portfolio-grid");
  if (!grid || !("IntersectionObserver" in window)) {
    if (grid) grid.classList.add("is-revealed");
    return;
  }

  const items = Array.from(grid.querySelectorAll(".portfolio-item"));
  items.forEach((item, i) => {
    item.style.transitionDelay = `${i * 70}ms`;
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        grid.classList.add("is-revealed");
        observer.unobserve(grid);

        setTimeout(() => {
          items.forEach((item) => {
            item.style.transitionDelay = "";
          });
        }, items.length * 70 + 600);
      });
    },
    { threshold: 0.15 }
  );

  observer.observe(grid);
})();

// Setas do infográfico Missão / Visão / Valores
(() => {
  const container = document.querySelector(".infographic");
  const svg = document.getElementById("info-arrows");
  const circle = document.querySelector(".info-circle");
  if (!container || !svg || !circle) return;

  const icons = Array.from(document.querySelectorAll(".info-icon"));
  const paths = Array.from(svg.querySelectorAll(".arrow-path"));

  function layout() {
    if (getComputedStyle(svg).display === "none") return;

    const cRect = container.getBoundingClientRect();
    svg.setAttribute("viewBox", `0 0 ${cRect.width} ${cRect.height}`);

    const circleRect = circle.getBoundingClientRect();
    const startX = circleRect.right - cRect.left;
    const startY = circleRect.top + circleRect.height / 2 - cRect.top;

    icons.forEach((icon, i) => {
      const path = paths[i];
      if (!path) return;
      const iRect = icon.getBoundingClientRect();
      const endX = iRect.left - cRect.left - 4;
      const endY = iRect.top + iRect.height / 2 - cRect.top;
      const midX = (startX + endX) / 2;
      path.setAttribute("d", `M${startX},${startY} C${midX},${startY} ${midX},${endY} ${endX},${endY}`);
    });
  }

  layout();
  window.addEventListener("load", layout);
  window.addEventListener("resize", layout);

  if ("ResizeObserver" in window) {
    new ResizeObserver(layout).observe(container);
  }
})();

// Filtro do portfólio
(() => {
  const grid = document.getElementById("portfolio-grid");
  const filters = document.getElementById("portfolio-filters");
  if (!grid || !filters) return;

  const items = Array.from(grid.querySelectorAll(".portfolio-item"));

  filters.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter-btn");
    if (!btn) return;

    filters.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("is-active"));
    btn.classList.add("is-active");

    const filter = btn.dataset.filter;
    grid.classList.add("is-filtering");

    setTimeout(() => {
      items.forEach((item) => {
        const categories = item.dataset.category.split(" ");
        const matches = filter === "all" || categories.includes(filter);
        item.classList.toggle("is-hidden", !matches);
      });
      grid.classList.remove("is-filtering");
    }, 250);
  });
})();

// Lightbox do portfólio
(() => {
  const grid = document.getElementById("portfolio-grid");
  const lightbox = document.getElementById("lightbox");
  if (!grid || !lightbox) return;

  const img = document.getElementById("lightbox-img");
  const caption = document.getElementById("lightbox-caption");
  const counter = document.getElementById("lightbox-counter");
  const closeBtn = document.getElementById("lightbox-close");
  const prevBtn = document.getElementById("lightbox-prev");
  const nextBtn = document.getElementById("lightbox-next");

  let visibleItems = [];
  let current = 0;

  function open(item) {
    visibleItems = Array.from(grid.querySelectorAll(".portfolio-item:not(.is-hidden)"));
    current = visibleItems.indexOf(item);
    render();
    lightbox.classList.add("is-open");
  }

  function render() {
    const item = visibleItems[current];
    const src = item.querySelector("img").src;
    img.src = src;
    img.alt = item.querySelector("img").alt;
    caption.textContent = item.dataset.caption || "";
    counter.textContent = `${current + 1} de ${visibleItems.length}`;
  }

  function close() {
    lightbox.classList.remove("is-open");
  }

  function next() {
    current = (current + 1) % visibleItems.length;
    render();
  }

  function prev() {
    current = (current - 1 + visibleItems.length) % visibleItems.length;
    render();
  }

  grid.addEventListener("click", (e) => {
    const item = e.target.closest(".portfolio-item");
    if (item) open(item);
  });

  closeBtn.addEventListener("click", close);
  nextBtn.addEventListener("click", next);
  prevBtn.addEventListener("click", prev);

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) close();
  });

  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("is-open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowRight") next();
    if (e.key === "ArrowLeft") prev();
  });
})();
