// Copyright 1999-2020. Plesk International GmbH. All rights reserved.
const path = require('path');
const webpack = require('webpack');

const fileLoader = {
    loader: 'file-loader',
    options: {
        name: '[path][name]-[hash:6].[ext]',
        esModule: false,
    },
};

module.exports = env => (['default-website-index', 'default-server-index'].map(entry => ({
    mode: 'none',
    entry: {
        [entry]: './index.js',
    },
    output: {
        path: path.join(__dirname, 'public'),
        filename: '[name].js',
        publicPath: env.production
            ? 'https://assets.plesk.com/static/default-website-content/public/'
            : 'http://localhost:8080/public/',
    },
    optimization: {
        minimize: true,
    },
    module: {
        rules: [
            {
                test: /\.mustache$/,
                exclude: /node_modules/,
                use: {
                    loader: 'html-loader',
                    options: {
                        minimize: true,
                        ignoreCustomFragments: [ /{{.*?}}/ ],
                        attrs: [
                            'img:src',
                            'link:href',
                        ],
                    },
                },
            },
            {
                test: /\.(svg|png|ico|woff2?)$/,
                use: fileLoader,
            },
            {
                test: /\.css$/,
                use: [
                    fileLoader,
                    'extract-loader',
                    'css-loader',
                ],
            },
        ],
    },
    plugins: [
        new webpack.DefinePlugin({
            __DOMAIN_PAGE__: 'default-website-index' === entry,
        }),
    ],
    devServer: {
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
    },
})));
