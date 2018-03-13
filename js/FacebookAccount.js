export default class FacebookAccount {
    /**
     * The '/me' Graph API info response with additional email field
     * @link https://developers.facebook.com/docs/facebook-login/permissions#reference-public_profile
     *
     * @typedef {Object} facebookUserInfoResponse
     * @property {string} id - The id of this person's user account. This ID is unique to each app and cannot be used
     *                         across different apps.
     * @property {Object} cover - The person's cover photo
     * @property {string} email - The person's primary email address listed on their profile. This field will not be
     *                            returned if no valid email address is available
     * @property {string} name - The person's full name
     * @property {string} first_name - The person's first name
     * @property {string} last_name - The person's last name
     * @property {Object} age_range - The age segment for this person expressed as a minimum and maximum age. For
     *                                example, more than 18, less than 21.
     * @property {string} link - A link to the person's Timeline
     * @property {string} gender - The gender selected by this person, male or female. If the gender is set to a custom
     *                             value, this value will be based off of the preferred pronoun; it will be omitted if
     *                             the preferred preferred pronoun is neutral
     * @property {string} locale - The person's locale
     * @property {Object} picture - The person's profile picture
     * @property {Number} timezone - The person's current timezone offset from UTC
     * @property {string} updated_time - Updated time
     * @property {boolean} verified - Indicates whether the account has been verified. This is distinct from the
     *                                is_verified field. Someone is considered verified if they take any of the
     *                                following actions:
     *                                - Register for mobile
     *                                - Confirm their account via SMS
     *                                - Enter a valid credit card
     */

    /**
     * Facebook account constructor
     *
     * @param {facebookUserInfoResponse} facebookUserInfo - The user account information
     */
    constructor (facebookUserInfo) {
        this.id          = facebookUserInfo.id;
        this.email       = facebookUserInfo.email;
        this.cover       = facebookUserInfo.cover;
        this.name        = facebookUserInfo.name;
        this.firstName   = facebookUserInfo.first_name;
        this.lastName    = facebookUserInfo.last_name;
        this.ageRange    = facebookUserInfo.age_range;
        this.link        = facebookUserInfo.link;
        this.gender      = facebookUserInfo.gender;
        this.locale      = facebookUserInfo.locale;
        this.picture     = facebookUserInfo.picture;
        this.timezone    = facebookUserInfo.timezone;
        this.updatedTime = facebookUserInfo.updated_time;
        this.verified    = facebookUserInfo.verified;

        this.accessToken = '';
    }
}
