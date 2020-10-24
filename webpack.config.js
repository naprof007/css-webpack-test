const path = require('path');
const fs = require('fs');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const RemovePlugin = require('remove-files-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const srcFolder = './src/';
const distFolder = './dist/';
const cssNamePostfix = '.min'; // for example, to convert css filenames like styles.css => styles.min.css

let entry = {
    script: srcFolder + 'index.js',
}
const filenames =  fs.readdirSync(path.resolve(__dirname, srcFolder));
const cssFiles = filenames.filter(filename => /\.css$/.test(filename));
const removeAfter = []
cssFiles.forEach(cssName => {
    let match = cssName.match(/(.+)\.css$/);
    entry[match[1]] = srcFolder + match[0];
    removeAfter.push(match[1] + '.js');
});

module.exports = {
    entry,
    output: {
        path: path.resolve(__dirname, distFolder),
    },
    devServer: {
        contentBase: distFolder,
        overlay: true,
    },
    plugins: [
        // Tell CleanWebpackPlugin that we don't want to remove the index.html file after the incremental build
        // triggered by watch. We do this with the cleanStaleWebpackAssets option
        new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
        new MiniCssExtractPlugin({
            filename: `[name]${cssNamePostfix}.css`,
            ignoreOrder: false, // Enable to remove warnings about conflicting order
        }),
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.css$/g,
            cssProcessor: require('cssnano'),
            cssProcessorPluginOptions: {
                preset: ['default', { discardComments: { removeAll: true } }],
            },
            canPrint: true
        }),
        new RemovePlugin({
            after: {
                root: distFolder,
                include: removeAfter,
            }
        }),
        new CopyPlugin([
            {
                from: path.resolve(srcFolder, 'index.html'),
            }
        ]),
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                ],
            },
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        // presets: ['@babel/preset-env'],
                        presets: [['@babel/preset-env', {
                            'useBuiltIns': 'usage', // false, entry, usage
                            'corejs': '3.6.5',
                            'targets': {
                                'esmodules': true,
                                'ie': '11',
                            },
                        }]],
                        plugins: [
                            '@babel/plugin-transform-runtime',
                            '@babel/plugin-transform-modules-commonjs',
                        ]
                    }
                }
            },
        ],
    },
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                uglifyOptions: {
                    ie8: true,
                }
            })
        ]
    }
};
