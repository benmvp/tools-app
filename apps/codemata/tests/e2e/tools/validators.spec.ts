import { expect, test } from "@playwright/test";

/**
 * Validator Tool Tests
 * Tests JSON Validator (complex validation UX) and URL Validator (metadata parsing)
 * Runs on both desktop and mobile
 *
 * Per sample-based testing strategy:
 * - Tests TWO representative validators to validate server action integration
 * - JSON Validator: Complex UX (error clicking, schema validation, collapsible UI)
 * - URL Validator: Metadata parsing and display
 * - Component behavior tested in tests/e2e/components/transformer-validator.spec.ts
 * - All validators use same page template, so testing these validates all
 */

// Test data constants
const TEST_JSON = {
  INVALID_TRAILING_COMMA: `{
  "name": "Test",
  "value": 123,
}`,
  VALID_PERSON: `{
  "name": "John Doe",
  "email": "john@example.com",
  "age": 30
}`,
  MISSING_REQUIRED_FIELD: `{
  "name": "John Doe",
  "age": 30
}`,
  VALID_SIMPLE: `{
  "name": "Test",
  "value": 123
}`,
  INVALID_SIMPLE: `{"test": 123,}`,
  VALID_FIXED: `{"test": 123}`,
};

const TEST_SCHEMA = {
  PERSON_REQUIRED_EMAIL: `{
  "type": "object",
  "required": ["name", "email"],
  "properties": {
    "name": {"type": "string"},
    "email": {"type": "string"},
    "age": {"type": "number"}
  }
}`,
};

const TEST_URLS = {
  VALID_MULTIPLE: `https://example.com
http://localhost:3000
https://api.github.com/users`,
  MIXED_VALID_INVALID: `https://example.com
example.com
not a url at all`,
  WITH_METADATA: "https://example.com:8080/api/users?page=1&sort=name#results",
};

test.describe("JSON Validator", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/validators/json-validator");
    await page.waitForLoadState("networkidle");
  });

  test("displays syntax errors with line numbers", async ({ page }) => {
    const inputEditor = page.locator(".cm-content").first();
    await expect(inputEditor).toBeVisible();

    // Enter invalid JSON (trailing comma)
    await inputEditor.click();
    await inputEditor.fill(TEST_JSON.INVALID_TRAILING_COMMA);

    // Click validate button
    const validateButton = page.locator('button:has-text("Validate JSON")');
    await validateButton.click();

    // Wait for error results (ValidationResults component shows "1 Error")
    const errorSummary = page.locator("text=/1 Error[^s]/i");
    await expect(errorSummary).toBeVisible({ timeout: 10000 });

    // Verify error shows line number (use .first() to avoid strict mode violation)
    const errorMessage = page.locator("text=/Line 4/i").first();
    await expect(errorMessage).toBeVisible();
  });

  test("clicking error scrolls to line in editor", async ({ page }) => {
    const inputEditor = page.locator(".cm-content").first();
    await expect(inputEditor).toBeVisible();

    // Enter invalid JSON with error on specific line
    await inputEditor.click();
    await inputEditor.fill(TEST_JSON.INVALID_TRAILING_COMMA);

    // Click validate button
    const validateButton = page.locator('button:has-text("Validate JSON")');
    await validateButton.click();

    // Wait for error to appear (ErrorItem button in ValidationResults)
    const errorItem = page
      .locator('button[aria-label*="Error at line"]')
      .first();
    await expect(errorItem).toBeVisible({ timeout: 10000 });

    // Click the error
    await errorItem.click();

    // Verify editor has focus (indicates scroll happened)
    await expect(inputEditor).toBeFocused();
  });

  test("validates against JSON Schema successfully", async ({ page }) => {
    const inputEditor = page.locator(".cm-content").first();
    await expect(inputEditor).toBeVisible();

    // Expand schema section
    const schemaToggle = page.locator(
      'button:has-text("Advanced: Validate Against JSON Schema")',
    );
    await schemaToggle.click();

    // Wait for schema editor to be visible
    const schemaEditor = page.locator(".cm-content").nth(1);
    await expect(schemaEditor).toBeVisible();

    // Enter valid JSON
    await inputEditor.click();
    await inputEditor.fill(TEST_JSON.VALID_PERSON);

    // Enter schema
    await schemaEditor.click();
    await schemaEditor.fill(TEST_SCHEMA.PERSON_REQUIRED_EMAIL);

    // Click validate button
    const validateButton = page.locator('button:has-text("Validate JSON")');
    await validateButton.click();

    // Wait for success message (ValidationSuccess component shows "Looking good!")
    const successMessage = page.locator("text=/Looking good!/i");
    await expect(successMessage).toBeVisible({ timeout: 10000 });
  });

  test("shows schema validation errors", async ({ page }) => {
    const inputEditor = page.locator(".cm-content").first();
    await expect(inputEditor).toBeVisible();

    // Expand schema section
    const schemaToggle = page.locator(
      'button:has-text("Advanced: Validate Against JSON Schema")',
    );
    await schemaToggle.click();

    // Wait for schema editor to be visible
    const schemaEditor = page.locator(".cm-content").nth(1);
    await expect(schemaEditor).toBeVisible();

    // Enter JSON missing required field
    await inputEditor.click();
    await inputEditor.fill(TEST_JSON.MISSING_REQUIRED_FIELD);

    // Enter schema requiring email
    await schemaEditor.click();
    await schemaEditor.fill(TEST_SCHEMA.PERSON_REQUIRED_EMAIL);

    // Click validate button
    const validateButton = page.locator('button:has-text("Validate JSON")');
    await validateButton.click();

    // Wait for error about missing required property
    const errorMessage = page.locator("text=/required property/i");
    await expect(errorMessage).toBeVisible({ timeout: 10000 });
  });

  test("shows success state for valid JSON", async ({ page }) => {
    const inputEditor = page.locator(".cm-content").first();
    await expect(inputEditor).toBeVisible();

    // Enter valid JSON
    await inputEditor.click();
    await inputEditor.fill(TEST_JSON.VALID_SIMPLE);

    // Click validate button
    const validateButton = page.locator('button:has-text("Validate JSON")');
    await validateButton.click();

    // Wait for success indicator (CheckCircle2 icon in ValidationSuccess)
    const successIcon = page.getByRole("heading", { name: /Looking good!/i });
    await expect(successIcon).toBeVisible({ timeout: 10000 });

    // Verify success message text ("Your JSON is valid" for JSON validator)
    const successText = page.locator("text=/Your JSON is valid/i");
    await expect(successText).toBeVisible();
  });

  test("clears validation results when input changes", async ({ page }) => {
    const inputEditor = page.locator(".cm-content").first();
    await expect(inputEditor).toBeVisible();

    // Enter invalid JSON and validate
    await inputEditor.click();
    await inputEditor.fill(TEST_JSON.INVALID_SIMPLE);

    const validateButton = page.locator('button:has-text("Validate JSON")');
    await validateButton.click();

    // Wait for error to appear (ValidationResults shows "1 Error")
    await expect(page.locator("text=/1 Error[^s]/i")).toBeVisible({
      timeout: 10000,
    });

    // Clear and enter valid JSON using fill() which is more reliable than keyboard shortcuts
    await inputEditor.click();
    await inputEditor.fill(TEST_JSON.VALID_FIXED);

    // Wait for validate button to be enabled
    await expect(validateButton).toBeEnabled({ timeout: 5000 });

    // Click validate again
    await validateButton.click();

    // Should show success now (previous errors cleared)
    await expect(page.locator("text=/Looking good!/i")).toBeVisible({
      timeout: 10000,
    });
  });
});

test.describe("URL Validator", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/validators/url-validator");
    await page.waitForLoadState("networkidle");
  });

  test("validates multiple URLs successfully", async ({ page }) => {
    const inputEditor = page.locator(".cm-content").first();
    await expect(inputEditor).toBeVisible();

    // Enter multiple valid URLs
    await inputEditor.click();
    await inputEditor.fill(TEST_URLS.VALID_MULTIPLE);

    // Click validate button
    const validateButton = page.locator('button:has-text("Validate URLs")');
    await validateButton.click();

    // Wait for success message
    const successText = page.locator("text=/All 3 URLs are valid/i");
    await expect(successText).toBeVisible({ timeout: 10000 });
  });

  test("displays errors for invalid URLs", async ({ page }) => {
    const inputEditor = page.locator(".cm-content").first();
    await expect(inputEditor).toBeVisible();

    // Enter mix of valid and invalid URLs
    await inputEditor.click();
    await inputEditor.fill(TEST_URLS.MIXED_VALID_INVALID);

    // Click validate button
    const validateButton = page.locator('button:has-text("Validate URLs")');
    await validateButton.click();

    // Wait for error summary
    const errorSummary = page.locator("text=/2 errors found, 1 URL valid/i");
    await expect(errorSummary).toBeVisible({ timeout: 10000 });

    // Verify error messages are shown
    const errorHeading = page.locator('h3:has-text("Errors (2)")');
    await expect(errorHeading).toBeVisible();

    // Verify at least one error mentions missing protocol (use .first() to avoid strict mode)
    const errorMessage = page.locator("text=/Missing protocol/i").first();
    await expect(errorMessage).toBeVisible();
  });

  test("expands and shows URL metadata", async ({ page }) => {
    const inputEditor = page.locator(".cm-content").first();
    await expect(inputEditor).toBeVisible();

    // Enter URL with metadata
    await inputEditor.click();
    await inputEditor.fill(TEST_URLS.WITH_METADATA);

    // Click validate button
    const validateButton = page.locator('button:has-text("Validate URLs")');
    await validateButton.click();

    // Wait for valid URLs section
    await expect(page.locator('h3:has-text("Valid URLs (1)")')).toBeVisible({
      timeout: 10000,
    });

    // Find and click the URL card to expand
    const urlCard = page
      .locator("button")
      .filter({ hasText: "Line 1" })
      .first();
    await expect(urlCard).toBeVisible();
    await urlCard.click();

    // Verify metadata is displayed
    await expect(page.locator("text=/Protocol.*https:/i")).toBeVisible();
    await expect(page.locator("text=/Hostname.*example.com/i")).toBeVisible();
    await expect(page.locator("text=/Port.*8080/i")).toBeVisible();
    await expect(page.locator("text=/Path.*/api/users/i")).toBeVisible();
    await expect(page.locator("text=/Hash/i")).toBeVisible();
    // Hash value appears after "Hash:" label, check it exists in metadata section
    await expect(
      page
        .locator("div")
        .filter({ hasText: /^Hash:/ })
        .locator("text=results"),
    ).toBeVisible();

    // Verify query params table
    const queryParamsSection = page.locator("text=/Query Parameters/i");
    await expect(queryParamsSection).toBeVisible();
    // Check query param keys exist in the table (avoid URL text matches)
    await expect(page.locator('span.font-mono:has-text("page")')).toBeVisible();
    await expect(page.locator('span.font-mono:has-text("sort")')).toBeVisible();
  });
});
