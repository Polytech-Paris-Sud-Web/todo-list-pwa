import $ from 'jquery';
import _extend from 'lodash-es/extend';
import _find from 'lodash-es/find';
import _forEach from 'lodash-es/forEach';
import _replace from 'lodash-es/replace';
import _size from 'lodash-es/size';
import _split from 'lodash-es/split';
import config from './config.js';

export default class Ejs {
    /**
     * Load a page from an EJS template if it is not already loading
     *
     * Easing loader opacity and check for select material init
     *
     * @param {string} pageName - The page name
     * @param {Function} template - An EJS template from ejs-compiled-loader webpack loader
     * @param {string} [pageContainer=''] - The page container DOM selector to insert the template in
     *                                      (default config.navigation.pageSelectors.page)
     * @param {Object} [args={}] - The arguments to pass to the template
     *
     * @returns {boolean} Return true when the loading is done
     */
    static loadPage (pageName, template, pageContainer = '', args = {}) {
        if (!window.AppNavigation.pages[pageName].loaded) {
            Ejs.reloadPage(pageName, template, pageContainer, args);
            window.AppNavigation.pages[pageName].loaded = true;
        }

        return true;
    }

    /**
     * Load a page from an EJS template
     *
     * Easing loader opacity and check for select material init
     *
     * @param {string} pageName - The page name
     * @param {Function} template - An EJS template from ejs-compiled-loader webpack loader
     * @param {string} [pageContainer=''] - The page container DOM selector to insert the template in
     *                                      (default config.navigation.pageSelectors.page)
     * @param {Object} [args={}] - The arguments to pass to the template
     *
     * @returns {boolean} Return true when the loading is done
     */
    static reloadPage (pageName, template, pageContainer = '', args = {}) {
        const page = pageContainer === ''
            ? $(`${config.navigation.pageSelectors.page}[data-url="${pageName}"]`) : $(pageContainer);

        page.find(config.ejs.selectors.loader).fadeTo(0.5, 1);
        page.html(template(_extend({$, _find, _forEach, _size, "gulpTemplateCompile": false}, args)));
        page.find(config.ejs.selectors.loader).fadeTo(0.5, 0);

        Ejs.initAllComponents(page);

        return true;
    }

    /**
     * Insert a template into a DOM block, check for select material init
     *
     * @param {string} divId - The DOM block id to insert the template in
     * @param {Function} template - An EJS template from ejs-compiled-loader webpack loader
     * @param {Object} [args={}] - The arguments to pass to the template
     *
     * @returns {boolean} Return true when the loading is done
     */
    static addTemplateIntoDiv (divId, template, args = {}) {
        const div = $(divId);

        div.html(template(_extend({$, _find, _forEach, _size, _replace, "gulpTemplateCompile": false}, args)));

        Ejs.initAllComponents(div);

        return true;
    }

    /**
     * Insert a template after a DOM block, check for select material init
     *
     * @param {string} divId - The DOM block id to insert the template after
     * @param {Function} template - An EJS template from ejs-compiled-loader webpack loader
     * @param {Object} [args={}] - The arguments to pass to the template
     *
     * @returns {boolean} Return true when the loading is done
     */
    static addTemplateAfterDiv (divId, template, args = {}) {
        const div = $(divId);

        div.after(template(_extend({$, _find, _forEach, _size, _replace, "gulpTemplateCompile": false}, args)));

        Ejs.initAllComponents(div.next());

        return true;
    }

    /**
     * Initialize the materialize selects in the given DOM div
     *
     * @param {jQuery} div - DOM jQuery div
     *
     * @returns {undefined}
     */
    static initSelects (div) {
        const selects = div.find('select');

        if (selects.length > 0) {
            selects.each((index, select) => {
                window.M.FormSelect.init(select);
            });
        }
    }

    /**
     * Initialize the materialize text input in the given DOM div
     *
     * @param {jQuery} div - DOM jQuery div
     *
     * @returns {undefined}
     */
    static initTextInputs (div) {
        const textInputs = div.find('input[type="text"]');

        if (textInputs.length > 0) {
            textInputs.each((index, textInput) => {
                if ($(textInput).val() !== '') {
                    div.find(`label[for="${$(textInput).attr('id')}"]`).addClass('active');
                }
            });
        }
    }

    /**
     * Initialize the materialize textareas in the given DOM div
     *
     * @param {jQuery} div - DOM jQuery div
     *
     * @returns {undefined}
     */
    static initTextareas (div) {
        const textareas = div.find('.materialize-textarea');

        if (textareas.length > 0) {
            textareas.each((index, textarea) => {
                $(textarea).val($(textarea).attr('data-value'));
                window.M.textareaAutoResize($(textarea));
                div.find(`label[for="${$(textarea).attr('id')}"]`).addClass('active');
            });
        }
    }

    /**
     * Initialize the materialize chips in the given DOM div
     *
     * @param {jQuery} div - DOM jQuery div
     *
     * @returns {undefined}
     */
    static initChips (div) {
        const chips = div.find('.chips');

        if (chips.length > 0) {
            chips.each((index, chip) => {
                const data = [];

                _forEach(
                    _split($(chip).attr('data-initial-values'), config.ejs.chipsDataSeparator),
                    (tag) => data.push({tag})
                );

                $(chip).material_chip(
                    {
                        "placeholder"         : $(chip).attr('data-placeholder'),
                        "secondaryPlaceholder": $(chip).attr('data-secondary-placeholder'),
                        data
                    }
                );
            });
        }
    }

    /**
     * Initialize the materialize FAPs in the given DOM div
     *
     * @param {jQuery} div - DOM jQuery div
     *
     * @returns {undefined}
     */
    static initFaps (div) {
        const faps = div.find('.fixed-action-btn');

        if (faps.length > 0) {
            faps.each((index, fap) => {
                window.M.FloatingActionButton.init($(fap), {
                    "direction": $(fap).attr('data-direction') || "top",
                    "hoverEnabled": $(fap).attr('data-hover-enabled') === "true"
                });
            });
        }
    }

    /**
     * Initialize the materialize tooltips in the given DOM div
     *
     * @param {jQuery} div - DOM jQuery div
     *
     * @returns {undefined}
     */
    static initTooltips (div) {
        const tooltips = div.find('.tooltipped');

        if (tooltips.length > 0) {
            tooltips.each((index, tooltip) => {
                window.M.Tooltip.init($(tooltip));
            });
        }
    }

    /**
     * Initialize all the materialize components in the given DOM div
     *
     * @param {jQuery} div - DOM jQuery div
     *
     * @returns {undefined}
     */
    static initAllComponents (div) {
        Ejs.initSelects(div);
        Ejs.initTextInputs(div);
        Ejs.initTextareas(div);
        Ejs.initChips(div);
        Ejs.initFaps(div);
        Ejs.initTooltips(div);
    }
}
