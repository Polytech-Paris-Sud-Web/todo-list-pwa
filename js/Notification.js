/* global Materialize */

import $ from 'jquery';
import _delay from 'lodash-es/delay';
import config from './config';

/**
 * Notification object parameters
 *
 * @typedef {Object} NotificationParams
 * @property {string} text - The notification text to display
 * @property {string} [type=alert] - The notification type ("alert", "popup", "notification")
 * @property {string} [level=info] - The notification level ("danger", "warning", "info", "success")
 * @property {string} [title=''] - The notification title
 * @property {number} [duration=2000] - The notification maximum duration in millisecond (-1 for infinite)
 */

/**
 * Notification manager to handle different way of interacting with the user
 *
 * @property {object.<string, boolean>} lock - The status of the different modules
 * @property {object.<string, number>} timeout - The timeout number of the different modules
 * @property {object.<string, NotificationParams[]>} queue - The notification queue of each modules
 */
export default class Notification {
    constructor () {
        this.lock = {
            "alert"       : false,
            "popup"       : false,
            "notification": false
        };

        this.timeout = {
            "alert"       : 0,
            "popup"       : 0,
            "notification": 0
        };

        this.queue = {
            "alert"       : [],
            "popup"       : [],
            "notification": []
        };
    }

    /**
     * Initialize events
     *
     * @return {undefined}
     */
    initEvents () {
        const body = $('body');

        body.on(
            'click',
            `${config.notification.alert.divId} ${config.notification.alert.dismissClass}`,
            $.proxy(this.alertDismiss, this)
        );

        body.on(
            'click',
            `${config.notification.popup.divId} ${config.notification.popup.dismissClass}`,
            $.proxy(this.popupDismissEvent, this)
        );

        body.on(
            'click',
            `${config.notification.notification.divId} ${config.notification.notification.dismissClass}`,
            $.proxy(this.notificationDismiss, this)
        );

        // Initialize the popup modal
        window.M.Modal.init($(config.notification.popup.divId));
    }

    /**
     * The method fired on user close popup click
     *
     * @param {Event} e - The fired event
     *
     * @return {undefined}
     */
    popupDismissEvent (e) {
        e.preventDefault();
        clearTimeout(this.timeout.popup);
        this.popupDismiss();
    }

    /**
     * Display a notification on a top right of teh user screen
     *
     * @param {NotificationParams} notification - The notification to display
     *
     * @return {undefined}
     */
    alert (notification) {
        this.lock.alert = true;
        window.M.toast({"html": notification.text, "displayLength": notification.duration});
    }

    /**
     * Display a notification on a modal to the user screen
     *
     * @param {NotificationParams} notification - The notification to display
     *
     * @return {undefined}
     */
    popup (notification) {
        console.log('popup', notification);
        const modal         = $(config.notification.popup.divId),
              modalInstance = window.M.Modal.getInstance(modal);

        this.lock.popup = true;
        modal.find('.title').text(notification.title);
        modal.find('.content').html(notification.text);
        modalInstance.open();
    }

    /**
     * Display a notification on a medium div at the bottom-right of the user screen
     *
     * @param {NotificationParams} notification - The notification to display
     *
     * @return {undefined}
     */
    notification (notification) {
        this.lock.notification = true;
        // @todo
        console.log('notification', notification);
    }

    /**
     * Close the alert notification
     *
     * @return {undefined}
     */
    alertDismiss () {
        if (this.lock.alert) {
            this.lock.alert = false;
            this.dequeNotification('alert');
        }
    }

    /**
     * Close the popup notification
     *
     * @return {undefined}
     */
    popupDismiss () {
        if (this.lock.popup) {
            $(config.notification.popup.divId).modal('close');

            // Need to wait just couple of ms to let the modal get properly closed
            _delay(() => {
                this.lock.popup = false;
                this.dequeNotification('popup');
            }, 500);
        }
    }

    /**
     * Close the notification notification
     *
     * @return {undefined}
     */
    notificationDismiss () {
        if (this.lock.notification) {
            this.lock.notification = false;
            this.dequeNotification('notification');
        }
    }

    /**
     * Add a notification in a specific queue to display it
     *
     * @param {string} text - The notification text to display
     * @param {string} [type=alert] - The notification type ("alert", "popup", "notification")
     * @param {string} [level=info] - The notification level ("danger", "warning", "info", "success")
     * @param {string} [title=''] - The notification title
     * @param {Number} [duration=2000] - The notification maximum duration in millisecond (-1 for infinite)
     *
     * @return {undefined}
     */
    add (text, type, level, title, duration) {
        if (!type) {
            type = config.notification.defaultType;
        }

        this.queue[type].push(
            {
                text,
                "level"   : level || config.notification.defaultLevel,
                "title"   : title || '',
                "duration": duration || config.notification[type].defaultDuration
            }
        );

        this.dequeNotification(type);
    }

    /**
     * Deque a notification from the specific queue if the queue is not empty and the queue is not locked
     *
     * @param {string} type - The notification type ("alert", "popup", "notification")
     *
     * @return {undefined}
     */
    dequeNotification (type) {
        const self = this;

        if (!this.lock[type]) {
            const notification  = this.queue[type].shift(),
                  dismissMethod = `${type}Dismiss`;

            if (notification) {
                // Call the specific method to output the notification
                this[type](notification);
                // Auto dismiss the notification after notification.duration seconds
                this.timeout[type] = setTimeout(
                    () => {
                        self[dismissMethod]();
                    }, notification.duration
                );
            }
        }
    }
}
