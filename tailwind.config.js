/** @type {import('tailwindcss').Config} */
const defaultColors = require('tailwindcss/colors');

module.exports = {
	content: ['./**/*.htm'],
	corePlugins: {
		preflight: false // Disables Tailwind's reset
	},
	theme: {
		colors: {
			...defaultColors,
			navy: '#004a76',
			gray: '#dedcd7',
			'gray-dark': '#404040',
			'gray-light': '#f5f5f5',
			green: '#b4c757'
		},
		fontFamily: {
			serif: ['Aleo', '"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif']
		},
		extend: {
			animation: {
				'spin-slow': 'spin 20s linear infinite',
				'fade-in': 'fadeIn 0.3s ease-in',
				'slide-in': 'slideIn 0.3s ease-out'
			},
			keyframes: {
				fadeIn: {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' }
				},
				slideIn: {
					'0%': { transform: 'translateY(-50px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				}
			},
			backgroundImage: {
				'connections-r': "url('https://tristate.coop/sites/default/files/images/electrify-and-save/2023/right-electric-white.svg')",
				'connections-l': "url('https://tristate.coop/sites/default/files/images/electrify-and-save/2023/left-electric-white.svg')",
				'connections-h': "url('https://tristate.coop/sites/default/files/images/electrify-and-save/electric-white.svg')",
				'connections-r-grey': "url('https://tristate.coop/sites/default/files/images/electrify-and-save/2023/right-electric-grey.svg')",
				'connections-l-grey': "url('https://tristate.coop/sites/default/files/images/electrify-and-save/2023/left-electric-grey.svg')"
			},

			display: ['contents'],
			gridTemplateColumns: {
				16: 'repeat(16, minmax(0, 1fr))'
			}
		}
	},
	plugins: [
		function ({ addUtilities }) {
			addUtilities(
				{
					'.text-wrap-balance': {
						'text-wrap': 'balance'
					},
					'.hideme': {
						display: 'none'
					},
					'.loading-spinner': {
						animation: 'spin 1s ease-in-out infinite'
					}
				},
				['responsive']
			);
		}
	]
};
