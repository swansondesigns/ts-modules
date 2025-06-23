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

// Initialize on window load
window.addEventListener('load', initFormReveal);
