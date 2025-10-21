// Leadership Grid - Mobile First Approach
// Bare bones setup for styling the modal dialog

class LeadershipGrid {
	constructor() {
		this.template = document.querySelector('#bio-template');

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
		// Load dummy content on page load for styling
		this.showDummyDialog();
	}

	showDummyDialog() {
		// Create dialog element
		const dialog = document.createElement('dialog');
		// dialog.className = 'fixed inset-0 w-full h-full bg-white z-50 p-6 overflow-auto';

		// Clone template content and populate data slots
		const content = this.template.content.cloneNode(true);
		content.querySelector('[data-photo]').src = this.dummyBio.photo;
		content.querySelector('[data-photo]').alt = this.dummyBio.name;
		content.querySelector('[data-name]').textContent = this.dummyBio.name;
		content.querySelector('[data-title]').textContent = this.dummyBio.title;
		content.querySelector('[data-modal-bio]').innerHTML = this.dummyBio.bio;

		// Add close button handler
		const closeBtn = content.querySelector('[data-close]');
		if (closeBtn) {
			closeBtn.addEventListener('click', () => {
				dialog.close();
				dialog.remove();
			});
		}

		// Add content to dialog and show
		dialog.appendChild(content);
		document.body.appendChild(dialog);
		dialog.showModal();
	}
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function () {
	new LeadershipGrid();
});
