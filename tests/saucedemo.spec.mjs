import test, { expect } from '@playwright/test';
import AllPages from '../pages/allPages.js';

const buildUrl =
  process.env.CIRCLE_BUILD_URL || process.env.BUILD_URL || 'unknown';
const site = process.env.SITE || 'https://www.saucedemo.com/';

test.describe.configure({ mode: 'parallel' });

test.describe('SomeCompany.SomeProject.SauceDemo', () => {
  // ------------------------------------------------------------------------------------
  // test that a user can login to website
  // to run: LOGLEVEL=verbose npx playwright test saucedemo.spec.mjs --grep="TEST-001" --project=chromium
  // ------------------------------------------------------------------------------------
  test(`user can login to website (TEST-001)`, async ({ page, context }) => {
    const pom = new AllPages({ page, context, site });

    await test.step('1. Navigate to site home page', async () => {
      await pom.home.goto();
    });

    await test.step('2. Login a valid user', async () => {
      const username = process.env.STANDARD_USERNAME || '';
      const password = process.env.LOGIN_PASSWORD || '';
      await pom.home.login(username, password);
    });

    await test.step('3. Confirm we are on Inventory page with products', async () => {
      await pom.inventory.verifyOnPage();
    });
  });

  // ------------------------------------------------------------------------------------
  // test that a user can order a random item
  // to run: LOGLEVEL=verbose npx playwright test saucedemo.spec.mjs --grep="TEST-002" --project=chromium
  // ------------------------------------------------------------------------------------
  test(`user can order a random item (TEST-002)`, async ({ page, context }) => {
    const pom = new AllPages({ page, context, site });

    await test.step('1. Navigate to site home page', async () => {
      await pom.home.goto();
    });

    await test.step('2. Login a valid user', async () => {
      const username = process.env.STANDARD_USERNAME || '';
      const password = process.env.LOGIN_PASSWORD || '';
      await pom.home.login(username, password);
    });

    await test.step('3. Confirm we are on Inventory page with products', async () => {
      await pom.inventory.verifyOnPage();
      const count = await pom.inventory.getItemCount();
      expect(count).toBeGreaterThan(0);
    });

    await test.step('4. Add a random product to Cart', async () => {
      await pom.inventory.addRandomProductToCart();
    });

    await test.step('5. Go to Cart', async () => {
      await pom.inventory.clickMiniCart();
    });

    await test.step('6. Go to Checkout', async () => {
      await pom.cart.verifyOnPage();
      await pom.cart.clickCheckout();
    });

    await test.step('7. Fill out Checkout information and place order', async () => {
      const firstName = 'Joe';
      const lastName = 'Smith';
      const postalCode = '97209';

      await pom.checkout.verifyOnPage();
      await pom.checkout.fillInformation(firstName, lastName, postalCode);
      await pom.checkout.clickContinue();
      await pom.checkout.clickFinish();
    });

    await test.step('8. Verify Confirmation', async () => {
      await pom.confirmation.verifyOnPage();
    });
  });
});
