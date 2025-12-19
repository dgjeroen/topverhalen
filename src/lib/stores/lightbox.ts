import { writable } from 'svelte/store';

// Definieer hoe een afbeelding-object voor de lightbox eruitziet
export interface LightboxImage {
	url: string;
	caption?: string;
	source?: string;
}

// De initiële, 'gesloten' staat van de store
const initialState = {
	isOpen: false,
	images: [] as LightboxImage[],
	currentIndex: 0
};

// De store zelf
const store = writable(initialState);

// Exporteer de store en helper-functies
export const lightbox = {
	subscribe: store.subscribe,
	open: (images: LightboxImage[], startIndex = 0) => {
		store.set({
			isOpen: true,
			images: images,
			currentIndex: startIndex
		});
	},
	close: () => store.set(initialState),
	next: () =>
		store.update((state) => ({
			...state,
			currentIndex: (state.currentIndex + 1) % state.images.length
		})),
	prev: () =>
		store.update((state) => ({
			...state,
			currentIndex: (state.currentIndex - 1 + state.images.length) % state.images.length
		}))
};
