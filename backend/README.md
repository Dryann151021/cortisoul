# Cortisoul Backend

REST API untuk aplikasi **Cortisoul**, yaitu layanan backend berbasis Node.js.

## Teknologi

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Joi](https://joi.dev/)
- [JSON Web Token](https://jwt.io/)
- [Swagger UI](https://swagger.io/tools/swagger-ui/)

## Prasyarat

- Node.js 18+
- [pnpm](https://pnpm.io/) 10+
- Instance PostgreSQL

## Instalasi

```bash
cd backend
pnpm install
```

## Konfigurasi lingkungan

Salin ke file `.env` di root folder `backend`

```env
# Server
HOST=localhost
PORT=3000

# Database
PGUSER=[your-postgre-user]
PGHOST=[your-postgre-host]
PGPASSWORD=[your-postgre-pass]
PGDATABASE=[your-postgre-database]
PGPORT=5432

DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DATABASE

# JWT (gunakan string acak yang kuat)
ACCESS_TOKEN_KEY=your-access-token-secret
REFRESH_TOKEN_KEY=your-refresh-token-secret
```

| Variabel            | Keterangan                                                                   |
| ------------------- | ---------------------------------------------------------------------------- |
| `HOST`              | Host yang dipakai Swagger untuk URL server (mis. `localhost` atau `0.0.0.0`) |
| `PORT`              | Port HTTP server                                                             |
| `DATABASE_URL`      | Connection string PostgreSQL                                                 |
| `ACCESS_TOKEN_KEY`  | Secret untuk menandatangani & memverifikasi access token                     |
| `REFRESH_TOKEN_KEY` | Secret untuk refresh token                                                   |

## Database

Jalankan migrasi setelah `DATABASE_URL` tersedia:

```bash
pnpm migrate up
```

Migrasi yang tersedia:

- `users` — akun pengguna
- `authentications` — refresh token aktif
- `journals` — entri jurnal (terhubung ke `users` via `owner`)

### Data contoh (opsional)

```bash
pnpm seed
```

Script `seed-data.js` mengisi pengguna dan jurnal dummy untuk pengujian lokal.

## Menjalankan server

| Perintah          | Deskripsi                                         |
| ----------------- | ------------------------------------------------- |
| `pnpm start:dev`  | Development dengan [nodemon](https://nodemon.io/) |
| `pnpm start:prod` | Production (`NODE_ENV=production`)                |
| `pnpm lint`       | Cek kode dengan ESLint                            |

Setelah server berjalan, buka:

- **API:** `http://localhost:3000` (sesuai `PORT`)
- **Dokumentasi Swagger:** `http://localhost:3000/api-docs`

## Lisensi

ISC — lihat `package.json`.

## Author

Adriyan
