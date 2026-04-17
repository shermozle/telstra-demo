import { test, expect } from "@playwright/test";

test.describe("Telstra demo smoke", () => {
  test("homepage renders and links to mobile catalog", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /Australia/i })).toBeVisible();
    await page.getByRole("link", { name: "Shop mobiles" }).click();
    await expect(page).toHaveURL(/mobiles-on-a-plan/);
  });

  test("device catalog shows filters and products", async ({ page }) => {
    await page.goto("/mobile-phones/mobiles-on-a-plan");
    await expect(page.getByRole("heading", { name: /Mobiles on a plan/i })).toBeVisible();
    await expect(page.getByText(/iPhone 17 Pro Max/i)).toBeVisible();
  });

  test("login flow reaches My Telstra", async ({ page }) => {
    await page.goto("/login");
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page).toHaveURL(/my-telstra/);
  });

  test("checkout shows empty state without cart", async ({ page }) => {
    await page.goto("/shop/checkout");
    await expect(page.getByText(/cart is empty/i)).toBeVisible();
  });
});
