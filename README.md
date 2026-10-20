# Pura Taman Ayun — Mengwi, Bali

Panduan berbahasa Indonesia dengan halaman privasi, ketentuan dan pengaturan kuki untuk Pura Taman Ayun, dibangun khusus dengan Astro + Tailwind CSS + TypeScript dan ditujukan untuk deployment sebagai Cloudflare Worker static assets.

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
const SITE = 'https://tamanayunbali.com';
```

`SITE` saat ini sudah berisi origin produksi (tamanayunbali.com), sehingga build menerbitkan:

- canonical + Open Graph URL absolut (`https://tamanayunbali.com/`);
- hreflang `id` dan `x-default`;
- URL absolut pada JSON-LD (`TouristAttraction` / `FAQPage`);
- sitemap otomatis (`sitemap-index.xml`) yang diacu oleh `public/robots.txt`.

Bila domain berganti, cukup ubah nilai `SITE` lalu build ulang.

## Peta

Google Maps ditanam dengan `hl=id&region=ID`, sesuai bahasa lokal Indonesia. Tombol arah memakai short link yang diberikan untuk lokasi.

## Foto

Semua foto destinasi berada di `public/images/` dalam format WebP dan tidak di-hotlink. Kredit foto dan lisensi CC BY-SA 4.0 ditampilkan pada halaman.

## GA4

Measurement ID: `G-HXM22WWPKP`. Skrip hanya dimuat setelah pilihan eksplisit pada banner atau `/cookies/`. Penyimpanan yang diblokir tidak dianggap sebagai izin dan penolakan segera menonaktifkan pengukuran berikutnya.

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

## Sumber dan batas operasional

Catatan sejarah Badung (1634) dan ringkasan UNESCO (abad ke-18) ditampilkan dengan atribusi terpisah; tidak dianggap sebagai penanggalan yang sama untuk semua bangunan. Taman Ayun adalah komponen Lanskap Budaya Bali yang dicatat UNESCO pada 2012. Harga tiket, akses halaman suci dan peminjaman busana belum terverifikasi. Maps diperiksa 19 Oktober 2026: 08.00–18.15 setiap hari, 4,6 dari 10.152 ulasan; cuplikan ini bukan jaminan akses atau layanan saat ini.

Root Worker menormalkan HTTP/www ke HTTPS domain utama, memakai binding ASSETS dan mempertahankan 404/noindex. Aturan sumber URL absolut di `_redirects` telah diganti dengan Worker. Project `tamanayunbali` dipetakan dari check resmi Cloudflare pada base commit.
