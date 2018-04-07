/**
 * Gulp 4 implementation using es6
 */

import chalk            from 'chalk';
import childProcess     from 'child_process';
import del              from 'del';
import gulp             from 'gulp';
import gulpAutoprefixer from 'gulp-autoprefixer';
import gulpEjs          from 'gulp-ejs';
import gulpEslint       from 'gulp-eslint';
import gulpHtmlBeautify from 'gulp-html-beautify';
import gulpLog          from 'gulplog';
import gulpRename       from 'gulp-rename';
import gulpSass         from 'gulp-sass';
import gulpSourcemaps   from 'gulp-sourcemaps';
import _                from 'lodash';

const npmDirectory = 'node_modules',
      paths        = {
          'sass'   : {
              'src'  : 'sass/app.scss',
              'watch': 'sass/**/*.scss',
              'dest' : 'css'
          },
          'js'     : {
              'src'  : [
                  'js/**/*.js'
              ],
              'watch': [
                  'js/**/*.js'
              ],
              'dest' : 'js'
          },
          'ejs'    : {
              'main' : 'ejs/index.ejs',
              'watch': 'ejs/**/*.ejs',
              'dest' : {
                  'path'    : '.',
                  'fileName': 'index.html'
              }
          },
          'vendors': {
              'sass' : [
                  {
                      'src' : [
                          `${npmDirectory}/materialize-css/sass/**/*.scss`,
                          `!${npmDirectory}/materialize-css/sass/components/_variables.scss`
                      ],
                      'dest': 'sass/vendors/materialize'
                  },
                  {
                      'src' : `${npmDirectory}/roboto-fontface/css/roboto/sass/**/*.scss`,
                      'dest': 'sass/vendors/roboto-fontface'
                  },
                  {
                      'src' : `${npmDirectory}/@fortawesome/fontawesome-free/scss/*.scss`,
                      'dest': 'sass/vendors/fontawesome'
                  }
              ],
              'fonts': [
                  {
                      'src' : [
                          `${npmDirectory}/material-design-icons/iconfont/MaterialIcons-Regular.woff2`,
                          `${npmDirectory}/material-design-icons/iconfont/MaterialIcons-Regular.woff`,
                          `${npmDirectory}/material-design-icons/iconfont/MaterialIcons-Regular.ttf`
                      ],
                      'dest': 'fonts/material-design-icons'
                  },
                  {
                      'src' : `${npmDirectory}/roboto-fontface/fonts/roboto/*`,
                      'dest': 'fonts/roboto'
                  },
                  {
                      'src' : `${npmDirectory}/@fortawesome/fontawesome-free/webfonts/*`,
                      'dest': 'fonts/fontawesome'
                  }
              ]
          }
      };

/**
 * --------------------------------------------------------------------------
 * Vendors
 * --------------------------------------------------------------------------
 */

/**
 * Download vendors dependencies in `npmDirectory` directory
 *
 * @param {Function} cb - Callback to call when the process exited
 *
 * @returns {*} Gulp callback
 */
export function vendorsDownload (cb) {
    childProcess.execSync('npm install', {"stdio": [0, 1, 2]});

    return cb();
}

/**
 * Move sass vendors files into `paths.vendors.sass.dest` directory
 *
 * @param {Function} cb - Callback to call when the process exited
 *
 * @returns {*} Gulp callback
 */
export function vendorsMoveSass (cb) {
    const promises = [];

    _.forEach(paths.vendors.sass, (vendor) => {
        promises.push(new Promise((resolve, reject) => {
            gulp.src(vendor.src).pipe(gulp.dest(vendor.dest))
                .on('end', resolve)
                .on('error', reject);
        }));
    });

    Promise.all(promises).then(() => cb());
}

/**
 * Move fonts vendors files into `paths.vendors.fonts.dest` directory
 *
 * @param {Function} cb - Callback to call when the process exited
 *
 * @returns {*} Gulp callback
 */
export function vendorsMoveFonts (cb) {
    const promises = [];

    _.forEach(paths.vendors.fonts, (vendor) => {
        promises.push(new Promise((resolve, reject) => {
            gulp.src(vendor.src).pipe(gulp.dest(vendor.dest))
                .on('end', resolve)
                .on('error', reject);
        }));
    });

    Promise.all(promises).then(() => cb());
}

/**
 * Clean vendors dependencies in js, fonts and sass source files (not in `npmDirectory`)
 *
 * @returns {*} Gulp callback
 */
export function vendorsClean () {
    return del([
        'js/vendor.js',
        'js/vendor.js.map',
        'fonts',
        'sass/vendors/**',
        '!sass/vendors',
        '!sass/vendors/materialize',
        '!sass/vendors/materialize/components',
        '!sass/vendors/materialize/components/_variables.scss',
        '!sass/vendors/fontawesome',
        '!sass/vendors/fontawesome/_variables.scss'
    ]);
}

/**
 * Wrapper for vendorsDownload and vendorsClean then vendorsMoveSass and vendorsMoveFonts
 */
gulp.task(
    'vendors',
    gulp.series(
        gulp.parallel(vendorsDownload, vendorsClean),
        gulp.parallel(vendorsMoveSass, vendorsMoveFonts)
    )
);

/**
 * --------------------------------------------------------------------------
 * EJS
 * --------------------------------------------------------------------------
 */

/**
 * Compile the main EJS file located in `paths.ejs.main` and output the result to
 * `paths.ejs.dest.path`/`paths.ejs.dest.fileName`
 *
 * @returns {*|Stream} Gulp callback
 */
export function ejs () {
    return gulp.src(paths.ejs.main)
               .pipe(gulpEjs({_, "gulpTemplateCompile": true}, {"root": __dirname}))
               .pipe(gulpRename(paths.ejs.dest.fileName))
               .pipe(gulp.dest(paths.ejs.dest.path));
}

/**
 * Beautify the ejs HTML result
 *
 * @returns {*|Stream} Gulp callback
 */
export function htmlBeautify () {
    return gulp.src(`${paths.ejs.dest.path}/${paths.ejs.dest.fileName}`)
               .pipe(gulpHtmlBeautify())
               .pipe(gulp.dest(paths.ejs.dest.path));
}

/**
 * Wrapper for ejs then htmlBeautify
 */
gulp.task('html', gulp.series(ejs, htmlBeautify));

/**
 * --------------------------------------------------------------------------
 * Sass
 * --------------------------------------------------------------------------
 */

/**
 * Compile sass files and generate map in .css result file
 *
 * @returns {*|Stream} Gulp callback
 */
export function sassDev () {
    return gulp.src(paths.sass.src)
               .pipe(gulpSourcemaps.init())
               .pipe(gulpSass({'outputStyle': 'compressed'}).on('error', gulpSass.logError))
               .pipe(gulpAutoprefixer())
               .pipe(gulpSourcemaps.write())
               .pipe(gulpRename('style.css'))
               .pipe(gulp.dest(paths.sass.dest));
}

/**
 * Compile sass files in a .css file
 *
 * @returns {*|Stream} Gulp callback
 */
export function sassProd () {
    return gulp.src(paths.sass.src)
               .pipe(gulpSass({'outputStyle': 'compressed'}).on('error', gulpSass.logError))
               .pipe(gulpAutoprefixer())
               .pipe(gulpRename('style.css'))
               .pipe(gulp.dest(paths.sass.dest));
}

/**
 * --------------------------------------------------------------------------
 * JavaScript
 * --------------------------------------------------------------------------
 */

/**
 * Build the js source files into www/js/main.js and www/js/vendor.js
 *
 * @param {Function} cb - Callback to call when the process exited
 *
 * @returns {*} Gulp callback
 */
export function buildJs (cb) {
    childProcess.execSync('npm run build', {"stdio": [0, 1, 2]});

    return cb();
}

/**
 * Build the js source files into www/js/main.js and www/js/vendor.js with production optimization
 *
 * @param {Function} cb - Callback to call when the process exited
 *
 * @returns {*} Gulp callback
 */
export function buildJsProd (cb) {
    childProcess.execSync('npm run build-prod', {"stdio": [0, 1, 2]});

    return cb();
}

/**
 * --------------------------------------------------------------------------
 * Watchers
 * --------------------------------------------------------------------------
 */

/**
 * Watch sass and js files and build with sassDev or buildJs on files change
 *
 * @returns {undefined}
 */
export function watch () {
    const sassWatcher = gulp.watch(paths.sass.watch, gulp.series(sassDev)),
          jsWatcher   = gulp.watch(paths.js.watch, gulp.series(buildJs)),
          ejsWatcher  = gulp.watch(paths.ejs.watch, gulp.series(ejs, buildJs));

    sassWatcher.on(
        'change', (path) => {
            gulpLog.info(`File ${chalk.magenta(path)} was changed`);
        }
    );

    jsWatcher.on(
        'change', (path) => {
            gulpLog.info(`File ${chalk.magenta(path)} was changed`);
        }
    );

    ejsWatcher.on(
        'change', (path) => {
            gulpLog.info(`File ${chalk.magenta(path)} was changed`);
        }
    );
}

/**
 * --------------------------------------------------------------------------
 * Init / build
 * --------------------------------------------------------------------------
 */

/**
 * Wrapper for initialize all the project
 */
gulp.task('init', gulp.series('vendors', gulp.parallel('html', sassDev), buildJs));

/**
 * Wrapper to build the project in production
 */
gulp.task('build', gulp.series('vendors', gulp.parallel(ejs, sassProd), buildJsProd));

/**
 * --------------------------------------------------------------------------
 * Linter
 * --------------------------------------------------------------------------
 */

/**
 * Lint js files with eslint linter
 *
 * @returns {*|Stream} Gulp callback
 */
export function eslint () {
    return gulp.src(paths.js.src)
               .pipe(gulpEslint({"fix": true}))
               .pipe(
                   gulpEslint.result(
                       (result) => {
                           console.log(`ESLint result: ${result.filePath}`);
                           console.log(`# Messages: ${result.messages.length}`);
                           console.log(`# Warnings: ${result.warningCount}`);
                           console.log(`# Errors: ${result.errorCount}`);
                       }
                   )
               )
               .pipe(gulpEslint.format())
               .pipe(gulpEslint.failAfterError());
}

/**
 * --------------------------------------------------------------------------
 * jsDoc
 * --------------------------------------------------------------------------
 */

/**
 * Generate the jsdoc in storage/app/public/jsDoc
 *
 * @todo check where to put the documentation based on laravel architecture (storage/app/public/jsDoc)
 *
 * @param {Function} done Callback to sync
 *
 * @returns {*} Gulp callback
 */
export function jsdoc (done) {
    childProcess.exec(
        '"./node_modules/.bin/jsdoc"' +
        ' -c jsdocConfig.json' +
        ' -r -t ./node_modules/ink-docstrap/template --verbose',
        (err) => {
            done(err);
        }
    ).stdout.on('data', (data) => console.log(data));
}
