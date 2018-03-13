import $ from 'jquery';
import _assign from 'lodash-es/assign';
import config from './config.js';

/**
 * Helper to make API call to the backend app
 */
export default class AppAPI {
    /**
     * Shorthand method to call a GET verb app API request
     *
     * @param {string } route - The API route
     * @param {Object} [params = {}] - The request params OPTIONAL
     * @param {User} [user = null] - The user who makes the request OPTIONAL
     *
     * @returns {Promise} The XHR jQuery Promise
     */
    static get (route, params = {}, user = null) {
        return this.request('GET', route, params, user);
    }

    /**
     * Shorthand method to call a POST verb app API request
     *
     * @param {string} route - The API route
     * @param {Object} [params = {}] - The request params OPTIONAL
     * @param {User} [user = null] - The user who makes the request OPTIONAL
     *
     * @returns {Promise} The XHR jQuery Promise
     */
    static post (route, params = {}, user = null) {
        return this.request('POST', route, params, user);
    }

    /**
     * Shorthand method to call a PUT verb app API request
     *
     * @param {string} route - The API route
     * @param {Object} [params = {}] - The request params OPTIONAL
     * @param {User} [user = null] - The user who makes the request OPTIONAL
     *
     * @returns {Promise} The XHR jQuery Promise
     */
    static put (route, params = {}, user = null) {
        return this.request('PUT', route, params, user);
    }

    /**
     * Shorthand method to call a DELETE verb app API request
     *
     * @param {string} route - The API route
     * @param {Object} [params = {}] - The request params OPTIONAL
     * @param {User} [user = null] - The user who makes the request OPTIONAL
     *
     * @returns {Promise} The XHR jQuery Promise
     */
    static del (route, params = {}, user = null) {
        return this.request('DELETE', route, params, user);
    }

    /**
     * Utility method to call a POST or GET app API request
     *
     * @param {string} verb - The verb of the request (GET, POST, PUT, DELETE)
     * @param {string} route - The API route
     * @param {Object} [params = {}] - The request params OPTIONAL
     * @param {User} [user = null] - The user who makes the request OPTIONAL
     *
     * @returns {Promise} The XHR jQuery Promise
     */
    static request (verb, route, params = {}, user = null) {
        if (user !== null) {
            _assign(params, {'userId': user.id, 'userAccessToken': user.accessToken});
        }

        return $.ajax(
            {
                "url"     : config.app.url + route,
                "type"    : verb,
                "data"    : params,
                "dataType": "json"
            }
        ).promise();
    }
}
