import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

/**
 * Vervangt absolute paden (/_app/) met relatieve (./_app/) in alle HTML/JS bestanden
 */
function fixPaths(dir) {
    const entries = readdirSync(dir);

    for (const entry of entries) {
        const fullPath = join(dir, entry);
        const stat = statSync(fullPath);

        if (stat.isDirectory()) {
            fixPaths(fullPath);
        } else if (entry.endsWith('.html') || entry.endsWith('.js')) {
            let content = readFileSync(fullPath, 'utf-8');

            // Vervang absolute paden met relatieve
            const updated = content
                .replace(/"\/_app\//g, '"./_app/')
                .replace(/'\/_app\//g, "'./app/")
                .replace(/`\/_app\//g, '`./app/')
                .replace(/href="\/_app/g, 'href="./_app')
                .replace(/src="\/_app/g, 'src="./_app')
                .replace(/import\("\/_app/g, 'import("./_app');

            if (content !== updated) {
                writeFileSync(fullPath, updated);
                console.log('✅ Fixed:', fullPath);
            }
        }
    }
}

console.log('🔧 Fixing absolute paths in build folder...');
fixPaths('./build');
console.log('✅ All paths fixed!');