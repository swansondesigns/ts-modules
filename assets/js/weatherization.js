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

// Helper function to populate a single table with income data
function helperPopulateTable(table, orgData) {
	const cells = table.querySelectorAll('[data-value]');
	cells.forEach((cell, index) => {
		const householdSize = index + 1;
		cell.textContent = orgData.table[householdSize] || '';
	});
}

// Helper function to show the income tables container
function helperShowIncomeTablesContainer(container) {
	container.classList.remove('hideme');
}

// Helper function to handle organization button clicks
function helperHandleOrgButtonClick(e, container, desktopTable, mobileTable, incomeTablesContainer) {
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

	// Populate both tables
	helperPopulateTable(desktopTable, orgData);
	helperPopulateTable(mobileTable, orgData);
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

	// Guard clause: Check for template
	const template = container.querySelector('#member-button');
	if (!template) {
		console.error('Template #member-button not found.');
		return;
	}

	// Guard clause: Check for tables
	const desktopTable = incomeLookup.querySelector('[data-table="desktop"]');
	const mobileTable = incomeLookup.querySelector('[data-table="mobile"]');
	if (!desktopTable || !mobileTable) {
		console.error('Tables not found.');
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
		helperHandleOrgButtonClick(e, container, desktopTable, mobileTable, incomeTablesContainer);
	});
}

// Initialize on DOM load
window.addEventListener('DOMContentLoaded', initWeatherization);
