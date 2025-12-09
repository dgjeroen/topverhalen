/**
 * Applies hover effect styling based on CSS variables
 */
export function applyImageShape() {
	const root = document.documentElement;
	const computedStyle = getComputedStyle(root);

	// Hover effect
	const hoverEffect = computedStyle.getPropertyValue('--image-hover-effect').trim();

	// Apply hover effect via CSS variables
	if (hoverEffect === 'lift') {
		root.style.setProperty('--image-hover-container-transform', 'translateY(-4px)');
		root.style.setProperty('--image-hover-img-transform', 'scale(1)');
	} else if (hoverEffect === 'zoom') {
		root.style.setProperty('--image-hover-container-transform', 'translateY(0)');
		root.style.setProperty('--image-hover-img-transform', 'scale(1.1)');
	} else if (hoverEffect === 'none') {
		root.style.setProperty('--image-hover-container-transform', 'translateY(0)');
		root.style.setProperty('--image-hover-img-transform', 'scale(1)');
	}
}
