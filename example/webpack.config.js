const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const argv = require('optimist').argv;

const WebpackFreeTexPacker = require('webpack-free-tex-packer');

let entry = [
    './src/index'
];

let devtool = 'eval-source-map';
let output = 'index.js';
let NODE_ENV = argv.build ? 'production': 'development';

let plugins = [];

plugins.push(new CopyWebpackPlugin([{from: 'src/resources', to: './'}]));

plugins.push(new webpack.DefinePlugin({
	'process.env.NODE_ENV': JSON.stringify(NODE_ENV)
}));

let packOptions = {
	textureName: 'atlas',
	width: 512,
	height: 512,
	fixedSize: false,
	padding: 2,
	allowRotation: true,
	detectIdentical: true,
	allowTrim: true,
	exporter: "Pixi",
	removeFileExtension: false,
	prependFolderName: true
};

let src = [];
src.push(path.resolve(__dirname, 'atlases/10.png'));
src.push(path.resolve(__dirname, 'atlases/11.png'));
src.push(path.resolve(__dirname, 'atlases/12.png'));
src.push(path.resolve(__dirname, 'atlases/dir1'));
src.push(path.resolve(__dirname, 'atlases/dir2/.'));

plugins.push(new WebpackFreeTexPacker(src, 'assets', packOptions));

if(!argv.build) {
    entry.push('webpack-dev-server/client?http://localhost:8080');
}

let config = {
    entry: entry,
    output: { filename: output },
    devtool: devtool,
	mode: NODE_ENV,
    module: {
        rules: [
            {
                test: /\.js$/,
                include: [
                    path.resolve(__dirname, 'src')
                ],
                use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env']
					}
				}
            }
        ]
    },
    plugins: plugins
};

module.exports = config;