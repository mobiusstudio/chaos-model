var path = require('path')
var webpack = require('webpack')
var config = {
  context: path.resolve(__dirname, './src'),
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, './build'),
    filename: 'index.js',
  },
	target: 'node',
	devtool: 'source-map',
  mode: 'production',
	module: {
		rules: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				include: [
					path.resolve(__dirname, './src'),
				],
			},
		],
	},
	resolve: {
		modules: [
			path.resolve(__dirname, './src'),
			'node_modules',
		],
		extensions: ['.webpack.js', '.web.js', '.js', '.jsx', '.json'],
	},
}

module.exports = config