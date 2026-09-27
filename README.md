# Wallet

A private spending tracker for your phone — cards, limits, monthly bills, insights. English and Hebrew.
All data stays on the phone. Nothing is uploaded.

## Get the app

**Install from a link (recommended)**
Open https://probro321.github.io/App/ in Chrome → menu (⋮) → **Install app**.
Updates arrive automatically.

**APK file (to send on WhatsApp)**
https://github.com/ProBro321/App/releases/latest/download/Wallet.apk
Open it on the phone and allow "Install unknown apps" when asked. To update, install the newer file over the old one — data is kept.

## Move your data between phones or versions

Settings → **Export backup file** on the old one, then **Restore from a backup file** (first screen) or Settings → **Import backup file** on the new one.

## How it's built

- `web/` — the whole app (one HTML file), offline copy (`sw.js`), icons and install manifest. Published by `.github/workflows/pages.yml`.
- `android/` — a small Android app that runs `web/index.html` with no internet permission. Built by `.github/workflows/android.yml` on every push and published to the `latest` release.
- `android/wallet.keystore` is a fixed signing key so updates install over older versions. It's committed on purpose for this family app; anyone with it could sign an app that looks like an update, so don't reuse it for anything that matters.
