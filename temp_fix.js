const fs = require('fs');
let css = fs.readFileSync('src/app/solution-strategy-v2/page.module.css', 'utf-8');

// I know lines 472 to 476 are currently:
//   gap: var(--space-2);
// }
//
// Let's replace that with the correct `.smallGenerateBtn` code.
// Actually, let's just search for `.generateBtn:disabled {` and insert `.smallGenerateBtn` before it if it's missing, and clean up that weird gap.

css = css.replace(/  gap: var\(--space-2\);\r?\n\}\r?\n\r?\n\r?\n\.generateBtn:disabled/, `.smallGenerateBtn {
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

.smallGenerateBtn:hover {
  background: var(--Content-Primary-500);
}

.generateBtn:disabled`);

fs.writeFileSync('src/app/solution-strategy-v2/page.module.css', css, 'utf-8');
console.log("Fixed page.module.css smallGenerateBtn");
