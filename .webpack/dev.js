const webpack = require('webpack')
const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./common');

const PATHS = {
    // src: path.resolve(__dirname, '..', 'src'),
    build: path.resolve(__dirname, '..', 'build'),
};

module.exports = merge(common, {
    mode: 'development',
    devtool: 'eval',
    devServer: {
        historyApiFallback: true,
        contentBase: PATHS.build,
        open: true,
        compress: true,
        hot: true,
        port: 8080,
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
    ],
});
