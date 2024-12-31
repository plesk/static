// Copyright 1999-2025. WebPros International GmbH. All rights reserved.
const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

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
        minimizer: [
            new TerserPlugin({
                extractComments: false,
            }),
        ],
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
                },
            },
            {
                test: /\.(svg|png|ico|woff2?)$/,
                type: 'asset/resource',
                generator: {
                    filename: '[path][name]-[hash:6][ext]',
                },
            },
            {
                test: /\.css$/,
                use: [
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
})));
