import { expect } from '@playwright/test';

import log from '../../lib/utility/logger.js';

const footerMethods = {
  /**
   * Click Twitter icon
   */
  async clickTwitter() {
    log.info(`Footer.clickTwitter()`);
    await this.page.locator('[data-test="social-twitter"]').click();
  },

  /**
   * Click Facebook icon
   */
  async clickFacebook() {
    log.info(`Footer.clickFacebook()`);
    await this.page.locator('[data-test="social-facebook"]').click();
  },

  /**
   * Click LinkedIn icon
   */
  async clickLinkedIn() {
    log.info(`Footer.clickLinkedIn()`);
    await this.page.locator('[data-test="social-linkedin"]').click();
  }
};

export default footerMethods;
