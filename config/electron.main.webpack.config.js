const webpack = require('webpack')
const path = require('path')

const config = {
    devtool: 'source-map',
    entry: ['babel-polyfill', './main.js'],
    output: {
        path: path.join(__dirname, '..', 'build'),
        filename: 'main.js'
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        })
    ],

    /**
     * https://github.com/chentsulin/webpack-target-electron-renderer#how-this-module-works
     */
    target: 'electron-main',
    node: {
        __dirname: false,
        __filename: false
    },
};

module.exports = config
