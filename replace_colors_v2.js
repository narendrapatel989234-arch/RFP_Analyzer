const fs = require('fs');

let css = fs.readFileSync('src/app/solution-strategy-v2/page.module.css', 'utf-8');

// Layout classes
css = css.replace(/\.page \{[^}]*\}/, `
.layout {
  display: flex;
  height: 100vh;
  background-color: var(--Background-Secondary-Plain, #eeeeee);
  padding: 8px;
  gap: 8px;
  overflow: hidden;
}

.mainContent {
  flex: 1;
  background-color: var(--White, #ffffff);
  border-radius: 12px;
  padding: 24px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.contentMaxWidth {
  width: 100%;
  max-width: 1600px;
  height: 100%;
  min-height: 0;
  min-width: 0;
  margin: 0 auto;
  display: flex;
  flex-direction: row;
  gap: 32px;
}

.stepperSidebar {
  flex: 0 0 260px;
  background: var(--Background-Plain-100, #FAFAFA);
  padding: 24px 24px;
  border-radius: 12px;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.stepperSidebar::-webkit-scrollbar {
  display: none;
}

.rightContent {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
  height: 100%;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.rightContent::-webkit-scrollbar {
  display: none;
}
`);

css = css.replace(/\.container \{[^}]*\}/, `
.backButton {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--text-primary);
  text-decoration: none;
  font-weight: var(--weight-semibold);
  font-size: var(--text-sm);
  transition: opacity 0.2s;
  width: fit-content;
  margin-bottom: var(--space-2);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}
`);

css = css.replace(/\.backButton \{[^}]*\}/, '');

// 1. Document icon container backgrounds
css = css.replace(/(\.fileListIconWrapper\s*\{[^}]*background:\s*)var\(--action-primary-bg-soft\)([^}]*\})/g, '$1var(--Background-Plain-300)$2');

// 2. File icons themselves
css = css.replace(/(\.fileListIconWrapper\s*\{[^}]*color:\s*)var\(--action-primary-bg-pressed\)([^}]*\})/g, '$1var(--Content-Primary-400)$2');
css = css.replace(/(\.extractedToolbarIcon\s*\{[^}]*background-color:\s*)var\(--action-primary-bg-soft\)([^}]*\})/g, '$1var(--Background-Plain-300)$2');
css = css.replace(/(\.extractedToolbarIcon\s*\{[^}]*color:\s*)var\(--action-primary-bg-pressed\)([^}]*\})/g, '$1var(--Content-Primary-400)$2');
css = css.replace(/(\.uploadIconCircle\s*\{[^}]*background:\s*)var\(--bg-surface-2\)([^}]*\})/g, '$1var(--Background-Plain-300)$2');

// 3. Delete icon button (trashBtnList & extractedToolbarTrash & extractedCardDeleteBtn)
css = css.replace(/(\.trashBtnList\s*\{[^}]*background:\s*)var\(--status-error-bg\)([^}]*\})/g, '$1color-mix(in srgb, var(--status-red) 12%, transparent)$2');
css = css.replace(/(\.trashBtnList\s*\{[^}]*color:\s*)var\(--status-error-icon\)([^}]*\})/g, '$1var(--status-red)$2');
css = css.replace(/(\.trashBtnList:hover\s*\{[^}]*background:\s*)var\(--action-destructive-bg-default\)([^}]*\})/g, '$1color-mix(in srgb, var(--status-red) 20%, transparent)$2');
css = css.replace(/(\.trashBtnList:hover\s*\{[^}]*color:\s*)var\(--action-destructive-text\)([^}]*\})/g, '$1var(--status-red)$2');

css = css.replace(/(\.extractedToolbarTrash\s*\{[^}]*background-color:\s*)var\(--status-error-bg\)([^}]*\})/g, '$1color-mix(in srgb, var(--status-red) 12%, transparent)$2');
css = css.replace(/(\.extractedToolbarTrash\s*\{[^}]*color:\s*)var\(--status-error-icon\)([^}]*\})/g, '$1var(--status-red)$2');
css = css.replace(/(\.extractedToolbarTrash:hover\s*\{[^}]*)opacity:\s*0\.8/g, '$1background-color: color-mix(in srgb, var(--status-red) 20%, transparent);\n  color: var(--status-red)');

css = css.replace(/(\.extractedCardDeleteBtn\s*\{[^}]*background:\s*)var\(--status-error-bg\)([^}]*\})/g, '$1color-mix(in srgb, var(--status-red) 12%, transparent)$2');
css = css.replace(/(\.extractedCardDeleteBtn\s*\{[^}]*color:\s*)var\(--status-error-icon\)([^}]*\})/g, '$1var(--status-red)$2');
css = css.replace(/(\.extractedCardDeleteBtn:hover\s*\{[^}]*background:\s*)var\(--action-destructive-bg-default\)([^}]*\})/g, '$1color-mix(in srgb, var(--status-red) 20%, transparent)$2');
css = css.replace(/(\.extractedCardDeleteBtn:hover\s*\{[^}]*color:\s*)var\(--action-destructive-text\)([^}]*\})/g, '$1var(--status-red)$2');

// 4. Buttons styling (border-radius: 9999px)
css = css.replace(/(\.addCapabilitiesBtn\s*\{[^}]*color:\s*)var\(--action-primary-bg-default\)([^}]*\})/g, '$1var(--Lavender-600)$2');
css = css.replace(/(\.submitBtn\s*\{[^}]*)border-radius:\s*var\(--radius-md\)/g, '$1border-radius: 9999px');
// add pill shape to any other buttons if needed, outlineNextBtn will be added at bottom.

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

css += `
.outlineNextBtn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-6);
  background: transparent;
  color: var(--Content-Primary-600, #111827);
  border: 1px solid var(--border-strong, #d1d5db);
  border-radius: 9999px;
  font-weight: var(--weight-bold);
  font-size: var(--text-sm);
  cursor: pointer;
  transition: all 0.2s;
}
.outlineNextBtn:hover {
  background: var(--Content-Primary-600);
  color: var(--White, #ffffff);
}
`

fs.writeFileSync('src/app/solution-strategy-v2/page.module.css', css, 'utf-8');

// Also update page.tsx
let tsx = fs.readFileSync('src/app/solution-strategy-v2/page.tsx', 'utf-8');

tsx = tsx.split("Response Configuration").join("Solution Strategy");
tsx = tsx.split("#d97706").join("var(--Lavender-600)");
tsx = tsx.split("var(--border-subtle)").join("var(--Background-Plain-400)");

fs.writeFileSync('src/app/solution-strategy-v2/page.tsx', tsx, 'utf-8');

console.log("done");
