import Ejs from './Ejs';

/**
 * @interface EjsPage
 */
export default class EjsPage {
    static pageContainer = '';

    /**
     * Check for overridden methods
     */
    constructor () {
        if (typeof this.pageName !== 'string') {
            throw new TypeError('Must override pageName static attribute');
        }

        if (typeof this.ejsTemplate !== 'string') {
            throw new TypeError('Must override ejsTemplate static attribute');
        }

        if (typeof this.getTemplateParameter !== 'function') {
            throw new TypeError('Must override getTemplateParameter method');
        }
    }

    /**
     * Load the page
     *
     * @param {...*} templateRequiredParameter - The template required parameters
     *
     * @returns {Promise.<boolean>} - True when the page is loaded
     */
    static async loadPage (...templateRequiredParameter) {
        return Ejs.loadPage(
            this.pageName,
            this.ejsTemplate,
            this.pageContainer,
            await this.getTemplateParameter(...templateRequiredParameter)
        );
    }

    /**
     * Reload the page
     *
     * @param {...*} templateRequiredParameter - The template required parameters
     *
     * @returns {Promise.<boolean>} - True when the page is loaded
     */
    static async reloadPage (...templateRequiredParameter) {
        return Ejs.reloadPage(
            this.pageName,
            this.ejsTemplate,
            this.pageContainer,
            await this.getTemplateParameter(...templateRequiredParameter)
        );
    }
}
