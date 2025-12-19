// src/lib/stores/saveManager.ts
import { writable, derived } from 'svelte/store';

interface RateLimitInfo {
	remaining: number;
	limit: number;
	reset: number;
	usagePercent: number;
}

interface SaveState {
	isSaving: boolean;
	hasUnsavedChanges: boolean;
	lastSaved: number | null;
	lastError: string | null;
	currentDebounceDelay: number;
	rateLimitInfo: RateLimitInfo | null;
}

const initialState: SaveState = {
	isSaving: false,
	hasUnsavedChanges: false,
	lastSaved: null,
	lastError: null,
	currentDebounceDelay: 30000, // 30 seconden default
	rateLimitInfo: null
};

function createSaveManager() {
	const { subscribe, set, update } = writable<SaveState>(initialState);

	return {
		subscribe,

		setRateLimitInfo(remaining: number, limit: number, reset: number) {
			update((state) => {
				const usagePercent = ((limit - remaining) / limit) * 100;

				// Adaptive debounce logic
				let newDelay = 30000; // Default 30s

				if (usagePercent > 90) {
					newDelay = 120000; // 2 minuten (critical)
				} else if (usagePercent > 80) {
					newDelay = 60000; // 1 minuut (warning)
				} else if (usagePercent > 60) {
					newDelay = 45000; // 45 seconden (caution)
				}

				return {
					...state,
					currentDebounceDelay: newDelay,
					rateLimitInfo: {
						remaining,
						limit,
						reset,
						usagePercent
					}
				};
			});
		},

		setSaving(isSaving: boolean) {
			update((state) => ({ ...state, isSaving }));
		},

		setUnsavedChanges(hasChanges: boolean) {
			update((state) => ({ ...state, hasUnsavedChanges: hasChanges }));
		},

		setSaved() {
			update((state) => ({
				...state,
				isSaving: false,
				hasUnsavedChanges: false,
				lastSaved: Date.now(),
				lastError: null
			}));
		},

		setError(error: string) {
			update((state) => ({
				...state,
				isSaving: false,
				lastError: error,
				// Verhoog debounce bij error
				currentDebounceDelay: Math.min(state.currentDebounceDelay * 2, 300000) // Max 5 min
			}));
		},

		resetDebounce() {
			update((state) => ({
				...state,
				currentDebounceDelay: 30000
			}));
		},

		reset() {
			set(initialState);
		}
	};
}

export const saveManager = createSaveManager();

// Derived stores voor UI
export const rateLimitWarning = derived(saveManager, ($saveManager) => {
	if (!$saveManager.rateLimitInfo) return null;

	const { usagePercent, remaining, reset } = $saveManager.rateLimitInfo;

	if (usagePercent > 90) {
		return {
			level: 'critical',
			message: `Kritiek: Nog ${remaining} requests over. Auto-save vertraagd naar 2 minuten.`,
			resetTime: new Date(reset * 1000)
		};
	} else if (usagePercent > 80) {
		return {
			level: 'warning',
			message: `Waarschuwing: Nog ${remaining} requests over. Auto-save vertraagd naar 1 minuut.`,
			resetTime: new Date(reset * 1000)
		};
	} else if (usagePercent > 60) {
		return {
			level: 'caution',
			message: `Let op: ${Math.round(usagePercent)}% van rate limit gebruikt.`,
			resetTime: new Date(reset * 1000)
		};
	}

	return null;
});
