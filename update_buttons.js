const fs = require('fs');
let css = fs.readFileSync('src/app/solution-strategy-v2/page.module.css', 'utf-8');

css = css.replace(/\.clearBtn\s*\{[\s\S]*?\}/, `
.clearBtn {
  background-color: transparent;
  border: 1px solid var(--Background-Plain-400);
  border-radius: 9999px;
  color: var(--text-secondary);
  font-size: var(--text-base);
  font-weight: var(--weight-medium);
  padding: var(--space-3) var(--space-8);
  cursor: pointer;
  transition: all var(--duration-fast);
}
`.trim());

css = css.replace(/\.submitBtn\s*\{[\s\S]*?\}/, `
.submitBtn {
  background: var(--Content-Primary-600);
  color: var(--White, #ffffff);
  font-weight: var(--weight-bold);
  font-size: var(--text-base);
  border: none;
  border-radius: 9999px;
  padding: var(--space-3) var(--space-10);
  cursor: pointer;
  transition: background var(--duration-fast);
}
`.trim());

css = css.replace(/\.submitBtn:hover:not\(:disabled\)\s*\{[\s\S]*?\}/, `
.submitBtn:hover:not(:disabled) {
  background: var(--Content-Primary-500);
}
`.trim());

css = css.replace(/\.submitBtn:disabled\s*\{[\s\S]*?\}/, `
.submitBtn:disabled {
  background-color: var(--Background-Plain-400);
  color: var(--Content-Primary-400);
  cursor: not-allowed;
}
`.trim());

fs.writeFileSync('src/app/solution-strategy-v2/page.module.css', css, 'utf-8');
console.log("Updated buttons in CSS");
