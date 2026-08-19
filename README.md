# Pura Taman Ayun — Mengwi, Bali

Situs satu halaman berbahasa Indonesia untuk Pura Taman Ayun, dibangun khusus dengan Astro + Tailwind CSS + TypeScript dan ditujukan untuk deployment sebagai Cloudflare Worker static assets.

## Versi terkunci

- Node.js 24.19.0
- pnpm 11.22.0
- Astro 7.2.3
- Tailwind CSS 4.3.3
- TypeScript 6.0.3
- @astrojs/check 0.9.10
- @astrojs/sitemap 3.7.3
- Wrangler 4.123.0

Semua versi di `package.json` bersifat exact, tanpa `latest`, `*`, `^`, atau `~`.

## Menjalankan lokal

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm check
pnpm dev
```

Build produksi:

```bash
pnpm build
```

Deploy ke Cloudflare Workers:

```bash
pnpm deploy
```

Konfigurasi `wrangler.jsonc` menggunakan Static Assets Workers dan direktori `./dist`.

## Mengisi domain

Domain hanya diatur di **satu tempat**: konstanta `SITE` di `astro.config.mjs`.

```js
const SITE = '';
```

Biarkan kosong jika domain belum ditetapkan. Dalam keadaan ini:

- build tetap berjalan;
- canonical / Open Graph URL absolut tidak diterbitkan;
- URL pada JSON-LD hanya ditambahkan jika `Astro.site` tersedia;
- integrasi sitemap tidak dijalankan, sehingga tidak ada URL placeholder.

Setelah domain tersedia, isi `SITE` dengan origin produksi lalu build ulang. `@astrojs/sitemap` akan menghasilkan sitemap otomatis.

## Peta

Google Maps ditanam dengan `hl=id&region=ID`, sesuai bahasa lokal Indonesia. Tombol arah memakai short link yang diberikan untuk lokasi.

## Foto

Semua foto destinasi berada di `public/images/` dalam format WebP dan tidak di-hotlink. Kredit foto dan lisensi CC BY-SA 4.0 ditampilkan pada halaman.

## GA4

Measurement ID: `G-HXM22WWPKP`.

## Pemeriksaan pengiriman

Jalankan dari kondisi bersih:

```bash
rm -rf node_modules dist .astro
CI=1 corepack pnpm install --frozen-lockfile
pnpm check
pnpm build
```

Lalu periksa placeholder/skrip ilegal:

```bash
! grep -RInE 'example\\.com|localhost|chrome-extension://' dist
```

Jika `SITE` masih kosong, sitemap memang tidak dibuat. Jika `SITE` sudah berisi domain produksi, periksa `dist/sitemap-*.xml` dan pastikan hanya URL domain produksi yang muncul serta tidak ada `lastmod` buatan.
