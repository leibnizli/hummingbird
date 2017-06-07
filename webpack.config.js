var path = require('path');
var fs = require('fs');
module.exports = [{
    name: "develop",
    entry: "./app/src/entry.js",
    output: {
        path: path.resolve(__dirname, 'app','build'),
        publicPath: "./app/build/",
        filename: "bundle.js"
    },
    externals: [
        function(context, request, cb) {
            if (/^[a-z\-0-9]+$/.test(request)) {
                cb(null, 'commonjs ' + request);
                return;
            }
            cb();
        }
    ],
    module: {
        rules: [{
            test: /\.css$/,
            use: [{
                    loader: "style-loader"
                },

                {
                    loader: "css-loader"
                }
            ]
        }, {
            test: /\.js$/,
            use: [{
                loader: 'babel-loader',
                options: {
                    presets: ['es2015', 'react']
                }
            }]

        }]
    }
}]
