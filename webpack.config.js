const path = require('path');

module.exports = {
    context: __dirname + "/src",

    entry: {
        javascript: __dirname + "/src/index.js",
        html: __dirname + "/public/index.html"
    },

    output: {
        filename: "bundle.js",
        path: __dirname + "/dist",
    },

    resolve: {
        extensions: ['', '.js', '.jsx', '.json'],
        root: path.resolve(__dirname, './src/index.js'),
    },

    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: "babel",
                query:{
                    presets:['react']
                }
            },
            {
                test: /\.html$/,
                loader: "file?name=[name].[ext]",
            },
        ],
    },
}