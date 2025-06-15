function getGridLayout() {
	const width = window.innerWidth;

	if (width >= 1280) {
		// xl breakpoint (4 columns)
		return '4-col';
	} else if (width >= 640) {
		// sm breakpoint (2 columns)
		return '2-col';
	} else {
		return '1-col'; // mobile (1 column)
	}
}

function expandCard(button) {
	const card = button.closest('[data-card]');
	const bio = card.querySelector('[data-bio]');
	const wasOpen = bio.classList.contains('open');

	// Close all bios first
	document.querySelectorAll('[data-bio].open').forEach((openBio) => {
		openBio.classList.remove('open');
		const btn = openBio.closest('[data-card]').querySelector('[data-expand]');
		btn.textContent = 'View full profile';
	});

	// Toggle the clicked card's bio
	if (!wasOpen) {
		bio.classList.add('open');
		button.textContent = 'Close profile';
	}
}

function getCardIndex(card) {
	// Only get elements that are actual cards
	const allCards = [...card.parentElement.querySelectorAll('[data-card]')];
	return allCards.indexOf(card);
}

function placeBio(gridPosition) {
	const bioContainer = document.querySelector('[data-bio-container]');
	console.log(bioContainer);
	if (!bioContainer) return;

	// For both layouts, we'll place the bio in the next column over
	const targetColumn = gridPosition['grid column'] === 1 ? 2 : 1;

	bioContainer.className = `absolute col-span-1 xl:col-span-2`;
	bioContainer.className = `col-start-${targetColumn} row-start-${gridPosition['grid row']}`;
	bioContainer.style.display = 'block';
}

document.addEventListener('DOMContentLoaded', function () {
	const leadershipGrid = document.querySelector('[data-leadership]');

	leadershipGrid.addEventListener('click', (e) => {
		const button = e.target.closest('[data-expand]');
		if (!button) return;

		const card = button.closest('[data-card]');
		const layout = getGridLayout();
		const index = getCardIndex(card) + 1; // Convert to 1-based index

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
			placeBio(gridPosition);
		}
	});
});
