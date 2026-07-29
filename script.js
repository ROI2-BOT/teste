/* =====================================================================
   CONFIGURAÇÕES
   Edite somente os valores abaixo para atualizar o checkout, as UTMs,
   os pixels de rastreamento e as imagens da página. Nenhum outro lugar
   do código precisa ser tocado.
   ===================================================================== */
const CONFIG = {

  /* ---------------------------------------------------------------
     CHECKOUT
     --------------------------------------------------------------- */
  // Link real do checkout (Hotmart, Stripe, PayPal, Kiwify, etc.).
  // É usado pelos 3 botões verdes da página (todos apontam para cá).
  CHECKOUT_URL: "https://go.centerpag.com/PPU38CQEN5I",

  /* ---------------------------------------------------------------
     UTM — parâmetros de rastreamento de campanha
     utm_campaign, utm_medium, utm_content e utm_term usam o formato
     dinâmico do Facebook Ads ({{campaign.name}}, {{adset.id}}, etc.).
     O próprio Facebook substitui esses marcadores quando o anúncio
     roda — não são valores fixos para editar manualmente.
     --------------------------------------------------------------- */
  UTM_SOURCE: "FB",
  UTM_CAMPAIGN: "{{campaign.name}}|{{campaign.id}}",
  UTM_MEDIUM: "{{adset.name}}|{{adset.id}}",
  UTM_CONTENT: "{{ad.name}}|{{ad.id}}",
  UTM_TERM: "{{placement}}",

  /* ---------------------------------------------------------------
     PIXELS / RASTREAMENTO
     Deixe o ID em branco ("") para manter aquele pixel desativado.
     Preencha o ID e o script correspondente carrega sozinho.
     --------------------------------------------------------------- */
  META_PIXEL_ID: "1014913961175791",
  GTM_ID: "",                // ex.: "GTM-XXXXXXX"
  GA_MEASUREMENT_ID: "",     // ex.: "G-XXXXXXXXXX"
  TIKTOK_PIXEL_ID: "",       // ex.: "CXXXXXXXXXXXXXXXXXXX"
  PINTEREST_TAG_ID: "",      // ex.: "2612XXXXXXXX"
  UTMIFY_SCRIPT_URL: "https://cdn.utmify.com.br/scripts/utms/latest.js",

  /* ---------------------------------------------------------------
     EVENTOS DE CONVERSÃO
     --------------------------------------------------------------- */
  EVENT_PAGE_VIEW: "PageView",
  EVENT_CHECKOUT_CLICK: "InitiateCheckout",

  /* ---------------------------------------------------------------
     IMAGENS
     Troque os caminhos abaixo para usar outras imagens. O texto
     alternativo (alt) de cada imagem fica junto da tag <img> no HTML.
     --------------------------------------------------------------- */
  IMAGE_HERO: "assets/hero-mockup.jpg",
  IMAGE_PRODUCT_PDF: "assets/product-pdf.jpg",
  IMAGE_PRODUCT_LATIN: "assets/product-latin.jpg",
  IMAGE_PRODUCT_CLASSICAL: "assets/product-classical.jpg",
  IMAGE_PRODUCT_INDEX: "assets/product-index.jpg",
  LOGO_URL: "" // esta página não usa um logo em imagem, só texto/emoji no cabeçalho
};

/* =====================================================================
   CHECKOUT — monta o link final e trata o clique nos 3 botões verdes
   ===================================================================== */

function buildCheckoutUrl() {
  const base = CONFIG.CHECKOUT_URL.replace(/\/$/, "");
  return (
    base +
    "?utm_source=" + CONFIG.UTM_SOURCE +
    "&utm_campaign=" + CONFIG.UTM_CAMPAIGN +
    "&utm_medium=" + CONFIG.UTM_MEDIUM +
    "&utm_content=" + CONFIG.UTM_CONTENT +
    "&utm_term=" + CONFIG.UTM_TERM
  );
}

function handleCheckoutClick(event) {
  if (typeof fbq === "function") {
    fbq("track", CONFIG.EVENT_CHECKOUT_CLICK);
  }
}

function setupCheckoutButtons() {
  const url = buildCheckoutUrl();
  document.querySelectorAll('[data-cta="checkout"]').forEach(function (button) {
    button.setAttribute("href", url);
    button.addEventListener("click", handleCheckoutClick);
  });
}

/* =====================================================================
   IMAGENS — aplica os caminhos definidos em CONFIG aos <img data-img="...">
   ===================================================================== */

function setupImages() {
  const imageMap = {
    HERO: CONFIG.IMAGE_HERO,
    PRODUCT_PDF: CONFIG.IMAGE_PRODUCT_PDF,
    PRODUCT_LATIN: CONFIG.IMAGE_PRODUCT_LATIN,
    PRODUCT_CLASSICAL: CONFIG.IMAGE_PRODUCT_CLASSICAL,
    PRODUCT_INDEX: CONFIG.IMAGE_PRODUCT_INDEX
  };
  document.querySelectorAll("[data-img]").forEach(function (img) {
    const key = img.getAttribute("data-img");
    if (imageMap[key]) {
      img.src = imageMap[key];
    }
  });
}

/* =====================================================================
   PIXELS — Meta (Facebook), Google Tag Manager, Google Analytics,
   TikTok, Pinterest e Utmify. Cada um só carrega se o ID em CONFIG
   estiver preenchido (GTM/GA/TikTok/Pinterest vêm vazios por padrão
   porque não são usados nesta página hoje).
   ===================================================================== */

function loadMetaPixel(pixelId) {
  if (!pixelId) return;
  !(function (f, b, e, v, n, t, s) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = true;
    n.version = "2.0";
    n.queue = [];
    t = b.createElement(e);
    t.async = true;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
  fbq("init", pixelId);
  fbq("track", CONFIG.EVENT_PAGE_VIEW);
}

function loadGoogleTagManager(gtmId) {
  if (!gtmId) return;
  (function (w, d, s, l, i) {
    w[l] = w[l] || [];
    w[l].push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
    const f = d.getElementsByTagName(s)[0];
    const j = d.createElement(s);
    const dl = l !== "dataLayer" ? "&l=" + l : "";
    j.async = true;
    j.src = "https://www.googletagmanager.com/gtm.js?id=" + i + dl;
    f.parentNode.insertBefore(j, f);
  })(window, document, "script", "dataLayer", gtmId);
}

function loadGoogleAnalytics(measurementId) {
  if (!measurementId) return;
  const script = document.createElement("script");
  script.async = true;
  script.src = "https://www.googletagmanager.com/gtag/js?id=" + measurementId;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  window.gtag = gtag;
  gtag("js", new Date());
  gtag("config", measurementId);
}

function loadTikTokPixel(pixelId) {
  if (!pixelId) return;
  (function (w, d, t) {
    w.TiktokAnalyticsObject = t;
    const ttq = (w[t] = w[t] || []);
    ttq.methods = ["page", "track", "identify", "instances", "debug", "on", "off", "once", "ready", "alias", "group", "enableCookie", "disableCookie"];
    ttq.setAndDefer = function (obj, method) {
      obj[method] = function () {
        obj.push([method].concat(Array.prototype.slice.call(arguments, 0)));
      };
    };
    for (let i = 0; i < ttq.methods.length; i++) {
      ttq.setAndDefer(ttq, ttq.methods[i]);
    }
    ttq.load = function (pixelCode) {
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.async = true;
      script.src = "https://analytics.tiktok.com/i18n/pixel/events.js?sdkid=" + pixelCode;
      const firstScript = document.getElementsByTagName("script")[0];
      firstScript.parentNode.insertBefore(script, firstScript);
    };
    ttq.load(pixelId);
    ttq.page();
  })(window, document, "ttq");
}

function loadPinterestTag(tagId) {
  if (!tagId) return;
  (function (e) {
    if (!e.pintrk) {
      e.pintrk = function () {
        e.pintrk.queue.push(Array.prototype.slice.call(arguments));
      };
      const n = e.pintrk;
      n.queue = [];
      n.version = "3.0";
      const t = document.createElement("script");
      t.async = true;
      t.src = "https://s.pinimg.com/ct/core.js";
      const r = document.getElementsByTagName("script")[0];
      r.parentNode.insertBefore(t, r);
    }
  })(window);
  pintrk("load", tagId);
  pintrk("page");
}

function loadUtmify(scriptUrl) {
  if (!scriptUrl) return;
  const script = document.createElement("script");
  script.src = scriptUrl;
  script.async = true;
  script.defer = true;
  script.setAttribute("data-utmify-prevent-xcod-sck", "");
  script.setAttribute("data-utmify-prevent-subids", "");
  (document.head || document.documentElement).appendChild(script);
}

function setupPixels() {
  loadMetaPixel(CONFIG.META_PIXEL_ID);
  loadGoogleTagManager(CONFIG.GTM_ID);
  loadGoogleAnalytics(CONFIG.GA_MEASUREMENT_ID);
  loadTikTokPixel(CONFIG.TIKTOK_PIXEL_ID);
  loadPinterestTag(CONFIG.PINTEREST_TAG_ID);
  loadUtmify(CONFIG.UTMIFY_SCRIPT_URL);
}

/* =====================================================================
   PROVA SOCIAL — rotação do aviso "alguém acabou de comprar"
   ===================================================================== */

function setupSocialProofToast() {
  const notifications = [
    "Rosa de Buenos Aires se unió hace 7 minutos",
    "Diego de Medellín acaba de comprar — hace 1 minuto",
    "María Fernanda de Bogotá acaba de comprar — hace 2 minutos",
    "Andrés de Ciudad de México se unió hace 4 minutos",
    "Patricia de Santiago acaba de comprar — hace 3 minutos",
    "Roberto de Guayaquil se unió hace 5 minutos",
    "Carla de Lima acaba de comprar — hace 1 minuto"
  ];

  const box = document.getElementById("toast-box");
  const text = document.getElementById("toast-text");
  if (!box || !text) return;

  let index = 0;
  setInterval(function () {
    box.style.opacity = "0";
    box.style.transform = "translateX(-16px)";
    setTimeout(function () {
      index = (index + 1) % notifications.length;
      text.textContent = notifications[index];
      box.style.opacity = "1";
      box.style.transform = "translateX(0)";
    }, 500);
  }, 6000);
}

/* =====================================================================
   INICIALIZAÇÃO
   ===================================================================== */

function init() {
  setupPixels();
  setupCheckoutButtons();
  setupImages();
  setupSocialProofToast();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
