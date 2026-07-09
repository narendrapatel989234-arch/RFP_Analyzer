const fs = require('fs');

let css = fs.readFileSync('src/app/know-your-client-v2/page.module.css', 'utf-8');

// 1. Document icon container backgrounds
css = css.replace(/(\.fileListIconWrapper\s*\{[^}]*background:\s*)var\(--action-primary-bg-soft\)([^}]*\})/g, '$1var(--Background-Plain-300)$2');

// 2. File icons themselves
css = css.replace(/(\.fileListIconWrapper\s*\{[^}]*color:\s*)var\(--action-primary-bg-pressed\)([^}]*\})/g, '$1var(--Content-Primary-400)$2');
css = css.replace(/(\.extractedToolbarIcon\s*\{[^}]*background-color:\s*)var\(--action-primary-bg-soft\)([^}]*\})/g, '$1var(--Background-Plain-300)$2');
css = css.replace(/(\.extractedToolbarIcon\s*\{[^}]*color:\s*)var\(--action-primary-bg-pressed\)([^}]*\})/g, '$1var(--Content-Primary-400)$2');
css = css.replace(/(\.uploadIconCircle\s*\{[^}]*background:\s*)var\(--bg-surface-2\)([^}]*\})/g, '$1var(--Background-Plain-300)$2');

// 3. Delete icon button (trashBtnList & extractedToolbarTrash & extractedCardDeleteBtn)
css = css.replace(/(\.trashBtnList\s*\{[^}]*background:\s*)var\(--status-error-bg\)([^}]*\})/g, '$1transparent$2');
css = css.replace(/(\.trashBtnList\s*\{[^}]*color:\s*)var\(--status-error-icon\)([^}]*\})/g, '$1var(--Content-Primary-400)$2');
css = css.replace(/(\.trashBtnList:hover\s*\{[^}]*background:\s*)var\(--action-destructive-bg-default\)([^}]*\})/g, '$1color-mix(in srgb, var(--status-red) 10%, transparent)$2');
css = css.replace(/(\.trashBtnList:hover\s*\{[^}]*color:\s*)var\(--action-destructive-text\)([^}]*\})/g, '$1var(--status-red)$2');

css = css.replace(/(\.extractedToolbarTrash\s*\{[^}]*background-color:\s*)var\(--status-error-bg\)([^}]*\})/g, '$1transparent$2');
css = css.replace(/(\.extractedToolbarTrash\s*\{[^}]*color:\s*)var\(--status-error-icon\)([^}]*\})/g, '$1var(--Content-Primary-400)$2');
css = css.replace(/(\.extractedToolbarTrash:hover\s*\{[^}]*)opacity:\s*0\.8/g, '$1background-color: color-mix(in srgb, var(--status-red) 10%, transparent);\n  color: var(--status-red)');

css = css.replace(/(\.extractedCardDeleteBtn\s*\{[^}]*background:\s*)var\(--status-error-bg\)([^}]*\})/g, '$1transparent$2');
css = css.replace(/(\.extractedCardDeleteBtn\s*\{[^}]*color:\s*)var\(--status-error-icon\)([^}]*\})/g, '$1var(--Content-Primary-400)$2');
css = css.replace(/(\.extractedCardDeleteBtn:hover\s*\{[^}]*background:\s*)var\(--action-destructive-bg-default\)([^}]*\})/g, '$1color-mix(in srgb, var(--status-red) 10%, transparent)$2');
css = css.replace(/(\.extractedCardDeleteBtn:hover\s*\{[^}]*color:\s*)var\(--action-destructive-text\)([^}]*\})/g, '$1var(--status-red)$2');

// 4. "+ Add Document" button text color
css = css.replace(/(\.addCapabilitiesBtn\s*\{[^}]*color:\s*)var\(--action-primary-bg-default\)([^}]*\})/g, '$1var(--Lavender-600)$2');

// 5 & 6. Active tab underline and active tab label text (.summaryTabActive)
css = css.replace(/(\.summaryTabActive\s*\{[^}]*color:\s*)var\(--action-primary-bg-default[^)]*\)([^}]*\})/g, '$1var(--Content-Primary-600)$2');
css = css.replace(/(\.summaryTabActive\s*\{[^}]*border-bottom:\s*2px solid\s*)var\(--action-primary-bg-default[^)]*\)([^}]*\})/g, '$1var(--Lavender-600)$2');

// 7. "Refresh Summary" button color (.refreshBtn)
css = css.replace(/(\.refreshBtn\s*\{[^}]*color:\s*)var\(--action-primary-bg-default\)([^}]*\})/g, '$1var(--Content-Primary-300)$2');

// 8. Remaining warm/beige border colors on cards (replace with --Background-Plain-400)
css = css.split('var(--border-default)').join('var(--Background-Plain-400)');
css = css.split('var(--border-subtle)').join('var(--Background-Plain-400)');

// 9. Scan for old hex values/old brand tokens
css = css.split('var(--action-primary-bg-soft)').join('var(--Background-Plain-300)');
css = css.split('var(--action-primary-bg-pressed)').join('var(--Content-Primary-600)');
css = css.split('var(--action-primary-bg-default)').join('var(--Lavender-600)');
css = css.split('var(--action-primary-bg-hover)').join('var(--Lavender-500)');
css = css.split('var(--action-primary-bg-soft-hover)').join('var(--Background-Plain-400)');
css = css.split('var(--action-primary-text)').join('var(--White, #ffffff)');
css = css.split('#f7f7f7').join('var(--Background-Plain-200)');

fs.writeFileSync('src/app/know-your-client-v2/page.module.css', css, 'utf-8');

// Also update page.tsx
let tsx = fs.readFileSync('src/app/know-your-client-v2/page.tsx', 'utf-8');

tsx = tsx.split("#d97706").join("var(--Lavender-600)");
tsx = tsx.split("var(--border-subtle)").join("var(--Background-Plain-400)");

fs.writeFileSync('src/app/know-your-client-v2/page.tsx', tsx, 'utf-8');

console.log("done");
