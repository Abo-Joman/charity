# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This repository (`Abo-Joman/charity`) ships **Nexus** — a luxury dark-tech Salla e-commerce theme built on the [Twilight Themes](https://docs.salla.dev/?nav=01HNFTD5Y5ESFQS3P9MJ0721VM) engine. It started as a fork of the open-source `SallaApp/theme-raed` starter and was redesigned around a dark palette, electric-blue/gold/purple accents, and animated home blocks. The internal name in `package.json` is still `theme-raed` for historical reasons; the merchant-facing identity in `twilight.json` is **Nexus / نيكسس**.

## Build Commands

This project requires **pnpm** (enforced via the `preinstall` hook in `package.json`).

```bash
pnpm install              # Install dependencies
pnpm run watch            # Development build with file watching (primary workflow)
pnpm run development      # One-shot development build
pnpm run prod             # Production build (minified) — alias: pnpm run production
```

There are no tests; `pnpm test` exits with an error stub. `pnpm run watch` runs Webpack in watch mode and the bundled `@salla.sa/twilight/watcher.js` plugin syncs changes to the connected demo store.

To preview the theme live:
```bash
salla theme preview       # or: salla theme p
```
Run this from the `charity/` directory. Requires the [Salla CLI](https://www.npmjs.com/package/@salla.sa/cli) and a Salla Partners Portal account.

## Architecture

### Build Pipeline (`webpack.config.js`)

Webpack bundles JS entry points and the SCSS bundle into `public/` (cleaned each build). Entries map to page contexts:

| Entry | Sources |
|-------|---------|
| `app` | `styles/app.scss`, `wishlist.js`, `app.js`, `blog.js` — loaded on every page |
| `home` | `home.js` |
| `product` | `product.js`, `products.js` |
| `product-card` | `partials/product-card.js` (the `<s-product-card>` custom element) |
| `main-menu` | `partials/main-menu.js` |
| `wishlist-card` | `partials/wishlist-card.js` (custom element) |
| `checkout` | `cart.js`, `thankyou.js` |
| `pages` | `loyalty.js`, `brands.js` |
| `order` | `order.js` |
| `testimonials` | `testimonials.js` |

CSS is extracted via `MiniCssExtractPlugin` from `src/assets/styles/app.scss`. Images are copied from `src/assets/images/` to `public/images/`.

**Critical:** `src/assets/js/twilight.js` is explicitly excluded from the Webpack bundle (`webpack.config.js:35`) — it's injected server-side by the Salla platform and exists only for IDE type support.

### Twig Templating

Views use [Twig](https://twig.symfony.com/) rendered by the Twilight engine server-side. Layout:

- `src/views/layouts/master.twig` — base layout: `<head>`, hook placeholders (`{% hook 'head:start' %}`, `{% hook head %}`, `{% hook body %}`), exposes `window.header_is_sticky`, `window.imageZoom`, `window.can_access_wallet`, and sets theme color CSS variables from `theme.color.*`.
- `src/views/layouts/customer.twig` — wraps authenticated customer pages under `src/views/pages/customer/`.
- `src/views/pages/` — `index.twig`, `cart.twig`, `landing-page.twig`, `page-single.twig`, `testimonials.twig`, `thank-you.twig`, plus subfolders `blog/`, `brands/`, `customer/`, `product/`, `partials/`.
- `src/views/components/{header,footer,home}/` — reusable components included with `{% component 'header.header' %}` (dot-notation maps to `src/views/components/header/header.twig`).

Pages extend layouts via `{% block content %}` / `{% block scripts %}` / `{% block styles %}`.

### JavaScript Class Hierarchy

```
AppHelpers (src/assets/js/app-helpers.js)
  └── App (src/assets/js/app.js) — instantiated as window.app on salla.onReady()

BasePage (src/assets/js/base-page.js)
  └── Home, Product, Cart, Order, Blog, Brands, Loyalty, Testimonials, Wishlist, ThankYou

ProductCard, WishlistCard (src/assets/js/partials/) — extend HTMLElement (<s-product-card>, <s-wishlist-card>)
```

- `AppHelpers` provides DOM utilities used across the codebase: `element()`, `all()`, `on()`, `onClick()`, `toggleClassIf()`, `toggleElementClassIf()`, `watchElements()`, `addClass()`, `removeClass()`. Use these in preference to raw `querySelector` calls.
- `App.loadTheApp()` dispatches the `theme::ready` custom event; page classes and web components listen for it before initializing.
- `BasePage.initiateWhenReady(allowedPages)` is the standard boot pattern — it checks `salla.config.get('page.slug')` against `allowedPages` and either calls `initiate()` immediately if the app is ready or defers to `theme::ready`. Example: `Home.initiateWhenReady(["index"])`.

### Salla SDK

The `salla` global is injected by the platform. Key namespaces used throughout:
- `salla.config.get('page.slug')` — current page identifier
- `salla.config.get('theme.is_rtl')` — RTL flag (also `theme.is_rtl` in Twig)
- `salla.lang.get('key')` — i18n string lookup
- `salla.notify.setNotifier()` — toast/alert system (wired to SweetAlert2)
- `salla.cart.event`, `salla.wishlist.event`, `salla.product.event` — reactive event bus
- `salla.money()`, `salla.helpers.number()` — formatting utilities

### Theme Configuration (`twilight.json`)

Defines the theme's identity, feature flags, merchant-configurable settings, and home-page block catalog rendered in the Salla Partners Portal UI. Current shape:

- `name`: `Nexus` (ar: `نيكسس`), `repository`: `Abo-Joman/charity`.
- `features` (17): `mega-menu`, `fonts`, `color`, `breadcrumb`, `unite-cards-height`, `menu-images`, `filters`, plus the `component-*` set (`featured-products`, `fixed-banner`, `fixed-products`, `products-slider`, `photos-slider`, `parallax-background`, `testimonials`, `square-photos`, `store-features`, `youtube`).
- `settings` — flat array of merchant settings (Arabic-labeled). `theme.settings.<id>` reads them in Twig; key flags (`header_is_sticky`, `imageZoom`, `can_access_wallet`, etc.) are mirrored to `window.<id>` in `master.twig`.

When adding a new merchant-configurable knob, add it to `settings` here and (if needed in JS) expose it as a `window.*` global in `master.twig`.

## NEXUS Design System

`src/assets/styles/01-settings/global.scss` is the **source of truth for design tokens**. Never hardcode hex values in components — reference these CSS variables or the Tailwind tokens that proxy them.

| Group | Variables |
|-------|-----------|
| Surfaces | `--bg-base` (page, `#09090F`), `--bg-surface`, `--bg-surface-2`, `--bg-surface-3` |
| Borders | `--border-subtle`, `--border-default`, `--border-strong` (rgba opacity scale) |
| Accent — blue | `--color-primary` `#00D4FF`, `--color-primary-dark`, `--color-primary-light`, `--color-primary-glow`, `--color-primary-glow-strong` |
| Accent — gold | `--color-gold` `#FFD166`, `--color-gold-dark`, `--color-gold-glow` |
| Accent — purple | `--color-purple` `#7B61FF`, `--color-purple-glow` |
| Text | `--text-primary` `#FFFFFF`, `--text-secondary` `#A0AABB`, `--text-muted` `#5A6476` |
| Gradients | `--gradient-primary`, `--gradient-gold`, `--gradient-dark`, `--gradient-card` |
| Shadows | `--shadow-blue`, `--shadow-gold`, `--shadow-card`, `--shadow-header` |
| Radii | `--radius-sm` 6px, `--radius-md` 12px, `--radius-lg` 20px, `--radius-xl` 28px |
| Motion | `--ease-elastic`, `--ease-smooth` |
| Layout | `--section-py: 80px` |

Legacy variables (`--infinte-color`, `--color-grey`, `--color-light-grey`, `--color-text`, `--bg-gray`, `--main-text-color`) are remapped onto NEXUS values to keep Salla SDK components rendering correctly — leave them in place.

### Tailwind Tokens (`tailwind.config.js`)

`darkMode: 'class'`. Container: `max-w-[1280px]` at `2xl` with 16px padding. The tailwind theme proxies the CSS variables, so any of these are usable in markup:

- Colors: `primary`, `primary-dark`, `primary-light`, `gold`, `gold-dark`, `purple`, `base`, `surface`, `surface-2`, `surface-3`, `text-primary`, `text-secondary`, `text-muted`, `danger` (`#FF4D4D`), `dark`, `darker`.
- `backgroundImage`: `bg-gradient-primary` / `gold` / `dark` / `card`, `bg-glow-blue`, `bg-glow-gold`, `bg-grid-dark`.
- `boxShadow`: `shadow-blue`, `shadow-gold`, `shadow-card`, `shadow-header`, `shadow-glow-sm` / `md` / `lg`, `shadow-dropdown`, `shadow-mobile`, `shadow-progress`, `shadow-huge`.
- `borderRadius`: `rounded-tiny` / default / `rounded-large` / `rounded-big`.
- `borderColor`: default / `border-subtle` / `border-strong`.

Tailwind safe-list is pulled from `node_modules/@salla.sa/twilight-tailwind-theme/safe-list-css.txt`. Tailwind is used predominantly via `@apply` inside SCSS rather than inline in templates, except in newer NEXUS components which mix both.

### Styling Layout (ITCSS)

`src/assets/styles/app.scss` imports layers in order:
- `01-settings/` — `tailwind.scss`, `fonts.scss`, `global.scss` (tokens), `breakpoints.scss`
- `02-generic/` — reset, common, animations, lazyload, tooltip, `rtl.scss`, `ltr.scss`, `_mixins`
- `03-elements/` — buttons, form, radio, radio-images
- `04-components/` — header, footer, menus, user-menu, user-pages, product, slider, `home-blocks.scss` (all NEXUS hero/feature SCSS), brands, landing-page, loyalty, gifting, filters, no-content-placeholder, virtooal
- `05-utilities/` — chat-bots, swal (SweetAlert2), safari-fixes, font-customization

To add new tokens: declare the CSS variable in `01-settings/global.scss`, then optionally expose it in `tailwind.config.js` if needed in markup.

## NEXUS Components & Animation Contract

### Component naming

NEXUS blocks use `.nexus-<block>__<element>--<modifier>` BEM classes. Newer purpose-built blocks carry a `-nexus` suffix in the filename (e.g. `hero-nexus.twig`); other NEXUS-styled blocks keep their descriptive names (e.g. `features-strip.twig`). Current NEXUS surfaces:

- `src/views/components/home/hero-nexus.twig` — `.nexus-hero`, `#nexus-hero`
- `src/views/components/home/categories-nexus.twig` — `.nexus-categories`
- `src/views/components/home/features-strip.twig` — `.nexus-features`
- `src/views/components/header/header.twig` — `.nexus-header`, `#nexus-header`, with `.nexus-topbar`, `.nexus-mainnav` (`#mainnav`), `.nexus-brand`, `.nexus-icon-btn`, `.nexus-hamburger`, `.nexus-mobile-menu`
- `src/views/components/footer/footer.twig` — `.nexus-footer` with `__body`, `__brand`, `__tagline`, `__social`, `__vat`, `__heading`, `__glow`

Older home blocks (`featured-products-style1/2/3.twig`, `enhanced-slider.twig`, `enhanced-square-banners.twig`, `square-photos.twig`, `youtube.twig`, etc.) remain functional and use the pre-redesign class system — don't blindly rename them.

### Animation API

`src/assets/js/home.js` (loaded only on the `index` page slug) runs an Intersection-Observer + anime.js animation framework. Markup contract:

- `data-animate="fade-up"` — element fades up + adds `.is-visible` when it enters the viewport.
- `data-delay="200"` (ms) — optional delay before `.is-visible` is added.
- `data-animate-section` — wrapper attribute; staggers its `[data-animate]` children at 100ms intervals on entry.
- `#nexus-hero` triggers an anime.js entrance against `.nexus-hero__eyebrow`, `.nexus-hero__heading`, `.nexus-hero__sub`, `.nexus-hero__actions`, `.nexus-hero__stats`, `.nexus-hero__product-wrap`, `.nexus-hero__badge--top`, `.nexus-hero__badge--bottom`, `.nexus-hero__ring`.
- `.nexus-hero__stat-num` count up from 0; supports `+`, `%`, and `K` suffixes (skips ratios like `24/7`).
- Sticky header (`initStickyHeader`): toggles `.is-sticky` on `#nexus-header` after 10px scroll; toggles `.fixed-pinned`, `.fixed-header`, and `.animated` on `#mainnav` past its offset and past 200px.
- `.tab-trigger` + `data-component-id` + `data-target` drive the featured-products tab switcher inside `.s-block-tabs`.

When adding new animated content, prefer extending this attribute contract over writing one-off JS.

## Localization

`src/locales/ar.json` (Arabic) and `src/locales/en.json` (English) contain theme-specific translation overrides. The Salla platform provides the base translation set; these files only need to define keys that differ from or extend the defaults.

## RTL/LTR Support

The theme fully supports both Arabic (RTL) and English (LTR):

- `theme.is_rtl` in Twig; `salla.config.get('theme.is_rtl')` in JS.
- `src/assets/styles/02-generic/rtl.scss` and `ltr.scss` hold directional overrides.
- Menu offcanvas position, SweetAlert2 notification placement (`top-start` vs. `top-end`), and arrow icons (`sicon-arrow-left` vs. `right`) check this flag at runtime.

## Repository Conventions

- Owner: `Abo-Joman/charity` (forked from upstream `SallaApp/theme-raed`).
- Branching: feature branches are pushed against `master`. The current Claude development branch is `claude/add-claude-documentation-tSq8o`.
- `.github/CODEOWNERS` still references upstream Salla teams.
- `.github/dependabot.yml` runs weekly `npm` updates.
- No CI workflows.
- `CHANGELOG.md` tracks upstream Theme Raed releases — don't append local changes there. Local history lives in git only.
- `README.md` is the original Theme Raed README and is not Nexus-specific.
