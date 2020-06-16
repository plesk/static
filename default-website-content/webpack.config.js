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

const getPublicPath = env => env.production
    ? 'https://assets.plesk.com/static/default-website-content/public/'
    : 'http://localhost:8080/public/';

module.exports = env => (['default-website-index', 'default-server-index'].map(entry => ({
    mode: 'none',
    entry: {
        [entry]: './index.js',
        'bundle': './content.js',
    },
    output: {
        path: path.join(__dirname, 'public'),
        filename: '[name].js',
        publicPath: getPublicPath(env),
    },
    optimization: {
        minimize: true,
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            [
                                '@babel/preset-env',
                                {
                                    targets: {
                                        ie: '11',
                                    },
                                },
                            ],
                        ],
                    },
                },
            },
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
                    'to-string-loader',
                    'css-loader',
                ],
            },
        ],
    },
    plugins: [
        new webpack.DefinePlugin({
            __DOMAIN_PAGE__: 'default-website-index' === entry,
            __PUBLIC_PATH__: JSON.stringify(getPublicPath(env)),
        }),
    ],
    devServer: {
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
    },
})));
