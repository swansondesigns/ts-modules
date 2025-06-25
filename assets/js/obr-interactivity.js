// Helper functiont to determine mobile or not
function isMobile() {
	// Need a function that returns boolean for whether or not the device is smaller than the sm: tailwind breakpoint
	return window.matchMedia('(max-width: 639px)').matches;
}

// Helper function to create and configure the GSAP timeline
function helperObrCreateTimeline(zohoContainer, peek) {
	// DOM element selections using data attributes (optional elements)
	const triangles = peek.querySelectorAll('[data-triangle]'); // Animate to: clip-path: polygon(100% 100%, 100% 0%, 100% 100%, 0% 100%);
	const ctaBadge = peek.querySelector('[data-cta-badge]'); // Animate to: scale to 0
	const ctaText = peek.querySelector('[data-cta-text]'); // Animate to: transform: translateY(200%);

	// Duration variables for easy experimentation
	const baseDuration = 0.4;
	// Initialize GSAP timeline
	const tl = gsap.timeline({
		paused: true,
		defaults: {
			ease: 'power2.out',
			duration: baseDuration
		}
	});
	// Build the animation timeline with staggered overlapping animations
	tl.to(ctaBadge, {
		scale: 0.001,
		duration: baseDuration * 0.8,
		ease: 'back.in(1.7)'
	})
		.to(
			triangles,
			{
				clipPath: 'polygon(100% 100%, 100% 0%, 100% 100%, 0% 100%)',
				ease: 'power2.inOut'
			},
			'-=0.6'
		)
		.to(
			ctaText,
			{
				y: '200%',
				ease: 'power2.in'
			},
			'-=0.8'
		)
		.to(zohoContainer, {
			top: '0%',
			ease: 'power2.out',
			onComplete: () => {
				// Cleanup: Hide then remove animated content elements during animation completion
				const peekContentElements = peek.querySelectorAll('[data-peek-content]');
				peekContentElements.forEach((element) => {
					element.style.display = 'none'; // Hide immediately to prevent flash
					element.remove(); // Then remove from DOM
				});
			}
		});

	return tl;
}

// Helper function to create and append iframe
function helperObrCreateAndAppendForm(src, zohoContainer) {
	return new Promise((resolve, reject) => {
		if (!zohoContainer) {
			console.error('Container with data-zoho-container not found.');
			reject(new Error('Container not found'));
			return;
		}

		// Clear container contents
		zohoContainer.innerHTML = '';

		// Create iframe
		const iframe = document.createElement('iframe');
		iframe.src = src;
		iframe.classList.add('w-full', 'hidden'); // Use Tailwind classes

		// Append iframe
		zohoContainer.appendChild(iframe);

		// Wait for iframe to load before making it visible
		iframe.onload = () => {
			iframe.classList.remove('hidden');
			resolve(iframe); // Resolve with the iframe element
		};

		iframe.onerror = () => {
			reject(new Error('Iframe failed to load'));
		};

		window.addEventListener(
			'message',
			function () {
				var evntData = event.data;
				if (evntData && evntData.constructor == String) {
					var zf_ifrm_data = evntData.split('|');
					if (zf_ifrm_data.length == 2 || zf_ifrm_data.length == 3) {
						var zf_perma = zf_ifrm_data[0];
						var zf_ifrm_ht_nw = parseInt(zf_ifrm_data[1], 10) + 15 + 'px';

						if (iframe.src.indexOf('formperma') > 0 && iframe.src.indexOf(zf_perma) > 0) {
							var prevIframeHeight = iframe.style.height;
							var zf_tout = false;
							if (zf_ifrm_data.length == 3) {
								iframe.scrollIntoView();
								zf_tout = true;
							}
							if (prevIframeHeight != zf_ifrm_ht_nw) {
								if (zf_tout) {
									setTimeout(function () {
										iframe.style.height = zf_ifrm_ht_nw;
									}, 500);
								} else {
									iframe.style.height = zf_ifrm_ht_nw;
								}
							}
						}
					}
				}
			},
			false
		);
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

	return true;
}

// Helper function to handle member button clicks
function helperObrHandleMemberButtonClick(e, timeline, zohoContainer, peek) {
	// Check if clicked element is a link
	if (e.target.tagName === 'A') {
		e.preventDefault(); // Kill default link behavior
		// Get the URL from the clicked button
		const formUrl = e.target.href;

		// Check if form is already open (zoho container has an iframe)
		const existingIframe = zohoContainer.querySelector('iframe');
		const isFormAlreadyOpen = existingIframe !== null;
		if (!isFormAlreadyOpen) {
			// First time opening - capture current height to prevent flash and run full animation sequence
			const currentHeight = peek.offsetHeight;
			gsap.set(peek, { height: currentHeight });

			// Immediately animate screenshots down
			const screenshots = peek.querySelectorAll('[data-screenshot]');
			gsap.to(screenshots, {
				y: '100%',
				duration: 0.48,
				ease: 'power2.inOut'
			});
		}

		// Load the form (works whether first time or switching forms)
		helperObrCreateAndAppendForm(formUrl, zohoContainer)
			.then((iframe) => {
				if (!isFormAlreadyOpen) {
					// Only run the main timeline animation if this is the first form load
					// Set up observer to watch for iframe height changes
					const observer = new MutationObserver(() => {
						const iframeHeight = iframe.style.height;
						if (iframeHeight) {
							// Start the main timeline
							timeline.restart();

							// When timeline completes, animate peek height
							timeline.then(() => {
								gsap.to(peek, {
									height: iframeHeight,
									duration: 1.5,
									ease: 'power2.out'
								});
							});

							// Disconnect observer after first height change
							observer.disconnect();
						}
					});

					observer.observe(iframe, {
						attributes: true,
						attributeFilter: ['style']
					});
				} else {
					// Form is already open, just adjust peek height when new form loads
					const observer = new MutationObserver(() => {
						const iframeHeight = iframe.style.height;
						if (iframeHeight) {
							gsap.to(peek, {
								height: iframeHeight,
								duration: 0.3,
								ease: 'power2.out'
							});
							observer.disconnect();
						}
					});

					observer.observe(iframe, {
						attributes: true,
						attributeFilter: ['style']
					});
				}
			})
			.catch((error) => {
				console.error('Failed to load form:', error);
			});
	}
}

function helperObrConfirmRequiredDOM(memberButtons, zohoContainer, template) {
	// Guard clause - exit early if essential elements are missing
	if (!memberButtons) {
		console.error('Essential element [data-member-buttons] not found. Form reveal cannot initialize.');
		return false;
	}

	if (!template) {
		console.error('Template not found in [data-member-buttons] container. Form reveal cannot initialize.');
		return false;
	}

	if (!zohoContainer) {
		console.error('Essential element [data-zoho-container] not found. Form reveal cannot initialize.');
		return false;
	}

	if (typeof obrFormOptions === 'undefined' || !Array.isArray(obrFormOptions) || obrFormOptions.length === 0) {
		console.error('obrFormOptions array is required but not found or empty. Form reveal cannot initialize.');
		return false;
	}

	return true;
}

function initFormReveal() {
	// Check for absolute necessities first
	const memberButtons = document.querySelector('[data-member-buttons]');
	const zohoContainer = document.querySelector('[data-zoho-container]');
	const peek = document.querySelector('[data-peek]');
	const template = memberButtons?.querySelector('template');

	if (!helperObrConfirmRequiredDOM(memberButtons, zohoContainer, template)) return;

	// Set initial position for zoho container
	gsap.set(zohoContainer, { top: '100%' });

	// Create the animation timeline
	const tl = helperObrCreateTimeline(zohoContainer, peek);
	// Populate member buttons from template
	helperObrPopulateMemberButtons(memberButtons, template, obrFormOptions);

	// Add event delegation for member buttons
	memberButtons.addEventListener('click', (e) => {
		helperObrHandleMemberButtonClick(e, tl, zohoContainer, peek);
	});
}

function initEligibilityModal() {
	const modalLink = document.querySelector('[data-eligible]');
	const modalMessage = document.querySelector('[data-eligible-modal]');
	if (!modalLink || !modalMessage) return;

	modalLink.classList.add('cursor-pointer');
	modalLink.classList.remove('hideme');

	modalLink.addEventListener('click', (e) => {
		const animationProps = {
			duration: 0.4,
			ease: 'back.inOut(1.7)'
		};

		if (isMobile()) {
			animationProps.x = '-100%';
		} else {
			animationProps.y = '-100%';
		}

		gsap.to(modalMessage, animationProps);
	});

	const closeButton = modalMessage.querySelector('button');
	console.log(closeButton);
	if (!closeButton) return;

	closeButton.addEventListener('click', (e) => {
		console.log('click button');

		const animationProps = {
			duration: 0.2,
			ease: 'power2.inOut'
		};
		animationProps.x = null;
		animationProps.y = null;

		if (isMobile()) {
			animationProps.x = '0%';
		} else {
			animationProps.y = '0%';
		}

		gsap.to(modalMessage, animationProps);
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

function animateButtonGroup(selector = '[data-member-buttons]') {
	// Find the button group container
	const buttonGroup = document.querySelector(selector);
	if (!buttonGroup) {
		console.warn(`Button group not found: ${selector}`);
		return;
	}

	// Find all buttons/links within the group
	const buttons = buttonGroup.querySelectorAll('a, button');
	if (buttons.length === 0) {
		console.warn(`No buttons found in group: ${selector}`);
		return;
	} // Animation settings
	const pulseDuration = 0.2; // Shorter, snappier pulse
	const staggerDelay = 0.05; // Quick succession
	const scaleAmount = 1.05;

	// Create timeline and animate each button individually for proper yoyo effect
	const tl = gsap.timeline();

	buttons.forEach((button, index) => {
		tl.to(
			button,
			{
				scale: scaleAmount,
				duration: pulseDuration,
				ease: 'power2.out',
				yoyo: true,
				repeat: 1 // Each button pulses once and returns
			},
			index * staggerDelay
		);
	});

	return tl; // Return timeline in case caller wants to chain or control it
}

function animateIcon(iconElement, animationType, isActive = false) {
	// Reusable function to animate icons based on state
	// iconElement: the DOM element to animate
	// animationType: string describing the animation (e.g., 'rotate-180', 'scale', 'fade')
	// isActive: boolean indicating the current state
	const aniDuration = 0.5;
	const animations = {
		'rotate-180': {
			active: { rotation: 180, duration: aniDuration, ease: 'back.out(1.7)' },
			inactive: { rotation: 0, duration: aniDuration, ease: 'power2.inOut' }
		},
		scale: {
			active: { scale: 1.1, duration: aniDuration * 0.67, ease: 'back.out(1.7)' },
			inactive: { scale: 1, duration: aniDuration * 0.67, ease: 'power2.out' }
		},
		fade: {
			active: { opacity: 1, duration: aniDuration, ease: 'power2.inOut' },
			inactive: { opacity: 0.5, duration: aniDuration, ease: 'power2.inOut' }
		}
	};

	const animationConfig = animations[animationType];
	if (!animationConfig) {
		console.warn(`Unknown animation type: ${animationType}`);
		return;
	}

	const targetState = isActive ? animationConfig.active : animationConfig.inactive;
	gsap.to(iconElement, targetState);
}
function initScrollTo() {
	gsap.registerPlugin(ScrollToPlugin);
	// Initialize all buttons with data-scrollto attribute
	const scrollToButtons = document.querySelectorAll('[data-scrollto]');
	console.log(scrollToButtons);
	scrollToButtons.forEach((button) => {
		const targetId = button.getAttribute('data-scrollto');
		console.log(targetId);
		const target = document.getElementById(targetId);
		console.log(target);
		if (!target) return;
		button.addEventListener('click', (e) => {
			e.preventDefault();

			gsap.to(window, {
				duration: 1,
				scrollTo: target,
				ease: 'power2.inOut',
				onComplete: () => {
					// Animate button group after scroll completes
					animateButtonGroup();
				}
			});
		});
	});
}

function initOBR() {
	initFormReveal();
	initRevealer();
	initEligibilityModal();
	initScrollTo();
}
// Initialize on window load
window.addEventListener('load', initOBR);
