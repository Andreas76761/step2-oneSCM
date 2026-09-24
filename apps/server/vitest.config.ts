import { defineConfig } from 'vitest/config';
// Mit PostgreSQL teilen sich alle Testdateien eine Datenbank → nacheinander ausführen.
export default defineConfig({ test: { include: ['test/**/*.test.ts'], testTimeout: 30000, pool: 'forks', fileParallelism: !process.env.TEST_DATABASE_URL } });
