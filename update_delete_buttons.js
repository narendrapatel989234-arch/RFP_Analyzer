const fs = require('fs');

let css = fs.readFileSync('src/app/know-your-client-v2/page.module.css', 'utf-8');

// Update .trashBtnList
css = css.replace(/(\.trashBtnList\s*\{[^}]*background:\s*)transparent([^}]*\})/g, '$1color-mix(in srgb, var(--status-red) 12%, transparent)$2');
css = css.replace(/(\.trashBtnList\s*\{[^}]*color:\s*)var\(--Content-Primary-400\)([^}]*\})/g, '$1var(--status-red)$2');
css = css.replace(/(\.trashBtnList:hover\s*\{[^}]*background:\s*)color-mix\(in srgb, var\(--status-red\) 10%, transparent\)([^}]*\})/g, '$1color-mix(in srgb, var(--status-red) 20%, transparent)$2');

// Update .extractedToolbarTrash
css = css.replace(/(\.extractedToolbarTrash\s*\{[^}]*background-color:\s*)transparent([^}]*\})/g, '$1color-mix(in srgb, var(--status-red) 12%, transparent)$2');
css = css.replace(/(\.extractedToolbarTrash\s*\{[^}]*color:\s*)var\(--Content-Primary-400\)([^}]*\})/g, '$1var(--status-red)$2');
css = css.replace(/(\.extractedToolbarTrash:hover\s*\{[^}]*background-color:\s*)color-mix\(in srgb, var\(--status-red\) 10%, transparent\)([^}]*\})/g, '$1color-mix(in srgb, var(--status-red) 20%, transparent)$2');

// Update .extractedCardDeleteBtn
css = css.replace(/(\.extractedCardDeleteBtn\s*\{[^}]*background:\s*)transparent([^}]*\})/g, '$1color-mix(in srgb, var(--status-red) 12%, transparent)$2');
css = css.replace(/(\.extractedCardDeleteBtn\s*\{[^}]*color:\s*)var\(--Content-Primary-400\)([^}]*\})/g, '$1var(--status-red)$2');
css = css.replace(/(\.extractedCardDeleteBtn:hover\s*\{[^}]*background:\s*)color-mix\(in srgb, var\(--status-red\) 10%, transparent\)([^}]*\})/g, '$1color-mix(in srgb, var(--status-red) 20%, transparent)$2');

fs.writeFileSync('src/app/know-your-client-v2/page.module.css', css, 'utf-8');
console.log("updated");
