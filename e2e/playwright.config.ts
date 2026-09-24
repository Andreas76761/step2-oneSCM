import { defineConfig } from '@playwright/test';

const PORT = 3200;
const DATA = './.e2e-data';
const chromium = process.env.PLAYWRIGHT_CHROMIUM_PATH;

export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  fullyParallel: false,
  workers: 1,
  reporter: [['list']],
  use: {
    baseURL: `http://localhost:${PORT}`,
    viewport: { width: 1440, height: 900 },
    trace: 'retain-on-failure',
    ...(chromium ? { launchOptions: { executablePath: chromium } } : {}),
  },
  webServer: {
    // Frische Demo-Datenbank, danach gebauten Server (inkl. Web-UI) starten
    command: `rm -rf ${DATA} && DATA_DIR=${DATA} npx tsx ../apps/server/scripts/seed-demo.ts && DATA_DIR=${DATA} PORT=${PORT} LOG=0 node ../apps/server/dist/index.js`,
    url: `http://localhost:${PORT}/api/v1/health`,
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
