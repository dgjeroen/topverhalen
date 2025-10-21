import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ url }) => {
    // ✅ Layout hoeft geen content te laden
    // Content wordt per pagina geladen via +page.server.ts

    // Skip voor CMS routes
    if (url.pathname.startsWith('/cms')) {
        return {};
    }

    // ✅ Hier kun je later globale data toevoegen zoals:
    // - Theme settings
    // - GTM config
    // - Navigation menu
    // - Footer data

    return {};
};