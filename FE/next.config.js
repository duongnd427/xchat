const withCSS = require('@zeit/next-css');
const withSass = require('@zeit/next-sass');
const withImages = require('next-images');
const withFonts = require('next-fonts');

module.exports = withCSS(
	withSass(
		withFonts({
			webpack(config) {
				config.module.rules.push({
					test: /\.(eot|woff|woff2|ttf|svg|png|jpg|gif)$/,
					use: {
						loader: 'url-loader',
						options: {
							limit: 100000,
							name: '[name].[ext]',
						},
					},
				});
				return config;
			},
		})
	)
);
