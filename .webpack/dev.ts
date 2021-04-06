// import webpack, { Configuration as WebpackConfiguration } from 'webpack';
// import { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server';
// import { merge } from 'webpack-merge';
import path from 'path';
import webpack from 'webpack';
import { mergeWithRules, CustomizeRule } from 'webpack-merge';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import common, { PATHS } from './common';

// fix for error: 'devServer' does not exist in type 'Configuration'.
// https://github.com/DefinitelyTyped/DefinitelyTyped/issues/27570#issuecomment-474628163
// interface Configuration extends WebpackConfiguration {
//     devServer?: WebpackDevServerConfiguration;
// }

export default mergeWithRules({
    module: {
        rules: {
            test: CustomizeRule.Merge,
        },
    },
})(common, {
    mode: 'development',
    entry: {
        main: path.resolve(PATHS.example, 'index.ts'),
    },
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
        new HtmlWebpackPlugin({
            title: '15 Puzzle Game',
            template: path.resolve(PATHS.example, 'template.html'),
            filename: 'index.html',
        }),
        new webpack.HotModuleReplacementPlugin(),
    ],
});
