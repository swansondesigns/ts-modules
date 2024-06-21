/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./**/*.{htm,js}'],
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
