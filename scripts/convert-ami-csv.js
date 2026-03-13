const fs = require('fs');
const path = require('path');

const DEFAULT_INPUT = path.resolve(process.cwd(), 'assets/other/26 03 11 AMI_Combined - 2025.csv');
const DEFAULT_OUTPUT = path.resolve(process.cwd(), 'assets/other/ami-combined-2025.json');

const inputPath = path.resolve(process.cwd(), process.argv[2] || DEFAULT_INPUT);
const outputPath = path.resolve(process.cwd(), process.argv[3] || DEFAULT_OUTPUT);

function parseCsvLine(line) {
	const columns = line.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/);
	return columns.map((value) => {
		let cleaned = value.trim();
		if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
			cleaned = cleaned.slice(1, -1);
		}
		return cleaned;
	});
}

function normalizeIncomeType(incomeType) {
	const normalized = incomeType.toLowerCase().trim();
	if (normalized === 'low income') {
		return 'low';
	}
	if (normalized === 'moderate income') {
		return 'moderate';
	}
	return '';
}

function parseMoneyValue(rawValue, isModerateIncome) {
	if (!rawValue) {
		return null;
	}

	let value = rawValue.trim();
	if (isModerateIncome && value.includes('-')) {
		value = value.split('-').pop().trim();
	}

	const digitsOnly = value.replace(/[^0-9]/g, '');
	if (!digitsOnly) {
		return null;
	}

	return Number(digitsOnly);
}

function convert(csvText) {
	const rows = csvText
		.replace(/^\uFEFF/, '')
		.split(/\r?\n/)
		.map((row) => row.trimEnd())
		.filter((row) => row.trim().length > 0);

	if (rows.length < 3) {
		throw new Error('CSV does not contain enough rows to parse.');
	}

	const result = {};
	let currentCounty = '';

	for (let i = 2; i < rows.length; i += 1) {
		const columns = parseCsvLine(rows[i]);
		const county = (columns[0] || '').trim();
		const incomeType = (columns[1] || '').trim();

		if (!incomeType) {
			continue;
		}

		if (county) {
			currentCounty = county;
			if (!result[currentCounty]) {
				result[currentCounty] = {};
			}
		}

		if (!currentCounty) {
			continue;
		}

		const incomeTypeKey = normalizeIncomeType(incomeType);
		if (!incomeTypeKey) {
			continue;
		}

		for (let householdSize = 1; householdSize <= 8; householdSize += 1) {
			const columnIndex = householdSize + 1;
			const isModerateIncome = incomeTypeKey === 'moderate';
			const parsedValue = parseMoneyValue(columns[columnIndex] || '', isModerateIncome);
			const householdKey = String(householdSize);

			if (!result[currentCounty][householdKey]) {
				result[currentCounty][householdKey] = {
					lowMax: null,
					moderateMax: null
				};
			}

			if (incomeTypeKey === 'low') {
				result[currentCounty][householdKey].lowMax = parsedValue;
			}

			if (incomeTypeKey === 'moderate') {
				result[currentCounty][householdKey].moderateMax = parsedValue;
			}
		}
	}

	const normalizedResult = {};
	for (const county of Object.keys(result)) {
		normalizedResult[county] = [];
		for (let householdSize = 1; householdSize <= 8; householdSize += 1) {
			const householdKey = String(householdSize);
			const householdData = result[county][householdKey] || {};
			normalizedResult[county].push([householdData.lowMax ?? null, householdData.moderateMax ?? null]);
		}
	}

	return normalizedResult;
}

function main() {
	const csvText = fs.readFileSync(inputPath, 'utf8');
	const json = convert(csvText);

	fs.writeFileSync(outputPath, `${JSON.stringify(json, null, 2)}\n`, 'utf8');

	const countyCount = Object.keys(json).length;
	console.log(`Converted ${countyCount} counties.`);
	console.log(`Input: ${inputPath}`);
	console.log(`Output: ${outputPath}`);
}

main();
