import EjsPage from '../EjsPage';
import profilePage from '../../ejs/pages/profile/index.ejs';

export default class Profile extends EjsPage {
    static pageName    = 'profile';
    static ejsTemplate = profilePage;

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
