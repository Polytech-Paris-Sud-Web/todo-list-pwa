/**
 * A page object like
 */
export default class Page {
    /**
     * Constructor that defines a Page object like
     *
     * @param {jQuery} dom - The page DOM as jQuery object
     * @param {string} url - The page URL
     * @param {string} title - The page title
     * @param {Object} [parameters={}] - A list of page parameters given in URL with classic url.com?p1=v1&p2=v2
     * @param {Page~CallbacksInfo[]} [callbacks=[]] - List of callbacks and contexts to run after the page's loading
     */
    constructor (dom, url, title, parameters = {}, callbacks = []) {
        this.dom        = dom;
        this.url        = url;
        this.title      = title;
        this.parameters = parameters;
        this.callbacks  = callbacks;
        this.loaded     = false;
    }

    /**
     * @typedef {object} Page~CallbacksInfo
     * @property {*} context=Navigation - The callback context for this keyword
     * @property {Page~pageLoadCallback} callback - The callback to run after the page's loading
     */

    /**
     * Callback after the page's loading
     *
     * @callback Page~pageLoadCallback
     * @param {*...} [params] - The callback parameters
     * @this CallbacksInfo.context
     */
}
