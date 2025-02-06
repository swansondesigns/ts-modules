/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./**/*.htm'],
	corePlugins: {
		preflight: false // Disables Tailwind's reset
	},
	theme: {
		fontFamily: {
			serif: ['Aleo', '"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif']
		},
		extend: {
			animation: {
				'spin-slow': 'spin 20s linear infinite'
			},
			backgroundImage: {
				'connections-r': "url('https://tristate.coop/sites/default/files/images/electrify-and-save/2023/right-electric-white.svg')",
				'connections-l': "url('https://tristate.coop/sites/default/files/images/electrify-and-save/2023/left-electric-white.svg')",
				'connections-r-grey': "url('https://tristate.coop/sites/default/files/images/electrify-and-save/2023/right-electric-grey.svg')",
				'connections-l-grey': "url('https://tristate.coop/sites/default/files/images/electrify-and-save/2023/left-electric-grey.svg')"
			},
			colors: {
				navy: '#004a76',
				gray: '#dedcd7',
				green: '#b4c757'
			},
			display: ['contents']
		}
	},
	plugins: [
		function ({ addUtilities }) {
			addUtilities({
				'.text-wrap-balance': {
					'text-wrap': 'balance'
				}
			});
		}
	]
};
