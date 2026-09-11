import { defineConfig } from '@playwright/test'

const url = 'http://127.0.0.1:5173/'

export default defineConfig({
  testDir: 'e2e',
  timeout: 60_000,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: url,
    viewport: { width: 1280, height: 720 },
    // locally use the installed Chrome, in CI the downloaded chromium
    channel: process.env.CI ? undefined : 'chrome',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run dev -w demo -- --host 127.0.0.1 --port 5173 --strictPort',
    url,
    reuseExistingServer: !process.env.CI,
  },
})
