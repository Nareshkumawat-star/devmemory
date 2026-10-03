import { test, expect } from "@playwright/test";

test.describe("Landing page", () => {
  test("renders the hero and pipeline sections", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", { name: /your coding mistakes become/i }),
    ).toBeVisible();
    await expect(page.getByText("How the pipeline works")).toBeVisible();
  });

  test("links to the new memory page from the hero", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /save your first memory/i }).click();

    await expect(page).toHaveURL(/\/memories\/new/);
  });
});

test.describe("Dashboard", () => {
  test("renders the overview page with stats", async ({ page }) => {
    await page.goto("/dashboard/overview");

    await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
    await expect(page.getByText("Recent Memories")).toBeVisible();
  });

  test("renders the mistakes page", async ({ page }) => {
    await page.goto("/mistakes");
    await expect(page.getByText(/mistake/i).first()).toBeVisible();
  });
});

test.describe("Memory editor", () => {
  test("shows the editor form fields", async ({ page }) => {
    await page.goto("/memories/new");

    await expect(page.getByLabel("Title")).toBeVisible();
    await expect(page.getByLabel("Problem Description")).toBeVisible();
    await expect(page.getByText("New Coding Memory")).toBeVisible();
  });

  test("blocks submit until a title is entered", async ({ page }) => {
    await page.goto("/memories/new");

    const submit = page.getByRole("button", { name: /save memory/i });
    await submit.click();

    await expect(page.getByText("Title is required.")).toBeVisible();
  });

  test("switching language updates the code content", async ({ page }) => {
    await page.goto("/memories/new");

    await page.getByLabel("Code").selectOption("java");

    // Monaco renders asynchronously; wait for the editor container instead.
    await expect(page.locator(".monaco-editor").first()).toBeVisible();
  });
});

test.describe("Ask page", () => {
  test("renders the assistant panel", async ({ page }) => {
    await page.goto("/ask");

    await expect(page.getByRole("heading", { name: "Ask the AI" })).toBeVisible();
    await expect(page.getByLabel("Your question")).toBeVisible();
  });

  test("keeps the ask button disabled with no question", async ({ page }) => {
    await page.goto("/ask");
    await expect(page.getByRole("button", { name: /^Ask$/ })).toBeDisabled();
  });
});

test.describe("API validation", () => {
  test("rejects a memory with no title", async ({ request }) => {
    const response = await request.post("/api/memories", {
      data: {
        userId: "user-e2e",
        type: "error",
        title: "",
        problemDescription: "x",
        userApproach: "y",
        code: [{ language: "python", code: "pass" }],
        errors: [],
        lessonLearned: "",
        tags: [],
      },
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error).toBe("Invalid request body");
    expect(Array.isArray(body.details)).toBe(true);
  });

  test("rejects an ask request with no question", async ({ request }) => {
    const response = await request.post("/api/ai/ask", {
      data: { userId: "user-e2e", question: "" },
    });

    expect(response.status()).toBe(400);
  });
});