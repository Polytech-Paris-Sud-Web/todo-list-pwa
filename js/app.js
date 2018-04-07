import 'materialize-css';
import $ from 'jquery';
import config from './config';
import Navigation from './Navigation';
import Notification from './Notification';
import User from './User';
import About from './pages/About';
import NotesList from './pages/NotesList';
import Login from './pages/Login';
import Profile from './pages/Profile';

/**
 * Make a global notification object accessible in all the app
 *
 * @type {Notification}
 */
window.AppNotification = new Notification();

/**
 * Make a global navigation object accessible in all the app
 *
 * @type {Navigation}
 */
window.AppNavigation = new Navigation();

/**
 * Main app code after DomReady event
 */
$(
    () => {
        // Initialize service worker for PWA
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('./service-worker.js', {scope: '/'})
                     .then(() => console.log('Service Worker registered successfully.'))
                     .catch(error => console.log('Service Worker registration failed:', error));
        }

        // Create the user
        const user = new User();

        // Initialize user events
        user.initEvents();

        // Add the load page callback for all the pages
        window.AppNavigation.addCallback('about', About.loadPage, About, [user]);
        window.AppNavigation.addCallback('notes-list', NotesList.loadPage, NotesList, [user]);
        window.AppNavigation.addCallback('login', Login.loadPage, Login, [user]);
        window.AppNavigation.addCallback('profile', Profile.loadPage, Profile, [user]);

        // Initialize pages events
        NotesList.initEvents();

        // Initialize notifications dismiss events
        window.AppNotification.initEvents();

        // Connect the user to the app or redirect him to the login page
        window.AppNavigation.checkLogin(user).then(() => $(`main > ${config.ejs.selectors.loader}`).fadeTo(0, 0));
    }
);
