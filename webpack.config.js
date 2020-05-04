const path = require('path'),
	HTMLlWebpackPlugin = require('html-webpack-plugin'),
	{CleanWebpackPlugin} = require('clean-webpack-plugin'),
	MiniCssExtractPlugin = require('mini-css-extract-plugin'),
	OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin'),
	TerserPlugin = require('terser-webpack-plugin')

// DEVELOPMENT OR PRODUCTION STATUS
const isDev = process.env.NODE_ENV === 'development'

// GET FILE NAME FOR DEVELOPMENT
const filename = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`

// OPTIMIZATION MINIFY FILE
const optimization = () => {
	const config = {splitChunks: {chunks: "all"}}
	if (!isDev) {
		config.minimizer = [
			new OptimizeCssAssetsPlugin(),
			new TerserPlugin()
		]
	}
	return config
}

// CSS LOADERS OPTIMIZATION
const cssLoaders = extra => {
	const loaders = [
		{
			loader: MiniCssExtractPlugin.loader,
			options: {
				hmr: isDev,
				reloadAll: true
			}
		},
		'css-loader',
	]
	if (extra) loaders.push(extra)
	return loaders
}

module.exports = {
	context: path.resolve(__dirname, 'src'),
	mode: 'development',
	entry: {
		main: ['@babel/polyfill', './index.js'],
		analytics: './analytics.js'
	},
	output: {
		filename: filename('js'),
		path: path.resolve(__dirname, 'dist')
	},
	optimization: optimization(),
	devServer: {
		port: 4200,
		hot: isDev
	},
	plugins: [
		new HTMLlWebpackPlugin({
			template: './index.html',
			minify: {
				collapseWhitespace: !isDev
			}
		}),
		new CleanWebpackPlugin(),
		new MiniCssExtractPlugin({filename: filename('css')}),
	],
	module: {
		rules: [
			{ // CSS
				test: /\.css$/,
				use: cssLoaders()
			},
			{	// SASS
				test: /\.s[ac]ss$/,
				use: cssLoaders('sass-loader')
			},
			{ // IMAGES
				test: /\.(png|jpg|svg|gif)$/,
				use: ['file-loader']
			},
			{ // FONTS
				test: /\.(ttf|woff|woff2|eot)$/,
				use: ['file-loader']
			},
			{ // BABEL
				test: /\.js$/,
				exclude: /node_modules/,
				loader: {
					loader: 'babel-loader',
					options: {
						presets: [
							'@babel/preset-env'
						],
						plugins: [
							'@babel/plugin-proposal-class-properties'
						]
					}
				}
			}
		]
	}
}