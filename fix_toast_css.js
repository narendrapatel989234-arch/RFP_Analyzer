const fs = require('fs');
let css = fs.readFileSync('src/app/solution-strategy-v2/page.module.css', 'utf-8');

// The multi_replace unfortunately deleted the whole .toast class and the @keyframes slideDown.
// Let's insert them back right before `.extractedCard {`

css = css.replace(/\/\* Extraction Cards \*\//, `/* Toast */
.toast {
  position: fixed;
  top: 24px;
  right: 24px;
  background: color-mix(in srgb, var(--colors-status-green) 12%, var(--bg-surface-1));
  border: 1px solid var(--status-success-border);
  color: var(--status-success-text);
  padding: var(--space-4) var(--space-6);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  gap: var(--space-3);
  box-shadow: var(--shadow-2);
  font-weight: var(--weight-semibold);
  font-size: var(--text-sm);
  z-index: var(--z-toast);
  animation: slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Extraction Cards */`);

fs.writeFileSync('src/app/solution-strategy-v2/page.module.css', css, 'utf-8');
console.log("Fixed toast CSS");
