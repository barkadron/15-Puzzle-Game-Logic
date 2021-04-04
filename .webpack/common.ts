import path from 'path';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CircularDependencyPlugin from 'circular-dependency-plugin';

export const PATHS = {
    src: path.resolve(__dirname, '..', 'src'),
    build: path.resolve(__dirname, '..', 'build'),
};

export default {
    entry: {
        main: path.resolve(PATHS.src, 'index.ts'),
    },
    output: {
        path: PATHS.build,
        filename: '[name].bundle.js',
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.json'],
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
