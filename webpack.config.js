const path = require('path');
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const baseConfig = {
    entry: path.resolve(__dirname, './src/main.ts'),
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.s?css$/i,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.html$/i,
                use: "html-loader",
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/,
                type: 'asset/resource'
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist'),
        assetModuleFilename: 'assets/img/[name][ext]'
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, './src/index.html'),
            filename: 'index.html',
        }),
        new CopyPlugin({
            patterns: [
                { 
                    from: 'src/components/**/*.html' ,
                    to: 'pages/[name].html',
                    globOptions: {
                        ignore: ['*.ts', '*.scss'],
                    }
                },
                { 
                    from: 'src/redirects' ,
                    to: '',
                    globOptions: {
                        ignore: ['*.ts', '*.scss'],
                    }
                },
            ],
          }),
        //new CleanWebpackPlugin(),
    ],
};

module.exports = ({ mode }) => {
    const isProductionMode = mode === 'prod';
    const envConfig = isProductionMode ? require('./webpack.prod.config') : require('./webpack.dev.config');

    return merge(baseConfig, envConfig);
};