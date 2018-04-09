const path                    = require('path'),
      SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin'),
      WebpackPwaManifest      = require('webpack-pwa-manifest'),
      PUBLIC_PATH             = 'https://todo-list.app/';

module.exports = {
    "entry"  : {
        "main": path.resolve(__dirname, 'js/app.js')
    },
    "output" : {
        "filename"         : "[name].js",
        "path"             : path.resolve(__dirname),
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
        new WebpackPwaManifest(
            {
                "name"            : "Todo-list - WPA",
                "short_name"      : "Todo-list",
                "description"     : "This is a todo-list app like Google Keep",
                "inject"          : false,
                "fingerprints"    : false,
                "ios"             : true,
                "background_color": "#01579b",
                "theme_color"     : "#01579b",
                "theme-color"     : "#01579b",
                "start_url"       : `${PUBLIC_PATH}index.html`,
                "icons"           : [
                    {
                        "src"        : path.resolve(__dirname, 'images/icon.png'),
                        "sizes"      : [96, 128, 192, 256, 384, 512],
                        "destination": path.join('assets', 'icons')
                    }
                ]
            }
        ),
        new SWPrecacheWebpackPlugin(
            {
                "cacheId"                      : "yxJFSPkfxth740gIyPETEJF3Z96nOFvm",
                "dontCacheBustUrlsMatching"    : /\.\w{8}\./,
                "filename"                     : "service-worker.js",
                "minify"                       : true,
                "staticFileGlobs"              : ["index.html", "main.js", "manifest..json", "css/style.css", "images/*.*", "assets/**.*"],
                "mergeStaticsConfig"           : true,
                "navigateFallback"             : `${PUBLIC_PATH}index.html`,
                "staticFileGlobsIgnorePatterns": [/\.map$/]
            }
        )
    ],
    "resolve": {
        "modules": [path.resolve(__dirname, 'node_modules')]
    },
    "target" : "web",
    "devtool": "source-map"
};
