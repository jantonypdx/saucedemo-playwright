import { expect } from '@playwright/test';
import Base from './components/base.js';
import log from '../lib/utility/logger.js';

const pageURL = /\/inventory.html/;

export default class Inventory extends Base {
  /**
   * @param {Object} page
   * @param {Object} context
   * @param {Object} site
   */
  constructor({ page, context, site }) {
    super({ name: 'Inventory', page, context, site });
  }

  /**
   * verify user is on Inventory page
   */
  async verifyOnPage() {
    log.info(`Inventory.verifyOnPage()`);
    await expect(this.page).toHaveURL(pageURL);
  }

  /**
   * Get the number of items on the inventory page
   * @returns integer - item count on page
   */
  async getItemCount() {
    log.info(`Inventory.getItemCount()`);
    const count = await this.page.locator('div.inventory_item').count();
    log.verbose(`Inventory.getItemCount - count: ${count}`);
    return count;
  }

  /**
   * Add a random product on the page to Cart
   */
  async addRandomProductToCart() {
    log.info(`Inventory.addRandomProductToCart()`);
    const originalMiniCartQuantity = await this.getMiniCartQuantity();

    const count = await this.getItemCount();
    const randomIndex = Math.floor(Math.random() * count);

    // click corresponding 'add to cart' button
    await this.page
      .getByRole('button', {
        name: /add to cart/i
      })
      .nth(randomIndex)
      .click();

    // confirm that one new product has been added to the Cart
    const newMiniCartQuantity = await this.getMiniCartQuantity();
    expect(newMiniCartQuantity - originalMiniCartQuantity).toEqual(1);
  }
}
