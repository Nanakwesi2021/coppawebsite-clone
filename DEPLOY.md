# Deploying Coppa Cocktails Ghana

Handoff guide for whoever continues the deployment (a person or an AI agent such as Antigravity).

## Where things stand (9 Nov 2026)

- **Code:** GitHub `Nanakwesi2021/coppawebsite-clone`, branch `main`, commit `8fad64b`.
- **Build:** `dist/` was built from `8fad64b` with `npm run build`. It has **not** been uploaded yet.
- **Live site:** https://coppacocktailsgh.com, hosted on Hostinger (LiteSpeed/Apache), served from `public_html`.
- **Still to do:** upload `dist/` to Hostinger, then run the checks in "After uploading".

## The project in brief

- Vite single-page app in plain JavaScript (no framework). Pages are hash routes, e.g. `#box`, `#cocktail/mojito`, `#cocktails`.
- `src/main.js`: all pages, the router and the interactions (menus, slideshow, forms).
- `src/style.css`: all styles.
- `src/data.js`: the cocktails, and the Coppa Box (`coppaBox`).
- `public/`: copied as-is into `dist/` on build. Includes `.htaccess`, images, product photos, `robots.txt` and `sitemap.xml`.
- **No backend and no payments.** Orders and enquiries open WhatsApp (`wa.me/233540422494`) with a pre-filled message.
- `firebase.json` / `.firebaserc` are left over from Firebase Hosting. Hostinger is the live host.

## Build

```bash
npm install
```

```bash
npm run build
```

`npm install` is only needed the first time, or after `package.json` changes. The build output goes to `dist/`. `dist/` is gitignored: never commit it.

To look at the build locally, run `npx vite preview` and open http://localhost:4173. That preview does **not** apply the `.htaccess` headers.

## Upload to Hostinger

Upload the **contents** of `dist/` into `public_html`. Don't upload the `dist` folder itself.

**Option A: hPanel File Manager**

1. hPanel → Websites → coppacocktailsgh.com → File Manager → `public_html`.
2. Upload everything inside `dist/`. Overwrite when asked.
3. In `public_html/assets`, delete old `index-*.js` and `index-*.css` files that the new `index.html` doesn't reference. The file names change on every build.

**Option B: FTP / SFTP**

- Get the host, user and password from hPanel → Files → FTP Accounts.
- Sync `dist/` → `public_html`.
- **Never put these credentials in the repository.** Keep them in your FTP client, or in an editor config that is gitignored, such as `.vscode/sftp.json`.

**`.htaccess` must be uploaded** (it's a hidden file on a Mac: Cmd + Shift + . in Finder). It:
- forces HTTPS
- turns off folder listings
- sets the security headers, including the Content-Security-Policy

Hostinger's Git deployment on its own is not enough: it copies the repository, but the site must be built first.

## Content-Security-Policy

The CSP is in **two places**, and they must be kept the same:
- `public/.htaccess` (live on Hostinger)
- `firebase.json`

**Adding an external resource:** if you add a new script, font, image host, iframe or payment page, add its domain to the right directive in both files. Otherwise the browser will block it.

**The script hash:** the `sha256-MhtPZX…` hash in `script-src` allows exactly one inline handler, `onload="this.media='all'"` on the Google Fonts link in `index.html`. If that attribute changes, recompute the hash:

```bash
printf "%s" "this.media='all'" | openssl dgst -sha256 -binary | base64
```

## After uploading: checks

Open https://coppacocktailsgh.com in a private window and hard-refresh, then check:

- **Redirect:** `http://coppacocktailsgh.com` redirects to `https://`.
- **Home page:**
  - The hero slideshow has 4 slides; the 4th is the bottle line-up, and the indicator bars move in step.
  - The Coppa Box section shows GH₵950 with "Order a mixed box" and "Choose one flavour" buttons.
  - Hovering a box bottle makes it grow, pop out of the frame and wave.
- **`#box` order page:**
  - Mixed box / Single-flavour box options.
  - Picking a flavour changes the picture (e.g. "Mojito × 6").
  - The total updates with the number of boxes.
  - "Place order via WhatsApp" opens WhatsApp with the order details.
- **`#cocktail/mojito`:** the "Order a full box of Mojito" link opens the box page with Mojito already chosen.
- **On a phone:** the header shows the logo, an Order button and a menu button, and the menu opens full screen.
- **Browser DevTools:**
  - Console: no CSP errors.
  - Network → the document response: `Content-Security-Policy` and `Strict-Transport-Security` headers are present.

## Changing the Coppa Box

Everything is in `coppaBox` at the bottom of `src/data.js`:
- `bottlesPerBox`: bottles in every box (currently 6)
- `options[].price`: price of the mixed and single-flavour boxes in GH₵ (both 950). If they differ, the site shows "From GH₵…".
- `cocktailIds`: the cocktails the mixed box is made from, which are also the flavours on offer for a single-flavour box (currently 7)

After any change: rebuild, then upload again.

## Not done yet (business decisions needed first)

- **Online payment**, e.g. a Paystack payment link. Its domain must be added to the CSP.
- **Delivery:** fees and areas.
- **Prices for single bottles.**
- **Licence:** confirm the alcohol sales licence covers online orders.

## Working rules for this repository

- Keep changes small and limited to what was asked.
- **Committing:**
  - Work on a branch.
  - Commit with a clear message.
  - Fast-forward merge into `main`.
  - Push to `origin`.
- Never commit credentials, `.env` files or `dist/`.
