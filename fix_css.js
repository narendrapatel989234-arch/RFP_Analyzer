const fs = require('fs');
let css = fs.readFileSync('src/app/solution-strategy-v2/page.module.css', 'utf-8');

// I will fix the smallGenerateBtn class manually using regex
css = css.replace(/\.smallGenerateBtn\s*\{[\s\S]*?\}/, `
.smallGenerateBtn {
  background: var(--Content-Primary-600);
  color: var(--White, #ffffff);
  font-weight: var(--weight-bold);
  font-size: var(--text-xs);
  border: none;
  border-radius: 9999px;
  padding: var(--space-2) var(--space-5);
  cursor: pointer;
  transition: background var(--duration-fast);
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
}
`);

// Put back .generateBtn:disabled if it was removed
if (!css.includes('.generateBtn:disabled')) {
  css = css.replace(/\.smallGenerateBtn/, `
.generateBtn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.smallGenerateBtn`);
}

fs.writeFileSync('src/app/solution-strategy-v2/page.module.css', css, 'utf-8');
console.log("Fixed page.module.css");
