const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const PATHS = require('./paths');

module.exports = {
    entry: {
        main: path.resolve(PATHS.src, 'index.ts'),
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                include: PATHS.src,
                exclude: /node_modules/,
            },
            {
                /**
                 * FIX FOR:
                 *  DevTools failed to load SourceMap:
                 *  Could not load content for webpack://15-puzzle-game/node_modules/sockjs-client/dist/sockjs.js.map:
                 *  HTTP error: status code 404, net::ERR_UNKNOWN_URL_SCHEME
                 *
                 * https://stackoverflow.com/questions/61767538/devtools-failed-to-load-sourcemap-for-webpack-node-modules-js-map-http-e
                 */
                test: /\.js$/,
                enforce: 'pre',
                use: 'source-map-loader',
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.json'],
    },
    output: {
        path: PATHS.build,
        filename: '[name].bundle.js',
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: '15 Puzzle Game',
            template: path.resolve(PATHS.src, 'template.html'),
            filename: 'index.html',
        }),
        new CircularDependencyPlugin({
            exclude: /node_modules/,
            failOnError: true,
            cwd: process.cwd(),
        }),
    ],
};
