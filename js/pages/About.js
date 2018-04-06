import EjsPage from '../EjsPage';
import aboutPage from '../../ejs/pages/about/index.ejs';

export default class About extends EjsPage {
    static pageName    = 'about';
    static ejsTemplate = aboutPage;

    /**
     * Get the required template page template parameters
     *
     * @param {User} user - The user who loads the page
     *
     * @returns {{user: *}} The template page parameters
     */
    static async getTemplateParameter (user) {
        return {user};
    }
}
