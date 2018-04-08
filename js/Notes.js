import Storage from 'store2';
import _findIndex from 'lodash-es/findIndex';
import _remove from 'lodash-es/remove';
import _orderBy from 'lodash-es/orderBy';

/**
 * A note handler
 *
 * @property {Note[]} notes - The note collection
 */
export default class Notes {
    /**
     * Notes constructor
     */
    constructor () {
        this.notes = Storage.local.get('notes', []);

        this.sort();
    }

    /**
     * Get the note collection
     *
     * @returns {Note[]} The note collection
     */
    getNotes () {
        return this.notes;
    }

    /**
     * Add a note to the collection
     *
     * @param {Note} note - The note to add
     *
     * @returns {undefined}
     */
    add (note) {
        this.notes.push(note);
        this.updateStorage();
    }

    /**
     * Remove a note from the collection
     *
     * @param {Note} note - The note to remove
     *
     * @returns {undefined}
     */
    remove (note) {
        _remove(this.notes, (noteObject) => noteObject.id === note.id);

        this.updateStorage();
    }

    /**
     * Update a note from the collection
     *
     * @param {Note} note - The note to update
     *
     * @returns {undefined}
     */
    update (note) {
        this.notes[_findIndex(this.notes, (noteObject) => noteObject.id === note.id)] = note;

        this.updateStorage();
    }

    /**
     * Update the local storage with the collection
     *
     * @returns {undefined}
     */
    updateStorage () {
        this.sort();
        Storage.local.set('notes', this.notes, true);
    }

    /**
     * Sort the notes by pinned and order
     *
     * @returns {undefined}
     */
    sort () {
        this.notes = _orderBy(this.notes, ['pinned', 'order'], ['desc', 'asc']);
    }
}
