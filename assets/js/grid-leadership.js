// Leadership Grid - Mobile First Approach
// Bare bones setup for styling the modal dialog

class LeadershipGrid {
	constructor() {
		this.template = document.querySelector('#bio-template');
		this.dialog = document.querySelector('#leadership-modal');

		// Dummy content for styling
		this.dummyBio = {
			name: 'John Doe',
			title: 'Chief Executive Officer',
			photo: 'https://tristate.coop/sites/default/files/images/leadership/2025/duane-highley-400x500.jpg',
			bio: `
				<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
				<p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
				<p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
			`
		};

		this.init();
	}

	init() {
		// Set up event delegation for expand buttons
		this.setupEventHandlers();

		// Load dummy content on page load for styling (temporary)
		this.showDummyDialog();
	}

	setupEventHandlers() {
		// Event delegation on the leadership container
		const leadershipContainer = document.querySelector('[data-leadership]');
		if (leadershipContainer) {
			leadershipContainer.addEventListener('click', (e) => {
				const expandBtn = e.target.closest('[data-expand]');
				if (expandBtn) {
					e.preventDefault();
					this.handleExpandClick(expandBtn);
				}
			});
		}
	}

	handleExpandClick(expandBtn) {
		// Get the card data
		const card = expandBtn.closest('[data-card]');
		if (!card) return;

		const cardData = this.getCardData(card);

		// Fork: determine display method based on current viewport
		if (this.isMobileView()) {
			this.showDialog(cardData);
		} else {
			this.showOverlay(cardData);
		}
	}

	getCardData(card) {
		// Extract data from the card
		const img = card.querySelector('img');
		const name = card.querySelector('.text-xl').textContent.trim();
		const title = card.querySelector('.mb-6').textContent.trim();
		const bioText = card.querySelector('[data-bio] > div').innerHTML;

		return {
			name,
			title,
			photo: img?.src || '',
			bio: bioText
		};
	}

	isMobileView() {
		// Check if we should use mobile dialog (adjust breakpoint as needed)
		return window.innerWidth < 768; // md breakpoint
	}

	showDialog(cardData) {
		// Mobile: Populate existing dialog and show
		// Clear previous content
		this.dialog.innerHTML = '';

		// Clone template content and populate data slots
		const content = this.template.content.cloneNode(true);
		this.populateTemplate(content, cardData);

		// Add close button handler
		const closeBtn = content.querySelector('[data-close]');
		if (closeBtn) {
			closeBtn.addEventListener('click', () => {
				this.dialog.close();
			});
		}

		// Add content to dialog and show
		this.dialog.appendChild(content);
		this.dialog.showModal();
	}

	showOverlay(cardData) {
		// Desktop: Show overlay (placeholder for now)
		console.log('Desktop overlay not implemented yet', cardData);
	}

	populateTemplate(content, cardData) {
		content.querySelector('[data-photo]').src = cardData.photo;
		content.querySelector('[data-photo]').alt = cardData.name;
		content.querySelector('[data-name]').textContent = cardData.name;
		content.querySelector('[data-title]').textContent = cardData.title;
		content.querySelector('[data-modal-bio]').innerHTML = cardData.bio;
	}

	showDummyDialog() {
		// Temporary: Create dialog with dummy data for styling
		this.showDialog(this.dummyBio);
	}
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function () {
	new LeadershipGrid();
});
