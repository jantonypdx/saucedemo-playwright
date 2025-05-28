import log from '../../lib/utility/logger.js';

const miniCartMethods = {
  /**
   * Click the mini cart icon
   */
  async clickMiniCart() {
    log.info(`MiniCart.clickMiniCart()`);
    await this.page.locator('a.shopping_cart_link').click();
  },

  /**
   * Get MiniCart quantity value
   * @returns integer - minicart quantity
   */
  async getMiniCartQuantity() {
    let quantity = 0;
    log.info(`MiniCart.getMiniCartQuantity()`);

    const shoppingCartBadge = this.page.locator('span.shopping_cart_badge');
    if (await shoppingCartBadge.isVisible({ timeout: 3000 })) {
      const quantityText = await shoppingCartBadge.innerText();
      if (quantityText && quantityText.length > 0) {
        quantity = parseInt(quantityText, 10);
      }
    }
    log.verbose(`MiniCart.getMiniCartQuantity() - returning: ${quantity}`);
    return quantity;
  }
};

export default miniCartMethods;
