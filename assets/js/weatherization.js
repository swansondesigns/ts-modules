// Label used for the row of a single-row ("table") organization.
const DEFAULT_ROW_LABEL = 'Income Threshold';

// Helper function to create organization buttons
function helperCreateOrgButtons(container, template, data) {
	Object.keys(data).forEach((orgKey) => {
		const org = data[orgKey];
		const clone = template.content.cloneNode(true);
		const button = clone.querySelector('button');

		button.textContent = org.label;
		button.setAttribute('data-org-key', orgKey);
		button.setAttribute('aria-pressed', 'false');

		container.appendChild(clone);
	});
}

// Normalize an organization's data into an array of { label, values } rows.
// Supports two authoring shapes:
//   - `table`: a single household-size map  -> one row labeled DEFAULT_ROW_LABEL
//   - `rows`:  a map of label -> household-size map -> one row per entry
function helperNormalizeRows(orgData) {
	if (orgData.rows) {
		return Object.keys(orgData.rows).map((label) => ({
			label: label,
			values: orgData.rows[label],
		}));
	}
	return [{ label: DEFAULT_ROW_LABEL, values: orgData.table }];
}

// Helper function to (re)build the DESKTOP table body: one row per data entry,
// household sizes 1-8 across the columns (matching the static header).
function helperPopulateTable(tableBody, rowTemplate, rows) {
	tableBody.replaceChildren(); // clear any previously selected org's rows
	rows.forEach((row) => {
		const clone = rowTemplate.content.cloneNode(true);
		clone.querySelector('[data-row-label]').textContent = row.label;

		const cells = clone.querySelectorAll('[data-value]');
		cells.forEach((cell, index) => {
			const householdSize = index + 1;
			cell.textContent = row.values[householdSize] || '';
		});

		tableBody.appendChild(clone);
	});
}

// Helper to build a single table cell
function helperCreateCell(tag, text, className) {
	const cell = document.createElement(tag);
	cell.className = className;
	cell.textContent = text;
	return cell;
}

// Helper function to (re)build the MOBILE table: the transpose of the desktop one.
// Household sizes run down the rows and each data entry (e.g. county) becomes its
// own column. The column count depends on the selected organization, so the whole
// table is rebuilt here rather than filled from static markup.
function helperPopulateMobileTable(table, rows) {
	const headerClass = 'border border-gray-500 px-4 py-2 text-center';
	const cellClass = 'border px-4 py-2';

	// Header: "Household Size" + one column per data entry
	const thead = document.createElement('thead');
	const headerRow = document.createElement('tr');
	headerRow.className = 'bg-white';
	headerRow.appendChild(helperCreateCell('th', 'Household Size', headerClass));
	rows.forEach((row) => {
		headerRow.appendChild(helperCreateCell('th', row.label, headerClass + ' whitespace-nowrap'));
	});
	thead.appendChild(headerRow);

	// Body: one row per household size (1-8), one value cell per data entry
	const tbody = document.createElement('tbody');
	tbody.className = 'bg-white';
	for (let size = 1; size <= 8; size++) {
		const bodyRow = document.createElement('tr');
		const label = size === 1 ? '1 Person' : size + ' Persons';
		bodyRow.appendChild(helperCreateCell('td', label, cellClass + ' whitespace-nowrap'));
		rows.forEach((row) => {
			bodyRow.appendChild(helperCreateCell('td', row.values[size] || '', cellClass + ' text-center'));
		});
		tbody.appendChild(bodyRow);
	}

	table.replaceChildren(thead, tbody);
}

// Helper function to show the income tables container
function helperShowIncomeTablesContainer(container) {
	container.classList.remove('hideme');
}

// Helper function to handle organization button clicks
function helperHandleOrgButtonClick(e, container, desktopBody, mobileTable, rowTemplate, incomeTablesContainer) {
	if (!e.target.hasAttribute('data-org-key')) return;

	const orgKey = e.target.getAttribute('data-org-key');
	const orgData = incomeLookupData[orgKey];
	if (!orgData) return;

	// Update aria-pressed on all buttons
	const allButtons = container.querySelectorAll('[data-org-key]');
	allButtons.forEach((btn) => btn.setAttribute('aria-pressed', 'false'));
	e.target.setAttribute('aria-pressed', 'true');

	// Show the income tables container
	helperShowIncomeTablesContainer(incomeTablesContainer);

	// Build both layouts for the selected organization
	const rows = helperNormalizeRows(orgData);
	helperPopulateTable(desktopBody, rowTemplate, rows); // desktop: row per entry
	helperPopulateMobileTable(mobileTable, rows);        // mobile: transposed, column per entry
}

// Main initialization function
function initWeatherization() {
	// Guard clause: Check for data
	if (typeof incomeLookupData === 'undefined' || typeof incomeLookupData !== 'object' || Object.keys(incomeLookupData).length === 0) {
		console.error('incomeLookupData is required but not found or empty.');
		return;
	}

	// Guard clause: Check for main container
	const incomeLookup = document.querySelector('[data-income-lookup]');
	if (!incomeLookup) {
		console.error('Main container [data-income-lookup] not found.');
		return;
	}

	// Guard clause: Check for organizations container
	const container = incomeLookup.querySelector('[data-organizations]');
	if (!container) {
		console.error('Container [data-organizations] not found.');
		return;
	}

	// Guard clause: Check for button template
	const template = container.querySelector('#member-button');
	if (!template) {
		console.error('Template #member-button not found.');
		return;
	}

	// Guard clause: Check for desktop table body
	const desktopBody = incomeLookup.querySelector('[data-table="desktop"] [data-table-body]');
	if (!desktopBody) {
		console.error('Desktop table body [data-table="desktop"] [data-table-body] not found.');
		return;
	}

	// Guard clause: Check for mobile table
	const mobileTable = incomeLookup.querySelector('[data-table="mobile"]');
	if (!mobileTable) {
		console.error('Mobile table [data-table="mobile"] not found.');
		return;
	}

	// Guard clause: Check for row template (used by the desktop table)
	const rowTemplate = incomeLookup.querySelector('#row-template');
	if (!rowTemplate) {
		console.error('Template #row-template not found.');
		return;
	}

	// Guard clause: Check for income tables container
	const incomeTablesContainer = incomeLookup.querySelector('[data-income-tables]');
	if (!incomeTablesContainer) {
		console.error('Income tables container [data-income-tables] not found.');
		return;
	}

	// Create organization buttons
	helperCreateOrgButtons(container, template, incomeLookupData);

	// Add event delegation for button clicks
	container.addEventListener('click', (e) => {
		helperHandleOrgButtonClick(e, container, desktopBody, mobileTable, rowTemplate, incomeTablesContainer);
	});
}

// Initialize on DOM load
window.addEventListener('DOMContentLoaded', initWeatherization);
