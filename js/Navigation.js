import $ from 'jquery';
import _isUndefined from 'lodash-es/isUndefined';
import _startsWith from 'lodash-es/startsWith';
import _forEach from 'lodash-es/forEach';
import _size from 'lodash-es/size';
import _split from 'lodash-es/split';
import _trimStart from 'lodash-es/trimStart';
import _head from 'lodash-es/head';
import _unescape from 'lodash-es/unescape';
import config from './config.js';
import Page from './Page';
import Facebook from './Facebook';

/**
 * Navigation class to handle single page web view
 *
 * @property {Page} page=null - The current page
 * @property {object.<string, Page>} pages={} - The pages loaded
 */
export default class Navigation {
    /**
     * Create a Navigation
     *
     * @returns {undefined}
     */
    constructor () {
        this.page  = null;
        this.pages = {};
    }

    /**
     * Initialize all the events
     *
     * @returns {undefined}
     */
    initEvents () {
        $('body').on('click', config.navigation.pageSelectors.pageLink, $.proxy(this.openLink, this));
    }

    /**
     * Check if the user can be directly login else redirect to login page if he's online or homepage otherwise
     *
     * @param {User} user - The user to try to login
     *
     * @returns {Promise.<void>} A promise to sync the process
     */
    async checkLogin (user) {
        const parameters      = Navigation.getPageParameters(),
              userAccessToken = Navigation.getCookie(config.app.userTokenCookieName),
              userEmail       = Navigation.getCookie(config.app.userEmailCookieName),
              redirectionPage = _startsWith(
                  window.location.hash,
                  config.navigation.urlPrefix
            ) ? Navigation.getPageName() : config.navigation.homePage;

        let facebookAccessToken = Navigation.getCookie(config.facebook.facebookTokenCookieName);

        // eslint-disable-next-line no-negated-condition
        if (!window.navigator.onLine) {
            this.loadPage(redirectionPage);
            this.initNavigationAfterLogin();
        } else if (userAccessToken !== '' && userEmail !== '') {
            await user.loginWithToken(userEmail, userAccessToken, redirectionPage);
        } else if (facebookAccessToken !== '' || !_isUndefined(parameters.access_token)) {
            if (facebookAccessToken === '') {
                facebookAccessToken = parameters.access_token;
            }

            const tokenInfo = await Facebook.getTokenInfo(facebookAccessToken);

            if (tokenInfo.data.is_valid) {
                await user.loginWithFacebook(tokenInfo.data.user_id, facebookAccessToken, redirectionPage);
            } else {
                this.loadPage(config.navigation.loginPage);
            }
        } else {
            this.loadPage(redirectionPage);
            this.initNavigationAfterLogin();
        }
    }

    /**
     * Display the page called on a page-link click
     *
     * @param {Event} e - The event fired
     *
     * @returns {undefined}
     */
    openLink (e) {
        e.preventDefault();

        const href       = $(e.currentTarget).attr('href'),
              url        = Navigation.getPageName(href) || $(e.currentTarget).attr('data-url'),
              parameters = Navigation.getPageParameters(href);

        try {
            window.M.Sidenav.getInstance($(config.navigation.menuSelectors.menu)).close();

            if (window.location.hash !== url) {
                this.loadPage(url);
                this.page.parameters = parameters;
            }
        } catch (error) {
            window.AppNotification.add(error.message);
        }
    }

    /**
     * Display a page by hiding / showing DOM elements and set pages attributes
     *
     * @param {string} url - The page URL to load
     *
     * @returns {undefined}
     */
    loadPage (url) {
        // Parse the page if it is not already parsed
        if (_isUndefined(this.pages[url])) {
            this.pages[url] = Navigation.parsePage(url);
        }
        // Set page title
        $('title').html(this.pages[url].title);
        // Hide the current page if exists
        if (this.page !== null) {
            this.page.dom.hide();
            this.page.dom.removeClass(config.navigation.pageSelectors.currentPage.substr(1));
        }
        // Display the page
        this.pages[url].dom.show();
        this.pages[url].dom.addClass(config.navigation.pageSelectors.currentPage.substr(1));
        // Set the URL hash
        if (!_startsWith(window.location.hash, config.navigation.urlPrefix + this.pages[url].url)) {
            window.location.hash = config.navigation.urlPrefix + this.pages[url].url;
        }
        // Set the new current page
        this.page            = this.pages[url];
        // Load the page parameters if any
        this.page.parameters = Navigation.getPageParameters();
        // Run the callbacks if there are some
        this.runCallbacks();
    }

    /**
     * Add a callback to the page after it is loading
     *
     * @param {string} url - The page url to add the callback to
     * @param {pageLoadCallback} callback - The callback function
     * @param {object} [context=this] - The callback context (null to use the navigation this context)
     * @param {Array} [args=[]] - The callback arguments
     *
     * @returns {undefined}
     */
    addCallback (url, callback, context = this, args = []) {
        try {
            // Parse the page if it is not already parsed
            if (_isUndefined(this.pages[url])) {
                this.pages[url] = Navigation.parsePage(url);
            }

            this.pages[url].callbacks.push({callback, context, args});
        } catch (error) {
            window.AppNotification.add(error.message);
        }
    }

    /**
     * Run the current page callbacks if any exists
     *
     * @returns {undefined}
     */
    runCallbacks () {
        if (this.page !== null && _size(this.page.callbacks) > 0) {
            _forEach(
                this.page.callbacks, (callbackInfo) => {
                    callbackInfo.callback.apply(callbackInfo.context, callbackInfo.args);
                }
            );
        }
    }

    /**
     * Initialize the navigation system and the menu once the user is logged
     *
     * @returns {undefined}
     */
    initNavigationAfterLogin () {
        // Initialize menu toggle button and show it
        window.M.Sidenav.init($(config.navigation.menuSelectors.menu));
        $(config.navigation.menuSelectors.buttonToggle).show();

        // Initialize the navigation system
        this.initEvents();
    }

    /**
     * Destroy the menu once the user is logout
     *
     * @todo init events off
     *
     * @returns {undefined}
     */
    static destroyNavigationAfterLogout () {
        // Hide the menu and the menu toggle button
        $(config.navigation.menuSelectors.buttonToggle).hide();
        window.M.Sidenav.getInstance($(config.navigation.menuSelectors.menu)).destroy();
    }

    /**
     * Parse a page defined by the given URL parameter and return a new Page object
     *
     * @param {string} url - The page url
     * @throws {Error} If the page DOM element does not exist (like a 404 not found)
     *
     * @returns {Page} The new parsed Page
     */
    static parsePage (url) {
        const dom  = $(`${config.navigation.pageSelectors.page}[data-url="${url}"]`),
              page = new Page(dom, url, dom.attr('data-title'));

        if (!dom || dom.length < 1) {
            throw new Error('This page does not exists');
        }

        return page;
    }

    /**
     * Get the page parameters in parsing the current hash or the given URL if any
     *
     * @param {string} [url] - The URL to get the page name from
     *
     * @returns {Object} A list of page parameters given in URL with classic url.com?p1=v1&p2=v2
     */
    static getPageParameters (url) {
        const parameters = {};

        let parametersRaw = _isUndefined(url) ? window.location.hash.substr(1) : url.substr(1),
            split;

        if (parametersRaw.indexOf('?') !== -1) {
            parametersRaw = _split(parametersRaw, '?')[1];
        }

        if (parametersRaw.indexOf('&') !== -1) {
            parametersRaw = _split(parametersRaw, '&');

            _forEach(
                parametersRaw, (parameter) => {
                    split                = _split(parameter, '=');
                    parameters[split[0]] = split[1];
                }
            );
        } else if (parametersRaw.indexOf('=') !== -1) {
            split                = _split(parametersRaw, '=');
            parameters[split[0]] = split[1];
        }

        return parameters;
    }

    /**
     * Get the page name in parsing the current hash or the given URL if any
     *
     * @param {string} [url] - The URL to get the page name from
     *
     * @returns {string} The current page name
     */
    static getPageName (url) {
        const hash      = _isUndefined(url) ? window.location.hash : url,
              urlPrefix = config.navigation.urlPrefix;

        return _startsWith(hash, urlPrefix) ? _trimStart(_head(_split(hash, '?')), urlPrefix) : hash;
    }

    /**
     * Clear the URL hash from parameters
     *
     * @returns {undefined}
     */
    static clearHashParameters () {
        window.location.hash = config.navigation.urlPrefix + Navigation.getPageName();
    }

    /**
     * Get a cookie by name
     *
     * @param {string} name - The cookie name
     *
     * @returns {string} The cookie value (empty string if not found)
     */
    static getCookie (name) {
        const regex       = new RegExp(`${name}=([^;]+)`),
              regexResult = regex.exec(document.cookie);

        let value = '';

        if (regexResult !== null) {
            value = _unescape(regexResult[1]);
        }

        return value;
    }
}
