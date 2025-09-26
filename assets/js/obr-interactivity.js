// Helper function to determine mobile or not
function isMobile() {
	return window.matchMedia('(max-width: 639px)').matches;
}

// Helper function to create and append form iframe to modal
function helperObrCreateAndAppendForm(src, container) {
	return new Promise((resolve, reject) => {
		if (!container) {
			console.error('Container not found.');
			reject(new Error('Container not found'));
			return;
		}

		// Clear container contents
		container.innerHTML = '';

		// Create iframe
		const iframe = document.createElement('iframe');
		iframe.src = src;
		iframe.classList.add('w-full', 'h-full');
		iframe.style.border = 'none';
		iframe.setAttribute('aria-label', 'CCEF On-Bill Electrify and Save Contractor Interest Form');

		// Append iframe
		container.appendChild(iframe);

		// Wait for iframe to load
		iframe.onload = () => {
			resolve(iframe);
		};

		iframe.onerror = () => {
			reject(new Error('Iframe failed to load'));
		};
	});
}

// Helper function to populate member buttons from template
function helperObrPopulateMemberButtons(memberButtonsContainer, template, obrFormOptions) {
	obrFormOptions.forEach((option) => {
		const clone = template.content.cloneNode(true);
		const link = clone.querySelector('a');
		link.href = option.url;
		link.textContent = option.label;
		memberButtonsContainer.appendChild(clone);
	});
}

// Helper function to handle member button clicks
function helperObrHandleMemberButtonClick(e) {
	// Check if clicked element is a link
	if (e.target.tagName === 'A') {
		e.preventDefault(); // Kill default link behavior

		// Get the URL from the clicked button
		const formUrl = e.target.href;

		// Open modal with form
		openObrModal(formUrl);
	}
}

// Function to open the OBR modal
function openObrModal(formUrl) {
	const modal = document.getElementById('obr-modal');
	const loading = document.getElementById('obr-modal-loading');
	const content = document.getElementById('obr-modal-content');

	if (!modal || !loading || !content) {
		console.error('Modal elements not found');
		return;
	}

	// Disable body scrolling
	document.body.style.overflow = 'hidden';

	// Reset modal state
	loading.style.display = 'flex';
	content.style.display = 'none';

	// Open modal
	modal.showModal();

	// Load form
	helperObrCreateAndAppendForm(formUrl, content)
		.then((iframe) => {
			// Hide loading, show content
			loading.style.display = 'none';
			content.style.display = 'block';
		})
		.catch((error) => {
			console.error('Failed to load form:', error);
			// Restore body scrolling before closing
			document.body.style.overflow = '';
			// Could show an error message here
			modal.close();
		});
}

// Function to close the OBR modal
function closeObrModal() {
	const modal = document.getElementById('obr-modal');
	const content = document.getElementById('obr-modal-content');

	if (modal) {
		modal.close();

		// Restore body scrolling
		document.body.style.overflow = '';

		// Clear the iframe to stop any ongoing processes
		if (content) {
			content.innerHTML = '';
		}
	}
}

function helperObrConfirmRequiredDOM(memberButtons, template) {
	// Guard clause - exit early if essential elements are missing
	if (!memberButtons) {
		console.error('Essential element [data-member-buttons] not found. Modal cannot initialize.');
		return false;
	}

	if (!template) {
		console.error('Template not found in [data-member-buttons] container. Modal cannot initialize.');
		return false;
	}

	if (typeof obrFormOptions === 'undefined' || !Array.isArray(obrFormOptions) || obrFormOptions.length === 0) {
		console.error('obrFormOptions array is required but not found or empty. Modal cannot initialize.');
		return false;
	}

	return true;
}

function initFormReveal() {
	// Check for absolute necessities first
	const memberButtons = document.querySelector('[data-member-buttons]');
	const template = memberButtons?.querySelector('template#member-button');

	if (!helperObrConfirmRequiredDOM(memberButtons, template)) return;

	// Populate member buttons from template
	helperObrPopulateMemberButtons(memberButtons, template, obrFormOptions);

	// Add event delegation for member buttons
	memberButtons.addEventListener('click', helperObrHandleMemberButtonClick);
}

function initObrModal() {
	const modal = document.getElementById('obr-modal');
	const closeButton = document.getElementById('obr-modal-close');

	if (!modal || !closeButton) return;

	// Close button handler
	closeButton.addEventListener('click', closeObrModal);

	// Close on backdrop click
	modal.addEventListener('click', (e) => {
		if (e.target === modal) {
			closeObrModal();
		}
	});

	// Close on Escape key
	modal.addEventListener('keydown', (e) => {
		if (e.key === 'Escape') {
			closeObrModal();
		}
	});
}

function initEligibilityModal() {
	const modalLink = document.querySelector('[data-eligible]');
	const modalMessage = document.querySelector('[data-eligible-modal]');
	if (!modalLink || !modalMessage) return;

	modalLink.classList.add('cursor-pointer');
	modalLink.classList.remove('hideme');

	modalLink.addEventListener('click', (e) => {
		// Simple show/hide without GSAP
		modalMessage.style.transition = 'transform 0.4s ease';
		if (isMobile()) {
			modalMessage.style.transform = 'translateX(-100%)';
		} else {
			modalMessage.style.transform = 'translateY(-100%)';
		}
	});

	const closeButton = modalMessage.querySelector('button');
	if (!closeButton) return;

	closeButton.addEventListener('click', (e) => {
		// Simple show/hide without GSAP
		modalMessage.style.transition = 'transform 0.2s ease';
		if (isMobile()) {
			modalMessage.style.transform = 'translateX(0%)';
		} else {
			modalMessage.style.transform = 'translateY(0%)';
		}
	});
}

function initRevealer() {
	// Find all revealer buttons
	const revealerButtons = document.querySelectorAll('[data-revealer]');

	revealerButtons.forEach((button) => {
		const targetId = button.getAttribute('data-revealer');
		const targetSection = document.querySelector(`[data-reveal="${targetId}"]`);

		if (!targetSection) {
			console.warn(`No target section found for revealer: ${targetId}`);
			return;
		}

		// Find any animated icons within this button
		const animatedIcon = button.querySelector('[data-animate-icon]');
		const animationType = animatedIcon?.getAttribute('data-animate-icon');

		// Remove the revealed class initially (assuming it's there for testing)
		targetSection.classList.remove('revealed');
		button.style.removeProperty('display');

		// Add click handler
		button.addEventListener('click', (e) => {
			e.preventDefault();

			// Toggle the revealed state
			targetSection.classList.toggle('revealed');
			const isRevealed = targetSection.classList.contains('revealed');

			// Animate icon if present
			if (animatedIcon && animationType) {
				animateIcon(animatedIcon, animationType, isRevealed);
			}

			// Optional: Update button text or state
			if (isRevealed) {
				// Section is now open
				console.log(`Revealed section: ${targetId}`);
			} else {
				// Section is now closed
				console.log(`Hidden section: ${targetId}`);
			}
		});
	});
}

function animateIcon(iconElement, animationType, isActive = false) {
	// Simple CSS-based animations instead of GSAP
	const duration = '0.5s';
	iconElement.style.transition = `transform ${duration} ease`;

	switch (animationType) {
		case 'rotate-180':
			iconElement.style.transform = isActive ? 'rotate(180deg)' : 'rotate(0deg)';
			break;
		case 'scale':
			iconElement.style.transform = isActive ? 'scale(1.1)' : 'scale(1)';
			break;
		case 'fade':
			iconElement.style.transition = `opacity ${duration} ease`;
			iconElement.style.opacity = isActive ? '1' : '0.5';
			break;
		default:
			console.warn(`Unknown animation type: ${animationType}`);
	}
}
function initScrollTo() {
	// Use event delegation to catch all clicks on elements with data-scrollto attribute
	document.addEventListener('click', (e) => {
		// Check if the clicked element (or a parent) has data-scrollto attribute
		const scrollButton = e.target.closest('[data-scrollto]');
		if (!scrollButton) return;

		e.preventDefault();

		const targetId = scrollButton.getAttribute('data-scrollto');
		const target = document.getElementById(targetId);
		if (!target) return;

		// Simple smooth scroll behavior
		target.scrollIntoView({
			behavior: 'smooth',
			block: 'start'
		});
	});
}

function initStickyTemplate() {
	const template = document.getElementById('sticky-template');
	if (!template) return;
	const clone = template.content.cloneNode(true);
	document.body.appendChild(clone);
}

function initOBR() {
	initStickyTemplate();
	initFormReveal();
	initObrModal(); // Initialize the modal functionality
	initRevealer();
	initEligibilityModal();
	initScrollTo();
}

// Initialize on window load
window.addEventListener('load', initOBR);
