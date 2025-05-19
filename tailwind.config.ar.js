/**
 * Tailwind config for annual report pages.
 *
 * This config inherits all settings from the main Tailwind config
 * (tailwind.config.js) and overrides only the `content` array
 * to scan just the annual-report-*.htm files.
 *
 * Used by scripts like `devar` and `buildar` to generate a slim,
 * purpose-built CSS file for annual reports, without bloating
 * the main Tailwind output.
 */

const baseConfig = require('./tailwind.config.js');

module.exports = {
	...baseConfig,
	content: ['./annual-report-*.htm']
};
