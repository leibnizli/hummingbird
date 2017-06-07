var path = require('path');
var fs = require('fs');
module.exports = [{
    name: "develop",
    entry: "./src/entry.js",
    output: {
        path: path.resolve(__dirname,'build'),
        publicPath: "./build/",
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
            use: [ 'style-loader', 'css-loader' ]
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
