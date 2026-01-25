import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright configuration for Codemata E2E tests
 *
 * Test Environment:
 * - Production build with DISABLE_AI=true (fast builds, no API costs)
 * - Firefox browser (user manually tests Chrome)
 * - Local: Headed mode with --ui flag for debugging
 * - CI: Headless mode
 *
 * Test Coverage:
 * - Navigation (sidebar, command menu, category pages)
 * - Mobile responsive behavior
 * - Accessibility compliance (separate a11y tests)
 * - SEO metadata validation
 */

// Use production server on port 3333
const BASE_URL = process.env.BASE_URL || "http://localhost:3333";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0, // No retries - catch flakiness early
  // HTML report: CI opens always, locally only on success (prevents hanging prompt)
  reporter: process.env.CI
    ? [["html"], ["github"]]
    : [["html", { open: "never" }], ["list"]],

  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },

  projects: [
    {
      name: "firefox-desktop",
      use: {
        ...devices["Desktop Firefox"],
        viewport: { width: 1280, height: 720 },
      },
      testIgnore: /mobile\.spec\.ts$/, // Skip mobile-only tests
    },
    {
      name: "iphone-13",
      use: {
        ...devices["iPhone 13"],
        // iPhone 13 viewport: 390×844 (iOS Safari)
      },
      testIgnore: [
        /a11y-keyboard\.spec\.ts$/, // Skip keyboard tests on touchscreen
        /a11y-screen-reader\.spec\.ts$/, // Skip screen reader tests (different on mobile)
        /navigation-desktop\.spec\.ts$/, // Skip desktop-only navigation tests
        /components\/.*\.spec\.ts$/, // Skip component tests (device-independent behavior)
      ],
    },
  ],

  // Web server configuration
  // CI: Playwright starts server (no reuse)
  // Local: Reuse existing server if available (faster dev loop)
  webServer: {
    command: "pnpm start",
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
