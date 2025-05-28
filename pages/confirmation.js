import { expect } from '@playwright/test';
import Base from './components/base.js';
import log from '../lib/utility/logger.js';

const pageURL = /\/checkout-complete.html/;

export default class Confirmation extends Base {
  /**
   * @param {Object} page
   * @param {Object} context
   * @param {Object} site
   */
  constructor({ page, context, site }) {
    super({ name: 'Confirmation', page, context, site });
  }

  /**
   * verify user is on Confirmation page
   */
  async verifyOnPage() {
    log.info(`Confirmation.verifyOnPage()`);
    await expect(this.page).toHaveURL(pageURL);
  }

  /**
   * click Back Home button
   */
  async clickBackHome() {
    log.info(`Confirmation.clickBackHome()`);
    await this.page
      .getByRole('button', {
        name: /back home/i
      })
      .click();
  }
}
