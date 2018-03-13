import EjsPage from '../EjsPage';
import homePage from '../../ejs/pages/home/index.ejs';

export default class Home extends EjsPage {
    static pageName    = 'home';
    static ejsTemplate = homePage;

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
