const glob = require('glob');
const path = require('path');
const { merge } = require('webpack-merge');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PurgeCSSPlugin = require('purgecss-webpack-plugin');

const { VueLoaderPlugin } = require('vue-loader');

function getHtmlPlugins(production, entries) {
    const plugins = [];
    for (const {entry, template, filename} of entries) {
        plugins.push(new HtmlWebpackPlugin({
            filename: filename,
            template: template,
            chunks: entry,
            production: production,
        }));
    }

    return plugins;
}

function getTarget({ production, target, entry, output, templates, tsconfig }) {
    const t = {
        target,
        mode: production ? 'production' : 'development',
        entry,
        output,
        resolve: {
            extensions: ['.ts', '.tsx', '.js'],
        },
        optimization: {
            splitChunks: {
                cacheGroups: {
                    styles: {
                        name: 'styles',
                        test: /\.css$/,
                        chunks: 'all',
                        enforce: true
                    }
                }
            }
        },
        module: {
            rules: [{
                    test: /\.tsx?$/i,
                    loader: 'ts-loader',
                    options: {
                        appendTsSuffixTo: [/\.vue$/],
                        configFile: tsconfig,
                    },
                    exclude: /node_modules/,
                },
                {
                  test: /\.vue$/i,
                  loader: 'vue-loader',
                },
                {
                    test: /\.css$/i,
                    use: [
                        MiniCssExtractPlugin.loader,
                        // 'vue-style-loader',
                        'css-loader',
                    ]
                },
                {
                    test: /\.s[ac]ss$/i,
                    use: [
                        MiniCssExtractPlugin.loader,
                        // 'vue-style-loader',
                        'css-loader',
                        {
                            loader: 'sass-loader',
                            options: {
                                sassOptions: {
                                    indentedSyntax: true,
                                }
                            },
                        }
                    ]
                },
                {
                    test: /\.(vert|frag|glsl)$/i,
                    type: 'asset/source',
                },
                {
                    test: /\.js$/i,
                    enforce: 'pre',
                    use: [
                        'source-map-loader',
                    ]
                }
            ]
        },
        plugins: [],
        devtool: 'source-map',
    };

    if (production) {
        delete t.devtool;
    }

    if (target === 'electron-renderer' || target === 'web') {
        t.plugins = [
            ...getHtmlPlugins(production, templates),
            new MiniCssExtractPlugin(),
            new PurgeCSSPlugin({
                paths: glob.sync(`${path.resolve(__dirname, './src')}/**/*`, {
                    nodir: true
                }),
                defaultExtractor(content) {
                    const contentWithoutStyleBlocks = content.replace(/<style[^]+?<\/style>/gi, '')
                    return contentWithoutStyleBlocks.match(/[A-Za-z0-9-_/:]*[A-Za-z0-9-_/]+/g) || []
                },
                safelist: [/-(leave|enter|appear)(|-(to|from|active))$/, /^(?!(|.*?:)cursor-move).+-move$/, /^router-link(|-exact)-active$/, /data-v-.*/],
            }),
            new VueLoaderPlugin(),
        ];
    }

    return t;
}

module.exports = function (env, argv) {
    const production = argv.mode == 'production';

    return [
        getTarget({
            production,
            target: 'electron-main',
            entry: {main: './src/main/main.ts'},
            output: {path: path.resolve(__dirname, './dist/main/')},
            templates: null,
            tsconfig: path.resolve(__dirname, './tsconfig.json')
        }),
        getTarget({
            production,
            target: 'electron-preload',
            entry: {preload: './src/preload/preload.ts'},
            output: {path: path.resolve(__dirname, './dist/preload/')},
            templates: null,
            tsconfig: path.resolve(__dirname, './tsconfig.preload.json')
        }),
        getTarget({
            production,
            // Build as web instead of electron-renderer as
            // nodeIntegration is turned off.
            target: 'web',
            entry: {index: './src/renderer/renderer.ts'},
            output: {path: path.resolve(__dirname, './dist/renderer/')},
            templates: [
                {
                    entry: ['index'],
                    template: 'src/templates/index.html',
                    filename: 'index.html',
                }
            ],
            tsconfig: path.resolve(__dirname, './tsconfig.renderer.json')
        }),
    ];
}
