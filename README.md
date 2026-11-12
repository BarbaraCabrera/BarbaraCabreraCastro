# Bárbara Cabrera Castro: Personal Website

A responsive, accessible personal portfolio built with plain HTML, CSS and JavaScript. No build step and no frameworks are required. It is ready to be served by GitHub Pages, including on a custom domain.

## Project structure

```text
barbara-personal-website/
├── index.html              Page content and structure
├── favicon.svg             Site icon
├── README.md               This file
└── assets/
    ├── css/
    │   ├── theme.css       Colors, typography, spacing, radii and motion tokens
    │   └── styles.css      Layout, components, responsive rules and animations
    ├── js/
    │   └── main.js         Theme toggle, mobile navigation and scroll reveal
    └── images/
        └── profile.jpg     Portrait
```

All asset paths are relative, so the site works at the root of a custom domain and under a repository subpath.

## Preview locally

You can open `index.html` directly in a browser. For a preview that behaves like a real web server, run this from the project folder:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## Deploy with GitHub Pages

1. Copy the **contents** of this folder (not the folder itself) into the root of your GitHub Pages repository, so that `index.html` sits at the repository root next to the `assets` folder.
2. If your repository already contains a `CNAME` file for your custom domain, keep it. Do not delete or overwrite it, or the custom domain may stop working.
3. Commit and push to the branch that GitHub Pages publishes from (usually `main`).
4. In **Settings > Pages**, check that the source is your branch and the `/ (root)` folder. Your existing custom domain and HTTPS settings do not need to change.
5. Wait a minute or two for the deployment to finish, then refresh your site. If you still see the old version, do a hard refresh to clear the browser cache.

## Customize the design

All visual tokens live in `assets/css/theme.css`:

- `--color-*` variables define the palette for the light theme (in `:root`) and the dark theme (in `:root[data-theme="dark"]`).
- `--font-display` and `--font-body` define the typefaces. Fonts load from Google Fonts in `index.html`; fallback system fonts are already defined if you remove that link.
- `--space-*`, `--radius-*` and `--transition-*` control spacing, corner shapes and motion.

The light theme is the default. The visitor's choice is stored in `localStorage` under the key `barbara-website-theme`. If storage is unavailable, the toggle still works for the current visit.

## Accessibility

- Skip link, semantic landmarks (`header`, `nav`, `main`, `section`, `footer`) and a logical heading order.
- Visible keyboard focus on every interactive element.
- The theme switch is a real `button` with `aria-pressed`. The mobile menu button uses `aria-expanded` and `aria-controls`, and closes with the Escape key.
- External links announce that they open in a new tab.
- Text and background pairs meet WCAG AA contrast in both themes.
- Scroll reveal only hides content when JavaScript and `IntersectionObserver` are available. It is turned off when the visitor prefers reduced motion.
- Without JavaScript, all content and navigation remain visible and usable.

## Content notes

- The 2026 DEVCON entry intentionally has no city or venue, because these were not confirmed. Add them in `index.html` (inside `#devcon-2026`, element `.devcon-place`) when they are known.
- The 2026 topic tags (Personalisation, Audiences, Product ownership) were derived from the session title and description. Adjust them if you prefer different ones.
