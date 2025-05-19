module.exports = {
	plugins: {
		'postcss-import': {},
		tailwindcss: { config: process.env.TAILWIND_CONFIG || './tailwind.config.js' },
		autoprefixer: {},
		cssnano: {
			preset: 'default'
		}
	}
};
