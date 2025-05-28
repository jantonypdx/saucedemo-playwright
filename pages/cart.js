import { expect } from '@playwright/test';
import Base from './components/base.js';
import log from '../lib/utility/logger.js';

const pageURL = /\/cart.html/;

export default class Cart extends Base {
  /**
   * @param {Object} page
   * @param {Object} context
   * @param {Object} site
   */
  constructor({ page, context, site }) {
    super({ name: 'Cart', page, context, site });
  }

  /**
   * verify user is on Cart page
   */
  async verifyOnPage() {
    log.info(`Cart.verifyOnPage()`);
    await expect(this.page).toHaveURL(pageURL);
  }

  /**
   * click Checkout button
   */
  async clickCheckout() {
    log.info(`Cart.clickCheckout()`);

    await this.page
      .getByRole('button', {
        name: /checkout/i
      })
      .click();
  }
}
