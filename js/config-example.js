export default {
    "navigation"  : {
        "landingPage"  : "loading",
        "loginPage"    : "login",
        "homePage"     : "home",
        "pageSelectors": {
            "currentPage"       : ".current-page",
            "page"              : ".page",
            "pageLink"          : ".page-link",
            "pageLinkParameters": ".page-link-parameters"
        },
        "menuSelectors": {
            "buttonToggle": "#toggle-menu-left",
            "cover"       : "#menu-left .cover",
            "name"        : "#user-view .name",
            "email"       : "#user-view .email",
            "picture"     : "#user-view .picture"
        },
        "urlPrefix"    : "#!"
    },
    "ejs"         : {
        "selectors": {
            "loader": ".preloader-wrapper-container"
        }
    },
    "flow"        : {
        "tree"     : {
            "container": "#flow-container",
            "width"    : 500,
            "height"   : 500,
            "node"     : {
                "width"        : 200,
                "height"       : 100,
                "paddingTop"   : 30,
                "paddingBottom": 200,
                "paddingRight" : 20,
                "paddingLeft"  : 20,
                "stroke"       : "black",
                "strokeWidth"  : 4,
                "title"        : {
                    "fontSize"  : "25",
                    "fontFamily": "Calibri",
                    "fill"      : "black"
                }
            },
            "link"     : {
                "pointerLength": 20,
                "pointerWidth" : 20,
                "fill"         : "black",
                "stroke"       : "black",
                "strokeWidth"  : 4
            }
        },
        "selectors": {
            "userInteraction": {
                "addForm"              : "#add-user-interaction-form",
                "save"                 : "#save-user-interaction-form",
                "cancel"               : "#cancel-user-interaction-form",
                "formContainer"        : "#add-user-interaction-form-container",
                "responseTypeInput"    : "#user-interaction-accept-response-type-input",
                "responseTypeContainer": "#user-interaction-accept-response-type-container",
                "bindInput"            : "#user-interaction-bind-input",
                "labelInput"           : "#user-interaction-label-input",
                "predefinedInput"      : "#predefined-user-interaction-input"
            },
            "botInteraction" : {
                "addForm"      : "#add-bot-interaction-form",
                "save"         : "#save-bot-interaction-form",
                "cancel"       : "#cancel-bot-interaction-form",
                "formContainer": "#add-bot-interaction-form-container",
                "bindInput"    : "#bot-interaction-bind-input",
                "labelInput"   : "#bot-interaction-label-input"
            },
            "addFormAction"  : {
                "container": "#add-forms-action"
            }
        }
    },
    "bot"         : {
        "selectors": {
            "pages"  : {
                "container": "#bot-pages-selector-container",
                "input"    : "#bot-pages-selector-input"
            },
            "events" : {
                "container": "#bot-events-selector-container",
                "input"    : "#bot-events-selector-input"
            },
            "message": {
                "container": "#bot-message-input-container",
                "input"    : "#bot-message-input"
            },
            "save"   : "#save-bot-edition",
            "cancel" : "#cancel-bot-edition"
        }
    },
    "home"        : {
        "selectors": {
            "toggleBot": ".toggle-bot",
            "editBot"  : ".edit-bot",
            "removeBot": ".remove-bot"
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
        "appId"           : "140195826556349",
        "apiRootUrl"      : "https://graph.facebook.com/v2.9",
        "siteRootUrl"     : "https://facebook.com/v2.9",
        "redirectionUrl"  : "http://localhost:8000",
        "localCookieName" : "facebook_token",
        "connectBtnId"    : "#facebook-connect",
        "disconnectBtnId" : "#facebook-disconnect",
        "authorizations"  : ["public_profile", "email", "manage_pages", "pages_messaging"],
        "requiredUserInfo": ["id", "email", "name", "first_name", "last_name", "cover", "picture"]
    },
    "app"         : {
        "url"          : "http://facebook-api.app",
        "personalToken": "artsmartiaux"
    }
};
