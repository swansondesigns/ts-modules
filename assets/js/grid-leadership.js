const BUTTON_DEFAULT_TEXT = 'View full profile';
const BUTTON_CLOSE_TEXT = 'Close profile';
function getGridLayout() {
	const width = window.innerWidth;

	if (width >= 1280) {
		return '4-col';
	} else if (width >= 640) {
		return '2-col';
	} else {
		return '1-col';
	}
}

function getCardIndex(card, gridLeadership) {
	const allCards = [...gridLeadership.querySelectorAll('[data-card]')];
	return allCards.indexOf(card);
}

function expandCard(button) {
	const card = button.closest('[data-card]');
	const bio = card.querySelector('[data-bio]');
	const wasOpen = bio.classList.contains('open');

	// Close all bios first
	document.querySelectorAll('[data-bio].open').forEach((openBio) => {
		openBio.classList.remove('open');
		const btn = openBio.closest('[data-card]').querySelector('[data-expand]');
		btn.textContent = BUTTON_DEFAULT_TEXT;
	});

	// Toggle the clicked card's bio
	if (!wasOpen) {
		bio.classList.add('open');
		button.textContent = BUTTON_CLOSE_TEXT;
	}
}

function placeBio(gridPosition, button, gridLeadership) {
	const template = document.querySelector('#bio-template');
	const existingBio = gridLeadership.querySelector('[data-bio-container]');
	const overlay = gridLeadership.querySelector('[data-cover]');

	// Reset all buttons and active states
	gridLeadership.querySelectorAll('[data-expand]').forEach((btn) => {
		btn.textContent = BUTTON_DEFAULT_TEXT;
		btn.closest('[data-card]').classList.remove('active');
	});

	// Calculate target column based on layout
	let targetColumn;
	if (gridPosition.layout === '4-col') {
		const clickedColumn = gridPosition['grid column'];
		switch (clickedColumn) {
			case 1:
				targetColumn = 2;
				break; // Middle (2-3)
			case 2:
				targetColumn = 3;
				break; // Right (3-4)
			case 3:
				targetColumn = 1;
				break; // Left (1-2)
			case 4:
				targetColumn = 2;
				break; // Middle (2-3)
		}
	} else {
		// Original 2-col logic
		targetColumn = gridPosition['grid column'] === 1 ? 2 : 1;
	}

	const targetRow = gridPosition['grid row'];

	// If there's an existing bio in the same position, remove it
	if (existingBio) {
		const samePosition = existingBio.classList.contains(`col-start-${targetColumn}`) && existingBio.classList.contains(`row-start-${targetRow}`);

		existingBio.remove();

		if (samePosition) {
			gridLeadership.classList.remove('has-active');
			return; // Button text is already reset
		}
	}

	// Create new bio panel
	const newBio = template.content.firstElementChild.cloneNode(true);
	newBio.classList.add(`col-start-${targetColumn}`, `row-start-${targetRow}`);

	gridLeadership.appendChild(newBio);
	button.textContent = BUTTON_CLOSE_TEXT;

	// Set active states
	button.closest('[data-card]').classList.add('active');
	gridLeadership.classList.add('has-active');
}

document.addEventListener('DOMContentLoaded', function () {
	const gridLeadership = document.querySelector('[data-leadership]');

	gridLeadership.addEventListener('click', (e) => {
		const button = e.target.closest('[data-expand]');
		if (!button) return;

		const card = button.closest('[data-card]');
		const layout = getGridLayout();
		const index = getCardIndex(card, gridLeadership) + 1;

		const gridPosition = {
			layout: layout,
			'card number': index,
			'grid row': Math.floor((index - 1) / (layout === '4-col' ? 4 : 2)) + 1,
			'grid column': ((index - 1) % (layout === '4-col' ? 4 : 2)) + 1
		};

		console.log(gridPosition);

		if (layout === '1-col') {
			expandCard(button);
		} else {
			placeBio(gridPosition, button, gridLeadership);
		}
	});
});
