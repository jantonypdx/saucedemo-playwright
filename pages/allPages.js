import Home from './home.js';
import Inventory from './inventory.js';
import Cart from './cart.js';
import Checkout from './checkout.js';
import Confirmation from './confirmation.js';

import miniCartMethods from './components/miniCartMethods.js';
import footerMethods from './components/footerMethods.js';

const pageObjectTypes = [
  'Home',
  'Inventory',
  'Cart',
  'Checkout',
  'Confirmation'
];

/**
 * Function that creates the requested page object type, assigns
 * additional common functions to the object, and then
 * returns the object back to the caller.
 * @param {String} name
 * @param {Object} attributes
 * @returns
 */
function createPage(name, attributes) {
  let pageObject = null;

  switch (name) {
    case 'Home':
      pageObject = new Home(attributes);
      break;
    case 'Inventory':
      pageObject = new Inventory(attributes);
      break;
    case 'Cart':
      pageObject = new Cart(attributes);
      break;
    case 'Checkout':
      pageObject = new Checkout(attributes);
      break;
    case 'Confirmation':
      pageObject = new Confirmation(attributes);
      break;
    default:
      throw new Error(`Page name: '${name}' is not a valid page type`);
  }

  // assign additional methods to the page object
  return Object.assign(pageObject, miniCartMethods, footerMethods);
}

/**
 * This is an aggregate object that creates separate page objects
 * for each page of a website.
 */
class AllPages {
  /**
   * @param {Object} page
   * @param {Object} context
   * @param {Object} site
   */
  constructor({ page, context, site } = {}) {
    this.page = page;
    this.pageObjs = [];

    // create new instances of each page type.
    // assign them to "this.name".
    // also add page object to this.pageObjs array.
    pageObjectTypes.forEach((name) => {
      const camelCaseName = name.charAt(0).toLowerCase() + name.slice(1);
      this[camelCaseName] = createPage(name, {
        page,
        context,
        site
      });

      this.pageObjs.push(this[camelCaseName]);
    });
  }
}

export default AllPages;
