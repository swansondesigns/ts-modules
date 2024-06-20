/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./**/*.{htm,js}', 'node_modules'],
	theme: {
		extend: {
			colors: {
				'yellow': '#FCB540',
				'maroon': '#B04E3F',
				'green': '#B3C557',
			},
		},
	},
	plugins: [
		function ({ addUtilities }) {
			addUtilities({
				'.text-wrap-balance': {
					'text-wrap': 'balance',
				},
			});
		},
	],
};
