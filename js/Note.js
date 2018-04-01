/**
 * A note object like
 */
export default class Note {
    /**
     * Constructor that defines a Note object like
     *
     * @param {number} id - The note ID
     * @param {string} title - The note title
     * @param {string} content - The note content
     * @param {number} order - The note order
     * @param {boolean} [pinned=false] - True if the note should be pinned on top of others, false otherwise
     * @param {Object} [reminder={}] - The note reminder date
     */
    constructor (id, title, content, order, pinned = false, reminder = {}) {
        this.id       = id;
        this.title    = title;
        this.content  = content;
        this.order    = order;
        this.pinned   = pinned;
        this.reminder = reminder;
    }
}
