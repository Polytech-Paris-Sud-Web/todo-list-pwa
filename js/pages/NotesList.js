import $ from 'jquery';
import _bind from 'lodash-es/bind';
import _max from 'lodash-es/max';
import _map from 'lodash-es/map';
import _forEach from 'lodash-es/forEach';
import _find from 'lodash-es/find';
import _parseInt from 'lodash-es/parseInt';
import _replace from 'lodash-es/replace';
import Sortable from 'sortablejs/Sortable';
import Note from '../Note';
import Notes from '../Notes';
import Ejs from '../Ejs';
import EjsPage from '../EjsPage';
import notesPage from '../../ejs/pages/notes-list/index.ejs';
import noteForm from '../../ejs/pages/notes-list/components/noteForm.ejs';
import config from "../config";

export default class NotesList extends EjsPage {
    static pageName    = 'notes-list';
    static ejsTemplate = notesPage;

    /**
     * Get the required template page template parameters
     *
     * @returns {{user: *}} The template page parameters
     */
    static async getTemplateParameter () {
        const notesHandler = new Notes();

        return {"notes": notesHandler.getNotes()};
    }

    /**
     * Load the page
     *
     * @returns {Promise.<boolean>} - True when the page is loaded
     */
    static async loadPage () {
        await super.loadPage();

        Sortable.create(
            $(config.notesList.selectors.notesContainer).get(0),
            {"onEnd": _bind(NotesList.reordList, this)}
        );

        return true;
    }

    /**
     * Reload the page
     *
     * @returns {Promise.<boolean>} True when the page is loaded
     */
    static async reloadPage () {
        await super.reloadPage();

        Sortable.create(
            $(config.notesList.selectors.notesContainer).get(0),
            {"onEnd": _bind(NotesList.reordList, this)}
        );

        return true;
    }

    /**
     * Initialize events
     *
     * @return {undefined}
     */
    static initEvents () {
        const body = $('body');

        // List view
        body.on('click', config.notesList.selectors.notesListBtn, _bind(NotesList.displayNotesList, this));
        body.on('click', config.notesList.selectors.noteFormBtn, _bind(NotesList.displayNoteForm, this));
        body.on('click', config.notesList.selectors.pinNote, _bind(NotesList.pinNote, this));
        body.on('click', config.notesList.selectors.editNote, _bind(NotesList.editNote, this));
        body.on('click', config.notesList.selectors.removeNote, _bind(NotesList.removeNote, this));
        // Form view
        body.on('click', config.notesList.selectors.saveNote, _bind(NotesList.saveNote, this));
    }

    /**
     * Display the note form
     *
     * @param {Event} e - The event fired
     *
     * @returns {undefined}
     */
    static displayNoteForm (e) {
        e.preventDefault();

        Ejs.addTemplateIntoDiv(config.notesList.pageContainer, noteForm);
    }

    /**
     * Display the notes list
     *
     * @param {Event} e - The event fired
     *
     * @returns {Promise<boolean>} True when the page is reloaded
     */
    static displayNotesList (e) {
        e.preventDefault();

        return NotesList.reloadPage();
    }

    /**
     * Save a note (new one or updated)
     *
     * @param {Event} e - The event fired
     *
     * @returns {Promise<boolean>} True when the page is reloaded
     */
    static saveNote (e) {
        e.preventDefault();

        const notesHandler = new Notes(),
              form         = $(e.currentTarget).closest(config.notesList.selectors.form.container),
              noteId       = _parseInt(form.attr('data-id'));

        if (noteId === -1) {
            // New note
            _forEach(notesHandler.getNotes(), (note) => {
                note.order++;
                notesHandler.update(note);
            });

            notesHandler.add(new Note(
                _max(_map(notesHandler.getNotes(), 'id')) + 1 || 1,
                form.find(config.notesList.selectors.form.title).val(),
                _replace(form.find(config.notesList.selectors.form.content).val(), /\r?\n/g, '<br>'),
                0
            ));
        } else {
            // Update note
            notesHandler.update(new Note(
                noteId,
                form.find(config.notesList.selectors.form.title).val(),
                _replace(form.find(config.notesList.selectors.form.content).val(), /\r?\n/g, '<br>'),
                _parseInt(form.attr('data-order')),
                form.attr('data-pinned') === 'true',
                form.attr('data-reminder')
            ));
        }

        return NotesList.reloadPage();
    }

    /**
     * Toggle pinned on a note
     *
     * @param {Event} e - The event fired
     *
     * @returns {Promise<boolean>} True when the page is reloaded
     */
    static pinNote (e) {
        e.preventDefault();

        const notesHandler = new Notes(),
              noteId       = $(e.currentTarget).closest(config.notesList.selectors.noteContainer).attr('data-id'),
              note         = _find(notesHandler.getNotes(), ['id', _parseInt(noteId)]);

        note.pinned = !note.pinned;

        notesHandler.update(note);
        window.M.Tooltip.getInstance($(e.currentTarget)).destroy();

        return NotesList.reloadPage();
    }

    /**
     * Edit a note
     *
     * @param {Event} e - The event fired
     *
     * @returns {undefined}
     */
    static editNote (e) {
        e.preventDefault();

        const notesHandler = new Notes(),
              noteId       = $(e.currentTarget).closest(config.notesList.selectors.noteContainer).attr('data-id'),
              note         = _find(notesHandler.getNotes(), ['id', _parseInt(noteId)]);

        window.M.Tooltip.getInstance($(e.currentTarget)).destroy();

        Ejs.addTemplateIntoDiv(config.notesList.pageContainer, noteForm, {note});
    }

    /**
     * Remove a note
     *
     * @param {Event} e - The event fired
     *
     * @returns {Promise<boolean>} True when the page is reloaded
     */
    static removeNote (e) {
        e.preventDefault();

        const notesHandler = new Notes(),
              noteId       = $(e.currentTarget).closest(config.notesList.selectors.noteContainer).attr('data-id'),
              removed      = notesHandler.remove(_find(notesHandler.getNotes(), ['id', _parseInt(noteId)]));

        _forEach(notesHandler.getNotes(), (note) => {
            if (note.order > removed.order) {
                note.order--;
                notesHandler.update(note);
            }
        });

        window.M.Tooltip.getInstance($(e.currentTarget)).destroy();

        return NotesList.reloadPage();
    }

    /**
     * Reord the list after a note has been moved
     *
     * @param {Event} e - The event fired
     *
     * @returns {undefined}
     */
    static reordList (e) {
        const notesHandler    = new Notes(),
              noteId          = $(e.item).find(config.notesList.selectors.noteContainer).attr('data-id'),
              movedNote       = _find(notesHandler.getNotes(), ['id', _parseInt(noteId)]),
              arrivalPosition = e.newIndex;

        _forEach(notesHandler.getNotes(), (note) => {
            if (note.order >= arrivalPosition) {
                note.order++;
                notesHandler.update(note);
            }
        });

        movedNote.order = arrivalPosition;
        notesHandler.update(movedNote);
    }
}
