const fs = require('fs');
let css = fs.readFileSync('src/components/CapabilitiesModalV2.module.css', 'utf-8');

css = css.replace(/var\(--action-primary-bg-default\)/g, 'var(--Lavender-600)');
css = css.replace(/var\(--action-primary-bg-default, #5c4d43\)/g, 'var(--Content-Primary-600)');
css = css.replace(/var\(--action-primary-bg-hover, #4a3e36\)/g, 'var(--Content-Primary-500)');
css = css.replace(/var\(--action-primary-text, #fff\)/g, 'var(--White, #ffffff)');

css = css.replace(/\.saveBtn\s*\{[\s\S]*?\}/, `
.saveBtn {
  padding: var(--space-2) var(--space-5);
  font-size: var(--text-xs);
  font-weight: var(--weight-bold);
  color: var(--White, #ffffff);
  background: var(--Content-Primary-600);
  border: none;
  border-radius: 9999px;
  cursor: pointer;
  transition: background var(--duration-fast, 0.2s) ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
`);

css = css.replace(/\.cancelBtn\s*\{[\s\S]*?\}/, `
.cancelBtn {
  padding: var(--space-2) var(--space-4);
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  color: var(--text-secondary);
  background: transparent;
  border: 1px solid var(--border-strong, #d1d5db);
  border-radius: 9999px;
  cursor: pointer;
  transition: all 0.2s ease;
}
`);

fs.writeFileSync('src/components/CapabilitiesModalV2.module.css', css, 'utf-8');
console.log("Updated CapabilitiesModalV2.module.css");
