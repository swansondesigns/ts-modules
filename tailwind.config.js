/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./**/*.{htm,js}'],
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
