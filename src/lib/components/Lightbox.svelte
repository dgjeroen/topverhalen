<!--src\lib\components\Lightbox.svelte-->
<script lang="ts">
	import { lightbox } from '$lib/stores/lightbox';
	import { browser } from '$app/environment';

	// Gebruik $state om de lokale state bij te houden.
	let currentIndex = $state(0);

	// Gebruik $derived om de store-waarden te volgen.
	const isOpen = $derived($lightbox.isOpen);
	const images = $derived($lightbox.images);

	// Bepaal de huidige afbeelding op basis van de index.
	const currentImage = $derived(images[currentIndex]);

	// De $effect-hook reageert op veranderingen en beheert de event listeners.
	$effect(() => {
		if (browser && isOpen) {
			// Synchroniseer de lokale index met de index uit de store wanneer de lightbox opent.
			currentIndex = $lightbox.currentIndex;

			const handleKeyDown = (e: KeyboardEvent) => {
				if (e.key === 'Escape') lightbox.close();
				if (e.key === 'ArrowRight') next();
				if (e.key === 'ArrowLeft') prev();
			};

			// Voeg de event listener toe aan het window.
			window.addEventListener('keydown', handleKeyDown);

			// De return-functie van $effect ruimt de listener op wanneer het effect niet langer actief is.
			return () => window.removeEventListener('keydown', handleKeyDown);
		}
	});

	function next() {
		currentIndex = (currentIndex + 1) % images.length;
	}

	function prev() {
		currentIndex = (currentIndex - 1 + images.length) % images.length;
	}
</script>

{#if isOpen}
	<div
		class="lightbox-overlay"
		role="button"
		tabindex="-1"
		onclick={(e) => {
			// Sluit de lightbox alleen als er op de overlay wordt geklikt, niet op de inhoud.
			if (e.target === e.currentTarget) lightbox.close();
		}}
		onkeydown={(e) => {
			// Val op de Escape-toets. De andere toetsen worden globaal afgehandeld in $effect.
			if (e.key === 'Escape') lightbox.close();
		}}
	>
		<button class="close-btn" aria-label="Sluit lightbox" onclick={lightbox.close}>&times;</button>

		<div class="lightbox-content">
			{#if images.length > 1}
				<button
					class="nav-btn prev"
					aria-label="Vorige afbeelding"
					onclick={(e) => {
						e.stopPropagation();
						prev();
					}}>‹</button
				>
			{/if}

			{#if currentImage}
				<figure>
					<img src={currentImage.url} alt={currentImage.caption || ''} />
					{#if currentImage.caption || currentImage.source}
						<figcaption>
							<span class="caption">{currentImage.caption}</span>
							{#if currentImage.source}<span class="source">{currentImage.source}</span>{/if}
						</figcaption>
					{/if}
				</figure>
			{/if}

			{#if images.length > 1}
				<button
					class="nav-btn next"
					aria-label="Volgende afbeelding"
					onclick={(e) => {
						e.stopPropagation();
						next();
					}}>›</button
				>
			{/if}
		</div>
	</div>
{/if}

<style>
	/* De CSS blijft ongewijzigd */
	.lightbox-overlay {
		position: fixed;
		inset: 0;
		background-color: rgba(var(--color-text-rgb), 0.9);
		z-index: 1000;
		display: grid;
		place-items: center;
		padding: var(--space-m);
	}

	.lightbox-content {
		position: relative;
		max-width: 95vw;
		max-height: 95vh;
		display: flex;
	}

	figure {
		margin: 0;
		display: flex;
		flex-direction: column;
		max-height: 100%;
	}

	img {
		display: block;
		max-width: 100%;
		max-height: 100%;
		object-fit: contain;
		flex-shrink: 1;
		min-height: 0;
	}

	figcaption {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		color: var(--color-white);
		padding: var(--space-xxl) var(--space-l) var(--space-m);
		font-size: var(--font-size-s);
		background: linear-gradient(to top, rgba(var(--color-text-rgb), 0.7), transparent);
		text-align: center;
		pointer-events: none;
	}

	.caption {
		font-weight: 600;
		display: block;
	}

	.source {
		font-style: italic;
		opacity: 0.8;
		display: block;
		margin-top: 4px;
	}

	.close-btn,
	.nav-btn {
		position: absolute;
		color: var(--color-white);
		background: none;
		border: none;
		font-size: 3rem;
		cursor: pointer;
		z-index: 1001;
		text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
	}

	.close-btn {
		top: var(--space-s);
		right: var(--space-l);
	}

	.nav-btn {
		top: 50%;
		transform: translateY(-50%);
	}

	.nav-btn.prev {
		left: var(--space-m);
	}

	.nav-btn.next {
		right: var(--space-m);
	}
</style>
