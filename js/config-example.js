export default {
    "navigation"  : {
        "landingPage"  : "notes-list",
        "loginPage"    : "login",
        "homePage"     : "home",
        "pageSelectors": {
            "currentPage": ".current-page",
            "page"       : ".page",
            "pageLink"   : ".page-link"
        },
        "menuSelectors": {
            "menu"        : "#menu-left",
            "buttonToggle": "#toggle-menu-left",
            "cover"       : "#menu-left .cover",
            "name"        : "#user-view .name",
            "email"       : "#user-view .email",
            "picture"     : "#user-view .picture"
        },
        "urlPrefix"    : "#!"
    },
    "ejs"         : {
        "chipsDataSeparator": "||",
        "selectors"         : {
            "loader": ".preloader-wrapper-container"
        }
    },
    "home"        : {
        "selectors": {
            "toggleBot": ".toggle-bot",
            "editBot"  : ".edit-bot",
            "removeBot": ".remove-bot"
        }
    },
    "notesList"        : {
        "pageContainer": "#notes-list-page-container",
        "selectors"    : {
            "notesContainer": "#notes-container",
            "noteContainer" : ".card",
            "noteFormBtn"   : "#note-form-open",
            "notesListBtn"  : "#notes-list-open",
            "saveNote"      : "#save-note",
            "pinNote"       : ".pin",
            "editNote"      : ".edit",
            "removeNote"    : ".remove",
            "form"          : {
                "container": "#note-form",
                "title"    : "#note-title-input",
                "content"  : "#note-content-input",
            }
        }
    },
    "notification": {
        "alert"       : {
            "divId"          : "#alert-container",
            "dismissClass"   : ".dismiss",
            "defaultDuration": 2000
        },
        "popup"       : {
            "divId"          : "#modal-popup",
            "dismissClass"   : ".modal-close",
            "defaultDuration": 6000
        },
        "notification": {
            "divId"          : "#notification-container",
            "dismissClass"   : ".dismiss",
            "defaultDuration": 4000
        },
        "defaultType" : "alert",
        "defaultLevel": "info"
    },
    "facebook"    : {
        "appId"                  : "468978316851998",
        "apiRootUrl"             : "https://graph.facebook.com/v2.12",
        "siteRootUrl"            : "https://facebook.com/v2.12",
        "redirectionUrl"         : "https://todo-list.app",
        "facebookTokenCookieName": "facebook_token",
        "connectBtnId"           : "#facebook-connect",
        "disconnectBtnId"        : "#facebook-disconnect",
        "authorizations"         : ["public_profile", "email"],
        "requiredUserInfo"       : [
            "id",
            "cover",
            "email",
            "name",
            "first_name",
            "last_name",
            "age_range",
            "link",
            "gender",
            "locale",
            "picture",
            "timezone",
            "updated_time",
            "verified"
        ]
    },
    "app"         : {
        "url"                : "https://todo-list-api.app",
        "userTokenCookieName": "user_token",
        "userEmailCookieName": "user_email",
        "personalToken"      : "artsmartiaux"
    }
};
