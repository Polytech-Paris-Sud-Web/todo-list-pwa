const path = require('path');

module.exports = {
    "entry"  : {
        "main": path.resolve(__dirname, 'js/app.js')
    },
    "output" : {
        "filename"         : "[name].js",
        "path"             : path.resolve(__dirname, 'js'),
        "sourceMapFilename": "[name].js.map"
    },
    "module" : {
        "loaders": [
            {"test": /\.js/, "exclude": /node_modules/, "loader": "babel-loader"},
            {"test": /\.json$/, "loader": "json-loader"},
            {"test": /\.ejs$/, "loader": "ejs-compiled-loader"}
        ]
    },
    "resolve": {
        "modules": [path.resolve(__dirname, "node_modules")]
    },
    "target" : "web",
    "devtool": "source-map"
};
