import EjsPage from '../EjsPage';
import loginPage from '../../ejs/pages/login/index.ejs';

export default class Login extends EjsPage {
    static pageName    = 'login';
    static ejsTemplate = loginPage;

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
