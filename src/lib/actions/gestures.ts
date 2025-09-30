interface GestureParams {
    onSwipe?: (detail: { direction: 'left' | 'right' }) => void;
    onPinch?: (detail: { scale: number }) => void;
    onTouchStart?: () => void;
}

export function gestures(node: HTMLElement, params: GestureParams) {
    let x: number;
    let initialDistance: number;

    function handleTouchStart(e: TouchEvent) {
        params.onTouchStart?.();
        x = e.touches[0].clientX;
        if (e.touches.length > 1) {
            initialDistance = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );
        }
    }

    function handleTouchMove(e: TouchEvent) {
        if (!x || e.touches.length === 0) return;

        if (e.touches.length > 1 && initialDistance) {
            const newDistance = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );
            const scale = newDistance / initialDistance;
            params.onPinch?.({ scale });
            return;
        }

        const dx = e.touches[0].clientX - x;
        if (Math.abs(dx) > 40) {
            const direction = dx > 0 ? 'right' : 'left';
            params.onSwipe?.({ direction });
            x = 0;
        }
    }

    function handleTouchEnd() {
        x = 0;
        initialDistance = 0;
    }

    node.addEventListener('touchstart', handleTouchStart, { passive: true });
    node.addEventListener('touchmove', handleTouchMove, { passive: true });
    node.addEventListener('touchend', handleTouchEnd, { passive: true });

    return {
        destroy() {
            node.removeEventListener('touchstart', handleTouchStart);
            node.removeEventListener('touchmove', handleTouchMove);
            node.removeEventListener('touchend', handleTouchEnd);
        }
    };
}