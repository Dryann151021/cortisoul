import { Pool } from 'pg';

// database configuration
/* eslint-disable */
// 1. Secara bawaan, isi dengan konfigurasi lokal
let poolConfig = {
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
};

// 2. Jika DATABASE_URL ada (di Vercel), timpa total variabel di atas
if (process.env.DATABASE_URL) {
  poolConfig = {
    connectionString: process.env.DATABASE_URL,
    max: 1,
    idleTimeoutMillis: 10000,
  };
}

const pool = new Pool(poolConfig);

pool.on('error', (err) => {
  console.error('Unexpected error on idle database client', err);
});

export default pool;
