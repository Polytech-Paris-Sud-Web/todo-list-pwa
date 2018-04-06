const path                    = require('path'),
      SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin'),
      WebpackPwaManifest      = require('webpack-pwa-manifest'),
      PUBLIC_PATH             = 'https://todo-list.laneuville.me/';

module.exports = {
    "entry"  : {
        "main": path.resolve(__dirname, 'js/app.js')
    },
    "output" : {
        "filename"         : "[name].js",
        "path"             : path.resolve(__dirname, 'js'),
        "publicPath"       : PUBLIC_PATH,
        "sourceMapFilename": "[name].js.map"
    },
    "module" : {
        "loaders": [
            {"test": /\.js/, "exclude": /node_modules/, "loader": "babel-loader"},
            {"test": /\.json$/, "loader": "json-loader"},
            {"test": /\.ejs$/, "loader": "ejs-compiled-loader"}
        ]
    },
    "plugins": [
        new SWPrecacheWebpackPlugin(
            {
                cacheId: 'yxJFSPkfxth740gIyPETEJF3Z96nOFvm',
                dontCacheBustUrlsMatching: /\.\w{8}\./,
                filename: 'service-worker.js',
                minify: false, //@todo true
                navigateFallback: PUBLIC_PATH + 'index.html',
                staticFileGlobsIgnorePatterns: [/\.map$/, /manifest\.json$/]
            }
        ),
        new WebpackPwaManifest(
            {
                name            : 'Todo-list - WPA',
                short_name      : 'Todo-list',
                description     : 'This is a todo-list app like Google Keep',
                background_color: '#01579b',
                theme_color     : '#01579b',
                'theme-color'   : '#01579b',
                start_url       : '/',
                icons           : [
                    {
                        src        : path.resolve(__dirname, 'images/icon.png'),
                        sizes      : [96, 128, 192, 256, 384, 512],
                        destination: path.join('assets', 'icons')
                    }
                ]
            }
        )
    ],
    "resolve": {
        "modules": [path.resolve(__dirname, 'node_modules')]
    },
    "target" : "web",
    "devtool": "source-map"
};