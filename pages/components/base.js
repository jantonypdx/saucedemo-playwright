export default class Base {
  /**
   * @param {Object} name
   * @param {Object} page
   * @param {Object} context
   * @param {Object} site
   */
  constructor({ name, page, context = null, site = null }) {
    this.name = name;
    this.page = page;
    this.context = context;
    this.site = site;
  }

  // add other base class utility functions here
}
