var webpack = require('webpack');

module.exports = {
    entry: "./src/widget.js",
    output: {
        path: __dirname + '/dist',
        filename: "widget.js"
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: "style!css" },
            { test: /\.png$/, loader: "url-loader?mimetype=image/png" },
            { test: /\.html$/, loader: "html" },
            { test: /\.svg$/, loader: 'url-loader' }
        ]
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false }
    })
    ]
};
