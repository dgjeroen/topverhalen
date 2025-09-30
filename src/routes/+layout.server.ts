// src/routes/+layout.server.ts
import { PUBLIC_GTM_ID } from '$env/static/public';
import type { LayoutServerLoad } from './$types';

// Deze blijft! Het zorgt ervoor dat je site statisch blijft.
export const prerender = true;

// Deze voegen we toe om de data te laden tijdens de build.
export const load: LayoutServerLoad = () => {
    return {
        gtmId: PUBLIC_GTM_ID
    };
};