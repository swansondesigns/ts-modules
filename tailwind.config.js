/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./**/*.htm'],
	theme: {
		fontFamily: {
			'serif': ['Aleo', '"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
		},
		extend: {
			colors: {
				navy: '#004a76',
				gray: '#dedcd7',
			},
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
