import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    out: './src/db/migrations',
    schema: './src/db/schema.ts',
    dialect: 'postgresql',
    dbCredentials: {
        url: 'postgres://postgres:postgres@localhost:5432/chirpy?sslmode=disable',
    },
});