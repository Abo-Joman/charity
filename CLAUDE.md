# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is **Charity** — a custom Salla e-commerce theme built on the [Twilight Themes](https://docs.salla.dev/?nav=01HNFTD5Y5ESFQS3P9MJ0721VM) engine. It targets the [Salla Platform](https://salla.sa) and is a fork/customization of the open-source Theme Raed starter.

## Build Commands

This project requires **pnpm** (enforced via `preinstall` hook).

```bash
pnpm install              # Install dependencies
pnpm run watch            # Development build with file watching
pnpm run development      # One-shot development build
pnpm run prod             # Production build (minified)
```

There are no tests. `pnpm run watch` is the primary development workflow — it runs Webpack in watch mode and the Twilight watcher plugin syncs changes to the connected demo store.

To preview the theme live:
```bash
salla theme preview       # or: salla theme p
```
Run this from the `charity/` directory. Requires the [Salla CLI](https://www.npmjs.com/package/@salla.sa/cli) and a Salla Partners Portal account.

## Architecture

### Build Pipeline

Webpack bundles multiple JS entry points and the SCSS bundle into `public/`. The entry points map to specific page contexts:

| Entry | Pages served |
|-------|-------------|
| `app` | All pages (global — also includes wishlist and blog JS) |
| `home` | Home page |
| `product` | Product listing and single product |
| `product-card` | Reusable product card web component |
| `main-menu` | Navigation/menu |
| `checkout` | Cart and thank-you |
| `pages` | Loyalty and brands pages |
| `order` | Order tracking |
| `testimonials` | Testimonials page |
| `wishlist-card` | Wishlist card web component |

CSS is extracted via `MiniCssExtractPlugin` from `src/assets/styles/app.scss`. Images are copied from `src/assets/images/` to `public/images/`.

**Critical:** `src/assets/js/twilight.js` is explicitly excluded from the Webpack bundle — it's injected server-side by the Salla platform and exists only for IDE type support.

### Twig Templating

Views use [Twig](https://twig.symfony.com/) rendered by the Twilight engine server-side. Key conventions:

- `src/views/layouts/master.twig` — base layout with all shared `<head>` assets, hooks, and body structure
- `src/views/layouts/customer.twig` — layout for authenticated customer pages
- Pages extend layouts via `{% block content %}` / `{% block scripts %}` / `{% block styles %}`
- Components are included with `{% component 'header.header' %}` (dot-notation maps to `src/views/components/header/header.twig`)
- Salla platform hooks are inserted with `{% hook 'head:start' %}`, `{% hook body %}`, etc.

### JavaScript Class Hierarchy

```
AppHelpers          ← DOM utility methods (querySelector wrappers, class toggling, event binding)
  └── App           ← Main app class, instantiated once as window.app on salla.onReady()

BasePage            ← Base for per-page classes (onReady, registerEvents lifecycle)
  └── Product, Cart, Order, etc.

ProductCard extends HTMLElement   ← Custom element (<s-product-card>), renders itself
WishlistCard extends HTMLElement  ← Custom element, similar pattern
```

`window.app` is the global `App` instance. The `theme::ready` custom event fires after `App.loadTheApp()` completes — page classes and web components listen for this before initializing.

`BasePage.initiateWhenReady(allowedPages)` is the standard way to boot a page class: it either calls `initiate()` immediately if the app is ready, or defers to the `theme::ready` event.

### Salla SDK

The `salla` global object is injected by the platform. Key namespaces used throughout:
- `salla.config.get('page.slug')` — current page identifier
- `salla.lang.get('key')` — i18n string lookup
- `salla.notify.setNotifier()` — toast/alert system (wired to SweetAlert2)
- `salla.cart.event`, `salla.wishlist.event`, `salla.product.event` — reactive event bus
- `salla.money()`, `salla.helpers.number()` — formatting utilities

### Theme Configuration (`twilight.json`)

Defines the theme's identity, features, merchant-configurable settings, and home page components for the Salla Partners Portal UI. `theme.settings.<id>` in Twig accesses values set here. Settings are also exposed as JS globals in `master.twig` (e.g., `window.header_is_sticky`).

### Styling

SCSS follows ITCSS layers (`01-settings` → `02-generic` → `03-elements` → `04-components` → `05-utilities`). Tailwind utility classes are used extensively via `@apply` inside SCSS rather than inline in templates. The Tailwind config uses `@salla.sa/twilight-tailwind-theme` plugin and pulls class safe-lists from that package. Theme colors are CSS custom properties (`--color-primary`, etc.) set dynamically in `master.twig` from `theme.color.*`.

### Localization

`src/locales/ar.json` and `src/locales/en.json` contain theme-specific override translations. The Salla platform provides the base translation set; these files only need to define keys that differ from or extend the defaults.

## RTL/LTR Support

The theme fully supports both Arabic (RTL) and English (LTR). `theme.is_rtl` is available in Twig; `salla.config.get('theme.is_rtl')` in JS. Separate SCSS partials (`rtl.scss`, `ltr.scss`) handle directional overrides. Menu offcanvas position, notification placement, and other directional UI elements check this flag at runtime.
