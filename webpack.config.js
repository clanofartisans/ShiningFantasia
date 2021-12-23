const glob = require('glob');
const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
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
            alias: {},
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
        plugins: [
            new webpack.ProgressPlugin(),
        ],
        devtool: 'source-map',
    };

    if (production) {
        delete t.devtool;
    }

    if (target === 'electron-renderer' || target === 'web') {
        t.resolve.alias = {
            // TypeScript path aliases defined in tsconfig.json
            '@common': path.resolve(__dirname, './src/common'),
            '@components': path.resolve(__dirname, './src/renderer/components'),
            '@store': path.resolve(__dirname, './src/renderer/store'),
            '@views': path.resolve(__dirname, './src/renderer/views'),
        };

        t.plugins = [
            new webpack.ProgressPlugin(),
            new webpack.DefinePlugin({
                __VUE_OPTIONS_API__: true,
                __VUE_PROD_DEVTOOLS__: false,
            }),
            new CopyPlugin({
                patterns: [
                    { from: `${path.resolve(__dirname, './src/resources/icon.png')}`, to: `${path.resolve(__dirname, './build/icon.png')}` },
                ],
            }),
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
    const distBuild = env['dist-build'];

    const targets = [
        // clear out the build directory
        {
            output: {
                path: path.resolve(__dirname, 'build'),
            },
            entry: {},
            plugins: [
                new CleanWebpackPlugin(),
            ],
        }
    ];

    if (distBuild) {
        // clear out the dist directory
        targets.push({
            output: {
                path: path.resolve(__dirname, 'dist'),
            },
            entry: {},
            plugins: [
                new CleanWebpackPlugin(),
            ],
        });
    }

    return targets.concat([
        getTarget({
            production,
            target: 'electron-main',
            entry: {main: './src/main/main.ts'},
            output: {path: path.resolve(__dirname, './build/main/')},
            templates: null,
            tsconfig: path.resolve(__dirname, 'tsconfig.json')
        }),
        getTarget({
            production,
            target: 'electron-preload',
            entry: {preload: './src/preload/preload.ts'},
            output: {path: path.resolve(__dirname, './build/preload/')},
            templates: null,
            tsconfig: path.resolve(__dirname, 'src/preload/tsconfig.json')
        }),
        getTarget({
            production,
            // Build as web instead of electron-renderer as
            // nodeIntegration is turned off.
            target: 'web',
            entry: {index: './src/renderer/renderer.ts'},
            output: {path: path.resolve(__dirname, './build/renderer/')},
            templates: [
                {
                    entry: ['index'],
                    template: 'src/templates/index.html',
                    filename: 'index.html',
                }
            ],
            tsconfig: path.resolve(__dirname, 'src/renderer/tsconfig.json')
        }),
    ]);
}
