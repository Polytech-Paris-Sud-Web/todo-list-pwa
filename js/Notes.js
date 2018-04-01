import Storage from 'store2';
import _findIndex from 'lodash-es/findIndex';
import _remove from 'lodash-es/remove';

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
    }

    /**
     * Add a note to the collection
     *
     * @param {Note} note - The note to add
     */
    add (note) {
        this.notes.append(note);
        this.updateStorage();
    }

    /**
     * Remove a note from the collection
     *
     * @param {Note} note - The note to remove
     */
    remove (note) {
        _remove(this.notes, (noteObject) => noteObject.id === note.id);

        this.updateStorage();
    }

    /**
     * Update a note from the collection
     *
     * @param {Note} note - The note to update
     */
    update (note) {
        this.notes[_findIndex(this.notes, (noteObject) => noteObject.id === note.id)] = note;

        this.updateStorage();
    }

    /**
     * Update the local storage with the collection
     */
    updateStorage () {
        Storage.local.set('notes', this.notes, true);
    }
}
