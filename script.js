document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const header = document.querySelector(".header");
  const menuToggle = document.getElementById("menuToggle");
  const navigation = document.getElementById("navigation");
  const backToTop = document.getElementById("backToTop");
  const currentYear = document.getElementById("currentYear");

  // Ano automático no rodapé
  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  // Menu mobile
  if (menuToggle && navigation) {
    const closeMenu = () => {
      navigation.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Abrir menu");
    };

    menuToggle.addEventListener("click", () => {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";

      navigation.classList.toggle("open", !isOpen);
      menuToggle.setAttribute("aria-expanded", String(!isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Abrir menu" : "Fechar menu"
      );
    });

    navigation.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });

    document.addEventListener("click", (event) => {
      if (
        navigation.classList.contains("open") &&
        !navigation.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        closeMenu();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 760) {
        closeMenu();
      }
    });
  }

  // Cabeçalho e botão de voltar ao topo
  const updateScrollElements = () => {
    const scrollPosition = window.scrollY;

    if (header) {
      header.classList.toggle("scrolled", scrollPosition > 20);
    }

    if (backToTop) {
      backToTop.classList.toggle("visible", scrollPosition > 450);
    }
  };

  window.addEventListener("scroll", updateScrollElements, {
    passive: true
  });

  updateScrollElements();

  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }

  // Rolagem suave para links internos
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") {
        return;
      }

      const target = document.querySelector(targetId);

      if (!target) {
        return;
      }

      event.preventDefault();

      target.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
        block: "start"
      });

      // Mantém o endereço navegável sem saltos bruscos
      if (history.replaceState) {
        history.replaceState(null, "", targetId);
      }
    });
  });

  // Animações de entrada conforme as seções aparecem
  const revealElements = document.querySelectorAll(
    [
      ".section-heading",
      ".about-copy",
      ".about-note",
      ".about-image",
      ".proposal-card",
      ".knowledge-image-wrap",
      ".knowledge-content",
      ".audience-card",
      ".environment-card",
      ".swot-card",
      ".strategy-item",
      ".mix-card",
      ".metric-card",
      ".timeline-item",
      ".budget-content",
      ".budget-breakdown",
      ".indicators-table-wrap",
      ".control-note",
      ".contact-content",
      ".contact-card"
    ].join(",")
  );

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if ("IntersectionObserver" in window && !reduceMotion) {
    body.classList.add("js-ready");

    revealElements.forEach((element) => {
      element.classList.add("reveal");
    });

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -35px 0px"
      }
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  }

  // Movimento sutil na imagem principal com o movimento do ponteiro.
  // Desativado em dispositivos sem ponteiro preciso ou com movimento reduzido.
  const hero = document.querySelector(".hero");
  const heroVisual = document.querySelector(".hero-visual");
  const heroImage = document.querySelector(".hero-image");

  const hasFinePointer = window.matchMedia("(pointer: fine)").matches;

  if (hero && heroVisual && heroImage && hasFinePointer && !reduceMotion) {
    hero.addEventListener("pointermove", (event) => {
      const bounds = heroVisual.getBoundingClientRect();

      if (
        event.clientX < bounds.left ||
        event.clientX > bounds.right ||
        event.clientY < bounds.top ||
        event.clientY > bounds.bottom
      ) {
        return;
      }

      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;

      heroImage.style.transform =
        `scale(1.025) translate(${x * 8}px, ${y * 8}px)`;
    });

    hero.addEventListener("pointerleave", () => {
      heroImage.style.transform = "";
    });
  }

  // Fecha o menu se a página for navegada para outra seção pelo histórico.
  window.addEventListener("hashchange", () => {
    if (navigation && menuToggle) {
      navigation.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Abrir menu");
    }
  });
});