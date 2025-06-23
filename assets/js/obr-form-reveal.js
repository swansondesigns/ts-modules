// DOM element selections using data attributes
const screenshots = document.querySelectorAll('[data-screenshot]'); // Animate to: transform: translateY(100%);
const triangles = document.querySelectorAll('[data-triangle]'); // Animate to: clip-path: polygon(100% 100%, 100% 0%, 100% 100%, 0% 100%);
const ctaBadge = document.querySelector('[data-cta-badge]'); // Animate to: scale to 0
const ctaText = document.querySelector('[data-cta-text]'); // Animate to: transform: translateY(200%);

// Console log all elements to verify they're being selected correctly
console.log('Screenshots found:', screenshots);
console.log('Screenshots count:', screenshots.length);
console.log('Triangles found:', triangles);
console.log('Triangles count:', triangles.length);
console.log('CTA Badge found:', ctaBadge);
console.log('CTA Text found:', ctaText);

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

console.log('GSAP Timeline initialized:', tl);

// Build the animation timeline with staggered overlapping animations
tl.to(screenshots, {
	y: '100%',
	duration: baseDuration * 1.2,
	ease: 'power2.inOut'
})
.to(ctaBadge, {
	scale: 0.001,
	duration: baseDuration * 0.8,
	ease: 'back.in(1.7)'
}, '-=0.9')
.to(triangles, {
	clipPath: 'polygon(100% 100%, 100% 0%, 100% 100%, 0% 100%)',
	ease: 'power2.inOut'
}, '-=0.6')
.to(ctaText, {
	y: '200%',
	ease: 'power2.in'
}, '-=0.8');

// Add click trigger for testing
const peekSection = document.querySelector('[data-peek]');
if (peekSection) {
	peekSection.addEventListener('click', () => {
		console.log('Peek section clicked - playing animation');
		tl.restart(); // Restart from beginning each time
	});

	// Add cursor pointer to indicate it's clickable
	peekSection.style.cursor = 'pointer';
	console.log('Click trigger added to [data-peek] section');
} else {
	console.warn('data-peek section not found for click trigger');
}
