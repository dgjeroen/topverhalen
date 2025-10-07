<script lang="ts">
    import type { SliderContent } from '$lib/types';
    import { lightbox } from '$lib/stores/lightbox';
    import { onMount } from 'svelte';
    
    type ImageWithOrientation = SliderContent['images'][0] & { orientation?: 'portrait' | 'landscape' };
    export let images: ImageWithOrientation[];
    
    let currentIndex = 0;
    $: currentImage = images[currentIndex];
    
    let touchstartX = 0;
    let touchendX = 0;
    const swipeThreshold = 50;
    
    let sliderViewport: HTMLDivElement;

    // Nieuwe variabele om te controleren of de afbeeldingen zijn geladen
    let isLoaded = false;
    
    onMount(async () => {
        const processedImages = await Promise.all(
            images.map(image => new Promise<ImageWithOrientation>((resolve) => {
                const img = new Image();
                img.onload = () => {
                    const orientation = img.height > img.width ? 'portrait' : 'landscape';
                    resolve({ ...image, orientation });
                };
                img.src = image.url;
            }))
        );
        images = processedImages;
        isLoaded = true; // Stel isLoaded in op true na het verwerken
        
        if (sliderViewport) {
            sliderViewport.focus({ preventScroll: true });
        }
    });
    
    function handleTouchStart(e: TouchEvent) {
        touchstartX = e.changedTouches[0].screenX;
    }
    
    function handleTouchEnd(e: TouchEvent) {
        touchendX = e.changedTouches[0].screenX;
        const swipeDistance = touchendX - touchstartX;
        
        if (swipeDistance > swipeThreshold) {
            prev();
        }
        if (swipeDistance < -swipeThreshold) {
            next();
        }
    }
    
    function next() {
        currentIndex = (currentIndex + 1) % images.length;
    }
    function prev() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
    }
    function goTo(index: number) {
        currentIndex = index;
    }
    
</script>

<figure class="slider-container">
    <div
        class="slider-viewport"
        role="button"
        tabindex="0"
        bind:this={sliderViewport}
        onclick={() => {
            lightbox.open(images, currentIndex);
            sliderViewport.focus();
        }}
        onkeydown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                lightbox.open(images, currentIndex);
            }
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                prev();
            }
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                next();
            }
        }}
        aria-label="Open afbeelding in lightbox"
        ontouchstart={handleTouchStart}
        ontouchend={handleTouchEnd}
    >
        <div class="dots-nav">
            {#each images as _, i}
                <button
                    class:active={currentIndex === i}
                    tabindex="0"
                    onclick={(e) => {
                        e.stopPropagation();
                        goTo(i);
                        sliderViewport.focus();
                    }}
                    onkeydown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            goTo(i);
                        }
                    }}
                    aria-label="Ga naar slide {i + 1}"
                ></button>
            {/each}
        </div>
        
        {#if isLoaded}
            <div class="slides" style:transform="translateX(-{currentIndex * 100}%)">
                {#each images as image}
                    <div 
                        class="slide" 
                        class:is-portrait={image.orientation === 'portrait'}
                        class:is-landscape={image.orientation === 'landscape'}
                        style:background-image="url({image.url})">
                    </div>
                {/each}
            </div>
        {/if}

        <button
            class="slider-btn prev"
            onclick={(e) => {
                e.stopPropagation();
                prev();
                sliderViewport.focus();
            }}
            aria-label="Vorige slide">‹</button>
        <button
            class="slider-btn next"
            onclick={(e) => {
                e.stopPropagation();
                next();
                sliderViewport.focus();
            }}
            aria-label="Volgende slide">›</button>
    </div>

    <figcaption class="slider-footer">
        <span class="caption">{currentImage.caption}</span>
        {#if currentImage.source}<span class="source">{currentImage.source}</span>{/if}
    </figcaption>
</figure>

<style>
    /* CSS blijft hetzelfde */
    .slider-container {
        position: relative;
        margin: 0;
    }
    .slider-viewport {
        overflow: hidden;
        border-radius: var(--border-radius-base);
        position: relative;
        height: 0;
        padding-bottom: 56.25%;
        cursor: pointer;
        background-color: var(--color-background-light);
        transition: box-shadow 0.2s ease-in-out; /* Voeg een overgang toe voor een vloeiend effect */
    }

    /* Verwijder de standaard outline bij focus */
    .slider-viewport:focus {
        outline: none;
        box-shadow: 0 0 0 4px var(--color-primary-light); /* Voeg een subtiele box-shadow toe als alternatieve focus-indicator */
    }

    /* Verbetering voor betere toegankelijkheid (gebruikers die met de muis klikken krijgen geen focus-stijl) */
    .slider-viewport:focus:not(:focus-visible) {
        box-shadow: none;
    }
    
    .slides {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        transition: transform 0.5s cubic-bezier(0.77, 0, 0.175, 1);
    }
    .slide {
        flex: 0 0 100%;
        min-width: 100%;
        background-repeat: no-repeat;
        background-position: center;
        background-color: var(--color-background-dark); /* Voegt een achtergrondkleur toe voor de lege ruimte */
    }
        .slide.is-landscape {
        background-size: cover;
    }
        .slide.is-portrait {
        background-size: contain;
        }

    .slider-btn {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        background-color: rgba(255, 255, 255, 0.5);
        color: var(--color-white);
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        cursor: pointer;
        transition: background-color 0.2s;
        z-index: 30;
    }
    .slider-btn:hover {
        background-color: rgba(255, 255, 255, 0.5);
    }
    .slider-btn.prev {
        left: var(--space-s);
    }
    .slider-btn.next {
        right: var(--space-s);
    }
    figcaption.slider-footer {
        padding-top: var(--space-s);
        color: var(--color-text-muted);
        font-size: var(--font-size-s);
        display: block;
        overflow: hidden;
    }
    .caption {
        display: inline;
    }
    .source {
        font-style: italic;
        white-space: nowrap;
        float: right;
        margin-left: var(--space-xs);
    }
    .dots-nav {
        position: absolute;
        bottom: var(--space-s);
        left: 50%;
        transform: translateX(-50%);
        z-index: 20;
        display: flex;
        gap: 8px;
        background: rgba(255, 255, 255, 0.5);
        padding: 4px 8px;
        border-radius: 12px;
    }
    .dots-nav button {
        width: 16px;
        height: 16px;
        aspect-ratio: 1/1;
        border-radius: 50%;
        border: 1px solid var(--color-border);
        background-color: transparent;
        margin: 0 4px;
        cursor: pointer;
        transition: background-color 0.2s;
        outline: none;
    }
    .dots-nav button:focus {
        box-shadow: 0 0 0 2px var(--color-primary);
    }
    .dots-nav button.active {
        background-color: #ffd302;
        border: 0.5px solid #000000;
    }
</style>