# RodentX Wildlife Management — Website

Single-page site (hash-routed) for RodentX Wildlife Management, Finger Lakes Region, NY.

## Deployment

- Hosted on **GitHub Pages**: repo `FLOREXHOLDINGS/rodentx-website`, served from `main` / root.
- Live: https://florexholdings.github.io/rodentx-website/
- Updates are pushed through the GitHub web upload (the Muse GitHub App has read-only access to this repo).
- After editing `styles.css` or `app.js`, bump the cache-bust query in `index.html` (`styles.css?v=N`, `app.js?v=N`) so browsers pick up the new files. Current: `?v=15`.

## Files

- `index.html` — all 19 views (18 routes + Privacy)
- `styles.css` — styles (8px spacing system; tokens in `:root`)
- `app.js` — hash router, per-route titles/descriptions, forms, dropdowns, Instagram facade loader
- `assets/logo-a.webp` — header logo (right-sized WebP of the exact approved artwork)
- `assets/logo-rev.webp` — footer / comeback / 404 logo (reversed artwork)
- `assets/photos/` — real job photos: `.webp` files are served; the `.jpg` masters are kept alongside
- `favicon-64.png`, `apple-touch-icon.png`, `og-image.jpg` — brand icons and social card
- `404.html`, `robots.txt`

## Brand rules (do not break)

- Use the exact approved logo artwork only — do not recreate or approximate it.
- No pricing anywhere on the site. No invented services.
- Warranty wording, where used, is exactly: "Some exclusion work carries a warranty — coverage for the property is reviewed with you before service begins."
- The licensing line ("NYS NWCO license renewal in process") appears only in the footer, on Contact, and on Why RodentX.
- Scheduling is always qualified: "same-day when available".
- The phone number on the site is a placeholder until launch.
