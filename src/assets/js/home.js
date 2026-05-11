import "lite-youtube-embed";
import BasePage from "./base-page";
import Lightbox from "fslightbox";
import anime from "animejs/lib/anime.es.js";
window.fslightbox = Lightbox;

class Home extends BasePage {
  onReady() {
    this.initScrollAnimations();
    this.initHeroAnimations();
    this.initFeaturedTabs();
    this.initStickyHeader();
    this.initCounters();
  }

  // ── Intersection Observer — fade-up on scroll ──────────
  initScrollAnimations() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const delay = parseInt(el.dataset.delay) || 0;

          setTimeout(() => el.classList.add("is-visible"), delay);
          observer.unobserve(el);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    document.querySelectorAll("[data-animate]").forEach((el) => {
      observer.observe(el);
    });

    // Section-level observer — triggers children in sequence
    document.querySelectorAll("[data-animate-section]").forEach((section) => {
      const sectionObserver = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          section
            .querySelectorAll("[data-animate]")
            .forEach((el, i) => {
              setTimeout(() => el.classList.add("is-visible"), i * 100);
            });
          sectionObserver.unobserve(section);
        },
        { threshold: 0.08 }
      );
      sectionObserver.observe(section);
    });
  }

  // ── Hero entrance animation ────────────────────────────
  initHeroAnimations() {
    const hero = document.getElementById("nexus-hero");
    if (!hero) return;

    // Stagger in text elements
    anime({
      targets: [
        ".nexus-hero__eyebrow",
        ".nexus-hero__heading",
        ".nexus-hero__sub",
        ".nexus-hero__actions",
        ".nexus-hero__stats",
      ],
      opacity: [0, 1],
      translateY: [30, 0],
      duration: 700,
      delay: anime.stagger(120, { start: 200 }),
      easing: "easeOutExpo",
    });

    // Product image
    anime({
      targets: ".nexus-hero__product-wrap",
      opacity: [0, 1],
      scale: [0.88, 1],
      duration: 900,
      delay: 400,
      easing: "easeOutExpo",
    });

    // Badges
    anime({
      targets: [".nexus-hero__badge--top", ".nexus-hero__badge--bottom"],
      opacity: [0, 1],
      translateX: (el) => [el.classList.contains("nexus-hero__badge--top") ? 20 : -20, 0],
      duration: 600,
      delay: anime.stagger(150, { start: 800 }),
      easing: "easeOutBack",
    });

    // Ring fade in
    anime({
      targets: ".nexus-hero__ring",
      opacity: [0, 1],
      scale: [0.7, 1],
      duration: 1200,
      delay: 300,
      easing: "easeOutExpo",
    });
  }

  // ── Sticky header with shrink effect ──────────────────
  initStickyHeader() {
    const header = document.getElementById("nexus-header");
    const mainnav = document.getElementById("mainnav");
    if (!header || !mainnav) return;

    const height = mainnav.querySelector(".inner")?.clientHeight || 80;

    const onScroll = () => {
      const y = window.scrollY;
      header.classList.toggle("is-sticky", y > 10);
      mainnav.classList.toggle("fixed-pinned", y >= mainnav.offsetTop + height);
      mainnav.classList.toggle("fixed-header", y >= 200);
      mainnav.classList.toggle("animated", y >= 200);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", () => {
      const h = mainnav.querySelector(".inner")?.clientHeight;
      if (h) app.element && app.element("#mainnav").style && (app.element("#mainnav").style.height = h + "px");
    });
  }

  // ── Animated counters (stat numbers) ─────────────────
  initCounters() {
    const counters = document.querySelectorAll(".nexus-hero__stat-num");
    if (!counters.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const raw = el.textContent.trim();
          const hasPlus = raw.startsWith("+");
          const hasPct = raw.endsWith("%");
          const numStr = raw.replace(/[^0-9Kk]/g, "");
          const isK = numStr.toUpperCase().endsWith("K");
          const num = parseFloat(numStr) * (isK ? 1000 : 1);

          if (isNaN(num) || raw.includes("/")) return;

          anime({
            targets: { val: 0 },
            val: num,
            duration: 1600,
            easing: "easeOutExpo",
            update(anim) {
              const v = Math.round(anim.animatables[0].target.val);
              let display = isK ? (v / 1000).toFixed(0) + "K" : v.toString();
              el.textContent = (hasPlus ? "+" : "") + display + (hasPct ? "%" : "");
            },
          });

          observer.unobserve(el);
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((c) => observer.observe(c));
  }

  // ── Featured product tabs ─────────────────────────────
  initFeaturedTabs() {
    app.all(".tab-trigger", (el) => {
      el.addEventListener("click", ({ currentTarget: btn }) => {
        const id = btn.dataset.componentId;
        app
          .toggleClassIf(
            `#${id} .tabs-wrapper>div`,
            "is-active opacity-0 translate-y-3",
            "inactive",
            (tab) => tab.id == btn.dataset.target
          )
          .toggleClassIf(
            `#${id} .tab-trigger`,
            "is-active",
            "inactive",
            (tabBtn) => tabBtn == btn
          );

        setTimeout(
          () =>
            app.toggleClassIf(
              `#${id} .tabs-wrapper>div`,
              "opacity-100 translate-y-0",
              "opacity-0 translate-y-3",
              (tab) => tab.id == btn.dataset.target
            ),
          100
        );
      });
    });

    document
      .querySelectorAll(".s-block-tabs")
      .forEach((block) => block.classList.add("tabs-initialized"));
  }
}

Home.initiateWhenReady(["index"]);
