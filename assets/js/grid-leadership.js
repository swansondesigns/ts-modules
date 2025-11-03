// Leadership Grid - Mobile First Approach
class LeadershipGrid {
	constructor() {
		this.template = document.querySelector('#bio-template');
		this.dialog = document.querySelector('#leadership-modal');
		this.overlay = document.querySelector('[data-bio-overlay]');
		this.leadershipContainer = document.querySelector('[data-leadership]');

		// Animation constants
		this.STAGGER_DELAY = 0.05; // Time between each card animation

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
		// this.showDummyDialog();
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

		// Reset scroll position to top
		this.dialog.scrollTop = 0;
	}

	showOverlay(cardData) {
		// Desktop: Coordinate cascade and overlay with master timeline
		const masterTimeline = gsap.timeline();

		// First: populate overlay content (but keep it hidden)
		this.populateOverlay(cardData);

		// Phase 1: Cascade cards out
		masterTimeline.add(this.cascadeCards());

		// Phase 2: Show overlay content after cascade completes
		masterTimeline.add(this.showOverlayLayer(), '-=0.1'); // Start slightly before cascade ends
	}

	cascadeCards() {
		// GSAP timeline for simple fade out cascade
		const tl = gsap.timeline();

		// Fade out cards using built-in stagger
		tl.to('[data-card]', {
			opacity: 0,
			duration: 0.3,
			ease: 'power2.out',
			stagger: this.STAGGER_DELAY
		});

		return tl; // Return timeline for master coordination
	}

	populateOverlay(cardData) {
		// Clone template content and populate with data
		const content = this.template.content.cloneNode(true);
		this.populateTemplate(content, cardData);

		// Clear overlay and add new content (but keep hidden)
		this.overlay.innerHTML = '';
		this.overlay.appendChild(content);

		// Set up close button handler
		const closeBtn = this.overlay.querySelector('[data-close]');
		if (closeBtn) {
			closeBtn.addEventListener('click', () => {
				this.hideOverlay();
			});
		}
	}

	showOverlayLayer() {
		// Enable pointer events and fade in overlay
		const tl = gsap.timeline();
		gsap.set(this.overlay, { pointerEvents: 'auto', opacity: 0 });
		tl.to(this.overlay, { opacity: 1, duration: 0.4, ease: 'power2.out' });

		return tl; // Return timeline for master coordination
	}

	hideOverlay() {
		// Master timeline for hiding overlay and restoring cards
		const masterTimeline = gsap.timeline();

		// Phase 1: Hide overlay
		masterTimeline.to(this.overlay, {
			opacity: 0,
			duration: 0.3,
			ease: 'power2.out',
			onComplete: () => {
				this.overlay.style.pointerEvents = 'none';
			}
		});

		// Phase 2: Restore cards in same order (cascade back in)
		masterTimeline.add(this.restoreCards(), '-=0.4'); // Start slightly before overlay fade ends
	}

	restoreCards() {
		// GSAP timeline to fade cards back in (same order as they went out)
		const tl = gsap.timeline();

		// Fade in cards using built-in stagger
		tl.to('[data-card]', {
			opacity: 1,
			duration: 0.3,
			ease: 'power2.out',
			stagger: this.STAGGER_DELAY
		});

		return tl; // Return timeline for master coordination
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
