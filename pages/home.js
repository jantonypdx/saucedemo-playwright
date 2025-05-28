import { expect } from '@playwright/test';
import Base from './components/base.js';
import log from '../lib/utility/logger.js';

// const returnsBoxLink = [
//   'a[href$="/returns"]',
//   'a[href$="/returns-exchanges"]',
//   'a[href$="/retours-et-échanges"]'
// ].join(',');

// const trackMyOrderButton = '.card button';
// const trackMyOrderButtonText = /Track My Order|Suivre ma commande/;
// const startAReturnButton = '.card button';
// const startAReturnButtonText = /Start a Return|Commencer un retour|Commencer/;

export default class Home extends Base {
  /**
   * @param {Object} page
   * @param {Object} context
   * @param {Object} site
   */
  constructor({ page, context, site }) {
    super({ name: 'Home', page, context, site });
  }

  /**
   * Goto to the site's home page
   */
  async goto() {
    log.info(`Home.goto() - goto homepage`);
    log.debug(`Home.goto() - goto: ${this.site}`);
    await this.page.goto(this.site, { timeout: 30000 });
  }

  /**
   * Try to login with username & password
   * @param {*} username
   * @param {*} password
   */
  async login(username, password) {
    log.info(
      `Home.login() - username: '${username}', password: '${password.replaceAll(/./g, '*')}'`
    );

    const usernameField = this.page.locator('[data-test="username"]');
    const passwordField = this.page.locator('[data-test="password"]');
    const loginButton = this.page.locator('[data-test="login-button"]');

    await usernameField.waitFor();
    await usernameField.click();
    await usernameField.fill(username);

    await passwordField.click();
    await passwordField.fill(password);

    await loginButton.click();
    await this.page.waitForURL('**/inventory.html', { timeout: 5000 });
  }
}
