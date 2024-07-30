/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./**/*.{htm,js}'],
	theme: {
		fontFamily: {
			'serif': ['Aleo', '"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
		},
		extend: {
			animation: {
				'spin-slow': 'spin 20s linear infinite',
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
