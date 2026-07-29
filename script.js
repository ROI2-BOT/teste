/* =========================================================
   PARTITURA FÁCIL — LANDING PAGE
   JavaScript puro (sem dependências externas)
   Módulos: config > contador > acordeão > carrossel >
            revelação ao rolar > cta fixo > utilidades
   ========================================================= */

(function () {
  "use strict";

  /* ---------- 1. CONFIGURAÇÃO ----------
     Altere apenas este objeto para trocar o link de checkout
     em todos os botões CTA da página de uma só vez. */
  const CONFIG = {
    checkoutUrl: "https://exemplo.com/checkout", // <-- troque pelo link real de pagamento
    countdownMinutes: 15 * 60, // duração do contador regressivo, em minutos (15h)
  };

  /* ---------- 2. Aplica o link de checkout a todos os CTAs ---------- */
  function wireCtaLinks() {
    const ctas = document.querySelectorAll("[data-cta], #mainCta");
    ctas.forEach((link) => {
      // mantém âncoras internas (#oferta) para navegação suave,
      // mas o CTA principal e o fixo apontam para o checkout real
      if (link.id === "mainCta" || link.dataset.cta === "sticky") {
        link.setAttribute("href", CONFIG.checkoutUrl);
        link.setAttribute("target", "_blank");
        link.setAttribute("rel", "noopener noreferrer");
      }
    });
  }

  /* ---------- 3. Contador regressivo ---------- */
  function initCountdown() {
    const elHours = document.getElementById("cd-hours");
    const elMinutes = document.getElementById("cd-minutes");
    const elSeconds = document.getElementById("cd-seconds");
    if (!elHours || !elMinutes || !elSeconds) return;

    // Guarda o horário-alvo em sessionStorage para persistir durante a sessão
    const storageKey = "pf_countdown_target";
    let target = sessionStorage.getItem(storageKey);

    if (!target) {
      target = Date.now() + CONFIG.countdownMinutes * 60 * 1000;
      sessionStorage.setItem(storageKey, target);
    } else {
      target = parseInt(target, 10);
    }

    function pad(num) {
      return String(num).padStart(2, "0");
    }

    function tick() {
      const diff = target - Date.now();

      if (diff <= 0) {
        // Reinicia o ciclo para manter a urgência (comportamento comum em ofertas)
        const newTarget = Date.now() + CONFIG.countdownMinutes * 60 * 1000;
        sessionStorage.setItem(storageKey, newTarget);
        target = newTarget;
        return;
      }

      const totalSeconds = Math.floor(diff / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      elHours.textContent = pad(hours);
      elMinutes.textContent = pad(minutes);
      elSeconds.textContent = pad(seconds);
    }

    tick();
    setInterval(tick, 1000);
  }

  /* ---------- 4. Acordeão (FAQ) ---------- */
  function initAccordion() {
    const items = document.querySelectorAll(".accordion-item");
    items.forEach((item) => {
      const trigger = item.querySelector(".accordion-trigger");
      const panel = item.querySelector(".accordion-panel");
      if (!trigger || !panel) return;

      trigger.addEventListener("click", () => {
        const isOpen = trigger.getAttribute("aria-expanded") === "true";

        // Fecha os outros itens (comportamento de acordeão único)
        items.forEach((other) => {
          if (other !== item) {
            other.querySelector(".accordion-trigger").setAttribute("aria-expanded", "false");
            other.querySelector(".accordion-panel").style.maxHeight = null;
          }
        });

        trigger.setAttribute("aria-expanded", String(!isOpen));
        panel.style.maxHeight = isOpen ? null : panel.scrollHeight + "px";
      });
    });
  }

  /* ---------- 5. Carrossel de depoimentos ---------- */
  function initCarousel() {
    const track = document.getElementById("carouselTrack");
    const dotsWrap = document.getElementById("carouselDots");
    const prevBtn = document.getElementById("carouselPrev");
    const nextBtn = document.getElementById("carouselNext");
    if (!track || !dotsWrap) return;

    const slides = Array.from(track.children);
    let current = 0;
    let autoplayTimer = null;

    // Cria os indicadores (dots) dinamicamente
    slides.forEach((_, index) => {
      const dot = document.createElement("button");
      dot.className = "carousel-dot";
      dot.setAttribute("role", "tab");
      dot.setAttribute("aria-label", "Ir para depoimento " + (index + 1));
      dot.addEventListener("click", () => goTo(index));
      dotsWrap.appendChild(dot);
    });
    const dots = Array.from(dotsWrap.children);

    function update() {
      track.style.transform = "translateX(-" + current * 100 + "%)";
      dots.forEach((dot, i) => dot.classList.toggle("is-active", i === current));
    }

    function goTo(index) {
      current = (index + slides.length) % slides.length;
      update();
      restartAutoplay();
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    function restartAutoplay() {
      clearInterval(autoplayTimer);
      autoplayTimer = setInterval(next, 6000);
    }

    if (nextBtn) nextBtn.addEventListener("click", next);
    if (prevBtn) prevBtn.addEventListener("click", prev);

    // Suporte a arraste (swipe) em telas de toque
    let startX = 0;
    track.addEventListener("touchstart", (e) => { startX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener("touchend", (e) => {
      const diff = e.changedTouches[0].clientX - startX;
      if (diff > 40) prev();
      else if (diff < -40) next();
    }, { passive: true });

    update();
    restartAutoplay();

    // Pausa o autoplay quando a aba não está visível
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) clearInterval(autoplayTimer);
      else restartAutoplay();
    });
  }

  /* ---------- 6. Revelação de elementos ao rolar ---------- */
  function initScrollReveal() {
    const targets = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window) || targets.length === 0) {
      targets.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    targets.forEach((el) => observer.observe(el));
  }

  /* ---------- 7. Botão CTA fixo em telas pequenas ---------- */
  function initStickyCta() {
    const sticky = document.getElementById("stickyCta");
    const offerSection = document.getElementById("oferta");
    if (!sticky || !offerSection) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Mostra o botão fixo quando a seção de oferta ainda NÃO está visível
          sticky.classList.toggle("is-visible", !entry.isIntersecting && entry.boundingClientRect.top > 0 === false ? true : !entry.isIntersecting);
        });
      },
      { threshold: 0 }
    );

    // Regra simplificada: aparece após rolar 600px, some perto do rodapé da oferta
    window.addEventListener("scroll", () => {
      const scrolled = window.scrollY > 600;
      const offerRect = offerSection.getBoundingClientRect();
      const offerInView = offerRect.top < window.innerHeight && offerRect.bottom > 0;
      sticky.classList.toggle("is-visible", scrolled && !offerInView);
    });
  }

  /* ---------- 8. Ano automático no rodapé ---------- */
  function initFooterYear() {
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }

  /* ---------- 9. Inicialização geral ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    wireCtaLinks();
    initCountdown();
    initAccordion();
    initCarousel();
    initScrollReveal();
    initStickyCta();
    initFooterYear();
  });
})();
