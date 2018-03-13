import $ from 'jquery';
import _bind from 'lodash-es/bind';
import config from './config.js';
import Navigation from './Navigation';
import AppAPI from './AppAPI';
import Facebook from './Facebook';
import FacebookAccount from './FacebookAccount';

/**
 * A page object like
 */
export default class User {
    /**
     * The app user object like
     *
     * @typedef {Object} appUserObject
     * @property {Number} id - The user ID
     * @property {string} email - The user email
     * @property {string} first_name - The user first name
     * @property {string} last_name - The user last name
     * @property {string} ip - The user IP address
     * @property {string} access_token - The user access token
     * @property {Object} access_token_expiration - The user access token expiration date
     * @property {Object} last_login - The user last successful login
     * @property {Object} created_at - The user creation date
     * @property {Object} updated_at - The user last update date
     */

    /**
     * The app response given after a login attempt
     *
     * @typedef {Object} appLoginResponse
     * @property {boolean} success - If the login attempt is a success or not
     * @property {string} message - The error message or "Success" if there is not error
     * @property {appUserObject} user - The app user object like
     */

    /**
     * User constructor
     */
    constructor () {
        this.id                    = 0;
        this.email                 = '';
        this.firstName             = '';
        this.lastName              = '';
        this.ip                    = '';
        this.accessToken           = '';
        this.accessTokenExpiration = {};
        this.accounts              = [];
    }

    /**
     * Initialize events
     *
     * @return {undefined}
     */
    initEvents () {
        const body = $('body');

        body.on('click', config.facebook.connectBtnId, () => Facebook.connect());
        body.on('click', config.facebook.disconnectBtnId, _bind(this.logout, this));
    }

    /**
     * Connect the user to the using email and password or redirect to the login page
     *
     * @param {string} email - The user email
     * @param {string} password - The user password
     * @param {string} urlPageRedirection - The URL of the page to be redirected after the connection
     *
     * @return {Promise.<boolean>} True when the method has finished
     */
    async loginWithPassword (email, password, urlPageRedirection) {
        const loginResponse = await AppAPI.post('/user/login/password', {"user": {email, password}}, this);

        if (loginResponse.success) {
            this.loadUserInfoFromLoginResponse(loginResponse);
            this.initializeMenuAfterLogin(urlPageRedirection);
        }

        return true;
    }

    /**
     * Connect the user to the app using access token or redirect to the login page
     *
     * @param {string} email - The user email
     * @param {string} accessToken - The user access token
     * @param {string} urlPageRedirection - The URL of the page to be redirected after the connection
     *
     * @return {Promise.<boolean>} True when the method has finished
     */
    async loginWithToken (email, accessToken, urlPageRedirection) {
        const loginResponse = await AppAPI.post('/user/login/token', {"user": {email, accessToken}}, this);

        if (loginResponse.success) {
            this.loadUserInfoFromLoginResponse(loginResponse);
            this.initializeMenuAfterLogin(urlPageRedirection);
        }

        return true;
    }

    /**
     * Connect the user to the app by requiring Facebook info or redirect to the login page
     *
     * @param {string} facebookUserId - The user Facebook ID who is making the call
     * @param {string} facebookAccessToken - The user Facebook access token
     * @param {string} urlPageRedirection - The URL of the page to be redirected after the connection
     *
     * @return {Promise.<boolean>} True when the method has finished
     */
    async loginWithFacebook (facebookUserId, facebookAccessToken, urlPageRedirection) {
        const facebookUserInfo = await Facebook.getUserInfo(facebookUserId, facebookAccessToken),
              facebookAccount  = new FacebookAccount(facebookUserInfo),
              loginResponse    = await AppAPI.post(
                  '/user/login/facebook',
                  {
                      facebookUserId,
                      facebookAccessToken,
                      "user": {
                          "email"    : facebookAccount.email,
                          "firstName": facebookAccount.firstName,
                          "lastName" : facebookAccount.lastName,
                          "cover"    : facebookAccount.cover,
                          "picture"  : facebookAccount.picture
                      }
                  },
                  this
              );

        this.accounts.push(facebookAccount);

        if (loginResponse.success) {
            this.loadUserInfoFromLoginResponse(loginResponse);

            // Get a Facebook long duration access token for client
            if (Navigation.getCookie(config.facebook.facebookTokenCookieName) === '') {
                const longDurationAccessToken = await Facebook.getLongDurationAccessToken(loginResponse.code);

                // @todo save the machine ID server side ?
                facebookAccount.accessToken = longDurationAccessToken.access_token;
                // eslint-disable-next-line max-len
                document.cookie = `${config.facebook.facebookTokenCookieName}=${facebookAccount.accessToken}; expires=Tue, 19 Jan 2038 03:14:07 UTC; path=/`;
            }

            this.initializeMenuAfterLogin(urlPageRedirection);

            if (facebookAccount.picture.data.url !== '') {
                $(config.navigation.menuSelectors.picture).attr('src', facebookAccount.picture.data.url);
            }

            if (facebookAccount.cover.source !== 'facebookAccount') {
                $(config.navigation.menuSelectors.cover).css(
                    'background-image',
                    `url("${facebookAccount.cover.source}")`
                );
            }
        }

        return true;
    }

    /**
     * Load the user information after a login
     *
     * @param {appLoginResponse} loginResponse - The app login response
     *
     * @return {undefined}
     */
    loadUserInfoFromLoginResponse (loginResponse) {
        this.id                    = loginResponse.user.id;
        this.email                 = loginResponse.user.email;
        this.firstName             = loginResponse.user.first_name;
        this.lastName              = loginResponse.user.last_name;
        this.ip                    = loginResponse.user.ip;
        this.accessToken           = loginResponse.user.access_token;
        this.accessTokenExpiration = loginResponse.user.access_token_expiration;
    }

    /**
     * Iinitialize the menu after a user login
     *
     * @param {string} urlPageRedirection - The page to redirect to after the login
     *
     * @return {undefined}
     */
    initializeMenuAfterLogin (urlPageRedirection) {
        // Initialize the navigation menu
        window.AppNavigation.initNavigationAfterLogin();
        window.AppNavigation.loadPage(urlPageRedirection);

        // Initialize custom navigation header
        $(config.navigation.menuSelectors.email).text(this.email);
        $(config.navigation.menuSelectors.name).text(`${this.firstName} ${this.lastName}`);
    }

    /**
     * Logout the user from the app
     *
     * @return  {undefined}
     */
    logout () {
        // Reset User info
        this.id                    = 0;
        this.email                 = '';
        this.firstName             = '';
        this.lastName              = '';
        this.ip                    = '';
        this.accessToken           = '';
        this.accessTokenExpiration = {};
        this.accounts              = [];

        Navigation.destroyNavigationAfterLogout();
        document.cookie = `${config.facebook.facebookTokenCookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
        document.cookie = `${config.app.userTokenCookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
        document.cookie = `${config.app.userEmailCookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
        window.AppNavigation.loadPage(config.navigation.loginPage);
    }
}
