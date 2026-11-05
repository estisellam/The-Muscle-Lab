import { defineConfig } from "@playwright/test";

export default defineConfig({
    testDir: "./e2e",
    workers: 1,
    timeout: 90000,
    reporter: "list",
    use: {
        baseURL: process.env.E2E_BASE_URL,
        viewport: { width: 1440, height: 1000 },
        launchOptions: process.env.PLAYWRIGHT_CHROME_PATH ? { executablePath: process.env.PLAYWRIGHT_CHROME_PATH } : {}
    }
});
