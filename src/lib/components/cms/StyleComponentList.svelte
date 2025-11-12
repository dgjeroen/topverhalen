<script lang="ts">
	let { selected = $bindable('general') } = $props<{ selected?: string }>();
</script>

<div class="style-components">
	<h3>Componenten</h3>

	<button
		class="style-component-item"
		class:active={selected === 'general'}
		onclick={() => (selected = 'general')}
	>
		<svg class="component-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
			<circle cx="12" cy="12" r="3" />
			<path
				d="M12 1v6m0 6v6m8.66-13.66l-4.24 4.24m-4.84 4.84l-4.24 4.24M23 12h-6m-6 0H1m20.66 8.66l-4.24-4.24m-4.84-4.84l-4.24-4.24"
			/>
		</svg>
		<span>Algemeen</span>
	</button>

	<button
		class="style-component-item"
		class:active={selected === 'heading'}
		onclick={() => (selected = 'heading')}
	>
		<svg class="component-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
			<use href="#icon-block-h2" />
		</svg>
		<span>Kop (H2)</span>
	</button>

	<button
		class="style-component-item"
		class:active={selected === 'subheading'}
		onclick={() => (selected = 'subheading')}
	>
		<svg class="component-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
			<use href="#icon-block-h4" />
		</svg>
		<span>Tussenkop (H4)</span>
	</button>

	<button
		class="style-component-item"
		class:active={selected === 'subheadingMedium'}
		onclick={() => (selected = 'subheadingMedium')}
	>
		<svg class="component-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
			<use href="#icon-block-h3" />
		</svg>
		<span>Tussenkop (H3)</span>
	</button>

	<button
		class="style-component-item"
		class:active={selected === 'subheadingSoccer'}
		onclick={() => (selected = 'subheadingSoccer')}
	>
		<svg class="component-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
			<use href="#icon-block-soccer" />
		</svg>
		<span>Tussenkop Voetbal</span>
	</button>

	<button
		class="style-component-item"
		class:active={selected === 'text'}
		onclick={() => (selected = 'text')}
	>
		<svg class="component-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
			<use href="#icon-block-text" />
		</svg>
		<span>Tekst</span>
	</button>

	<button
		class="style-component-item"
		class:active={selected === 'textframe'}
		onclick={() => (selected = 'textframe')}
	>
		<svg class="component-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
			<use href="#icon-block-text-frame" />
		</svg>
		<span>Tekstkader</span>
	</button>

	<button
		class="style-component-item"
		class:active={selected === 'quote'}
		onclick={() => (selected = 'quote')}
	>
		<svg class="component-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
			<use href="#icon-block-quote" />
		</svg>
		<span>Citaat</span>
	</button>

	<button
		class="style-component-item"
		class:active={selected === 'colofon'}
		onclick={() => (selected = 'colofon')}
	>
		<svg class="component-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
			<use href="#icon-block-colofon" />
		</svg>
		<span>Colofon</span>
	</button>

	<button
		class="style-component-item"
		class:active={selected === 'audio'}
		onclick={() => (selected = 'audio')}
	>
		<svg class="component-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
			<use href="#icon-block-audio" />
		</svg>
		<span>Audio</span>
	</button>

	<button
		class="style-component-item"
		class:active={selected === 'image'}
		onclick={() => (selected = 'image')}
	>
		<svg class="component-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
			<use href="#icon-block-image" />
		</svg>
		<span>Afbeelding</span>
	</button>

	<button
		class="style-component-item"
		class:active={selected === 'slider'}
		onclick={() => (selected = 'slider')}
	>
		<svg class="component-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
			<use href="#icon-block-slider" />
		</svg>
		<span>Slider</span>
	</button>

	<!-- ✅ TIMELINE BUTTON (EXACT SAME MARKUP) -->
	<button
		class="style-component-item"
		class:active={selected === 'timeline'}
		onclick={() => (selected = 'timeline')}
	>
		<svg class="component-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
			<use href="#icon-block-timeline" />
		</svg>
		<span>Tijdlijn</span>
	</button>
</div>

<style>
	.style-components {
		padding: 1rem;
	}

	h3 {
		margin: 0 0 1rem 0;
		padding: 0 0.5rem;
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: #6b7280;
	}

	.style-component-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.875rem 1rem;
		background: white;
		border: 1px solid #e5e7eb;
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.15s ease;
		text-align: left;
		width: 100%;
		margin-bottom: 0.5rem;
	}

	.style-component-item:hover {
		background: #f9fafb;
		border-color: #d1d5db;
		transform: translateY(-1px);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
	}

	.style-component-item.active {
		background: #fef2f2;
		border-color: #d10a10;
		box-shadow: 0 0 0 3px rgba(209, 10, 16, 0.1);
	}

	.component-icon {
		width: 20px;
		height: 20px;
		stroke-width: 2;
		flex-shrink: 0;
		color: #6b7280;
		transition: color 0.15s ease;
	}

	.style-component-item.active .component-icon {
		color: #d10a10;
	}

	.style-component-item span {
		font-size: 0.9375rem;
		font-weight: 500;
		color: #374151;
	}

	.style-component-item.active span {
		color: #d10a10;
		font-weight: 600;
	}
</style>
