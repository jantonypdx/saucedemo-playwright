import { expect } from '@playwright/test';
import Base from './components/base.js';
import log from '../lib/utility/logger.js';

const pageURL = /\/checkout-step/;

export default class Checkout extends Base {
  /**
   * @param {Object} page
   * @param {Object} context
   * @param {Object} site
   */
  constructor({ page, context, site }) {
    super({ name: 'Checkout', page, context, site });
  }

  /**
   * verify user is on Checkout page
   */
  async verifyOnPage() {
    log.info(`Checkout.verifyOnPage()`);
    await expect(this.page).toHaveURL(pageURL);
  }

  /**
   * click Checkout button
   */
  async fillInformation(firstName, lastName, postalCode) {
    log.info(
      `Checkout.fillInformation() - firstname: '${firstName}', ` +
        `lastname: '${lastName}', postalcode: '${postalCode}'`
    );

    const firstNameField = this.page.locator('input#first-name');
    const lastNameField = this.page.locator('input#last-name');
    const postalCodeField = this.page.locator('input#postal-code');

    await firstNameField.waitFor();
    await firstNameField.click();
    await firstNameField.clear();
    await firstNameField.fill(firstName);

    await lastNameField.click();
    await lastNameField.clear();
    await lastNameField.fill(lastName);

    await postalCodeField.click();
    await postalCodeField.clear();
    await postalCodeField.fill(postalCode);
  }

  /**
   * click Continue button
   */
  async clickContinue() {
    log.info(`Checkout.clickContinue()`);
    await this.page
      .getByRole('button', {
        name: /continue/i
      })
      .click();
  }

  /**
   * click Finish button
   */
  async clickFinish() {
    log.info(`Checkout.clickFinish()`);
    await this.page
      .getByRole('button', {
        name: /finish/i
      })
      .click();
  }
}
