import path from 'path';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import CircularDependencyPlugin from 'circular-dependency-plugin';

export const PATHS = {
    src: path.resolve(__dirname, '..', 'src'),
    build: path.resolve(__dirname, '..', 'build'),
    example: path.resolve(__dirname, '..', 'example'),
};

export default {
    output: {
        path: PATHS.build,
        // filename: '[name].bundle.js',
        filename: 'index.js',
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.json'],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                /**
                 * FIX for:
                 *  ERROR in ./example/index.ts 53:24
                 *  Module parse failed: Unexpected token (53:24)
                 *  You may need an appropriate loader to handle this file type, currently no loaders are configured to process this file. See https://webpack.js.org/concepts#loaders
                 */
                // include: PATHS.src,
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
        new CircularDependencyPlugin({
            exclude: /node_modules/,
            failOnError: true,
            cwd: process.cwd(),
        }),
    ],
};
