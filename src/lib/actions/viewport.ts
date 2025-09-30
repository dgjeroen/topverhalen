import type { Action } from 'svelte/action';

interface ViewportOptions {
    once?: boolean; // Moet de class worden verwijderd als het element uit beeld is?
    className?: string; // Welke class voegen we toe?
}

/**
 * Een Svelte Action die een class toevoegt aan een element
 * wanneer het in de viewport verschijnt.
**/
export const viewport: Action<HTMLElement, ViewportOptions | undefined> = (node, options) => {
    const once = options?.once ?? true;
    const className = options?.className ?? 'in-view';
    let observer: IntersectionObserver;

    const observerCallback: IntersectionObserverCallback = (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
            node.classList.add(className);
            if (once) {
                observer.disconnect();
            }
        } else {
            if (!once) {
                node.classList.remove(className);
            }
        }
    };

    observer = new IntersectionObserver(observerCallback, { threshold: 0.5 });
    observer.observe(node);

    return {
        destroy() {
            observer.disconnect();
        }
    };
};