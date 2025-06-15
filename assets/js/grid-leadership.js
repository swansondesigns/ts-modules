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

document.addEventListener('DOMContentLoaded', function () {
	const leadershipGrid = document.querySelector('[data-leadership]');

	leadershipGrid.addEventListener('click', (e) => {
		const button = e.target.closest('[data-expand]');
		if (!button) return;

		const layout = getGridLayout();
		console.log('Current layout:', layout);

		// Handle mobile layout differently
		if (layout === '1-col') {
			expandCard(button);
		} else {
			// We'll handle multi-column layouts next
			console.log('Multi-column layout handling coming soon');
		}
	});
});
