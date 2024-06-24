function annualReportScrollTriggers() {
	console.log('initScrollTriggers');

	let mm = gsap.matchMedia();

	mm.add('(min-width: 768px', () => {
		gsap.registerPlugin(ScrollTrigger);
		// gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
		// ScrollSmoother.create({
		// 	smooth: 1,
		// 	effects: true,
		// });

		/**
		 * Hero timeline
		 */
		let titleTl = gsap.timeline({ defaults: { duration: 2, ease: 'elastic.out(1,0.75)' } });
		titleTl
			.fromTo(
				'[data-momentum-background]',
				{
					clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)', // Initial state: fully clipped
				},
				{
					clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', // Final state: fully visible
					duration: 0.6, // Duration of the animation in seconds
					ease: 'power2.inOut', // Ease for smooth transition
				}
			)
			.from(
				'[data-animate-mome]',
				{
					x: -1200,
				},
				'-=20%'
			)
			.from(
				'[data-animate-ntum]',
				{
					x: 1200,
				},
				'-=80%'
			);

		/**
		 * Script Headings
		 */
		annualReportanimateHeading('[data-animate-heading-planning]', 1); // Move right (from left)
		annualReportanimateHeading('[data-animate-heading-leading]', -1); // Move left (from right)

		/**
		 * Bullets
		 */
		gsap.utils.toArray('[data-animate-bullets]').forEach(function (list) {
			gsap.from(list.querySelectorAll('li'), {
				x: '100%',
				duration: 0.5,
				stagger: 0.1,
				scrollTrigger: {
					start: 'top 60%',
					trigger: list,
					// markers: true,
				},
			});
		});

		/**
		 * Sun and Pin
		 */
		gsap.to('[data-animate-sun]', {
			rotation: 360, // Rotate 360 degrees
			duration: 20, // Duration of one full rotation in seconds
			repeat: -1, // Repeat infinitely
			ease: 'linear', // Smooth linear easing
		});
		const pin = document.querySelector('[data-animate-pin]');
		gsap.from(pin, {
			y: -400,
			duration: 1,
			scrollTrigger: {
				trigger: pin.closest('div'),
				start: 'top 30%',
				// markers: true,
			},
		});

		/**
		 * E&S Logo
		 */
		const logo = document.querySelector('[data-animate-logo]');
		gsap.from(logo, {
			opacity: 0,
			duration: 0.8,
			rotation: -45,
			ease: 'elastic.out(1,0.75)',
			scrollTrigger: {
				trigger: logo.closest('div'),
				start: 'bottom 90%',
				// markers: true,
			},
		});
	});
	mm.add('(min-width: 1024px', () => {
		/**
		 * Parallax
		 */
		gsap.utils.toArray('[data-parallax-container]').forEach(function (container) {
			const image = container.querySelector('[data-parallax-image]');
			image.classList = image.dataset.parallaxImage;

			gsap.to(image, {
				y: () => container.offsetHeight - image.offsetHeight,
				ease: 'none',
				scrollTrigger: {
					trigger: container,
					scrub: true,
					pin: false,
					// markers: true,
					invalidateOnRefresh: true,
				},
			});
		});
	});
}

function annualReportanimateHeading(selector, direction) {
	const heading = document.querySelector(selector);
	const headingContainer = heading.closest('.relative');
	const offsetWidth = headingContainer.offsetWidth * direction;

	gsap.from(heading, {
		x: offsetWidth,
		duration: 1,
		ease: 'elastic.out(1, 0.75)',
		scrollTrigger: {
			trigger: heading,
			start: 'bottom 70%',
			// markers: true,
		},
	});
}

function initAnnualReport() {
	console.log('initAnnualReport');
	// gsap.registerPlugin(ScrollTrigger);

	annualReportScrollTriggers();
}
window.addEventListener('load', initAnnualReport);

function animateStats() {
	console.log('%cSTART:%c animateStats()', 'color:green', 'color:teal');
	gsap.from('stat-value', {
		textContent: 0,
		duration: 4,
		ease: 'power1.in',
		snap: { textContent: 1 },
		stagger: {
			each: 0.4,
			onUpdate: function () {
				this.targets()[0].innerHTML = numberWithCommas(Math.ceil(this.targets()[0].textContent));
			},
		},
		scrollTrigger: {
			trigger: '.ts-stats-container',
			start: 'top center',
			// markers: true,
		},
	});
}
function numberWithCommas(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function setStatValueSize() {
	const statValues = document.querySelectorAll('stat-value');

	statValues.forEach((statValue) => {
		const initialValue = parseInt(statValue.textContent.replace(/,/g, ''), 10);
		statValue.style.width = statValue.offsetWidth + 5 + 'px';
		statValue.textContent = initialValue;
	});
}

function initGSAPanimations() {
	gsap.registerPlugin(ScrollTrigger);
	setStatValueSize();
	animateStats();
}
window.addEventListener('load', initGSAPanimations);
