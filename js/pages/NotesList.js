import $ from 'jquery';
import Sortable from 'sortablejs/Sortable';
import Notes from '../Notes';
import EjsPage from '../EjsPage';
import notesPage from '../../ejs/pages/notes-list/index.ejs';

export default class NotesList extends EjsPage {
    static pageName    = 'notes-list';
    static ejsTemplate = notesPage;
    static notes       = new Notes();

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

    /**
     * Load the page
     *
     * @param {User} user - The user who called the page
     *
     * @returns {Promise.<boolean>} - True when the page is loaded
     */
    static async loadPage (user) {
        await super.loadPage(user);

        Sortable.create($('#notes-container').get(0));

        return true;
    }
}
