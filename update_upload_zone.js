const fs = require('fs');

let css = fs.readFileSync('src/app/solution-strategy-v2/page.module.css', 'utf-8');

// Replace uploadZone
css = css.replace(/\.uploadZone\s*\{[\s\S]*?\}/, `
.uploadZone {
  background-color: var(--Background-Plain-200, #EDEDED);
  border: 2px dashed var(--Background-Plain-400, #E0E0E0);
  border-radius: 12px;
  padding: var(--space-6);
  text-align: center;
  cursor: pointer;
  transition: all var(--duration-fast);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: visible;
  box-sizing: border-box;
  width: 100%;
}
`);

// Replace uploadZone:hover
css = css.replace(/\.uploadZone:hover\s*\{[\s\S]*?\}/, `
.uploadZone:hover {
  background-color: var(--Background-Plain-300, #E0E0E0);
  border-color: var(--Background-Plain-500, #BDBDBD);
}
`);

// Replace uploadZone.isDragging
css = css.replace(/\.uploadZone\.isDragging\s*\{[\s\S]*?\}/, `
.uploadZone.isDragging {
  border-style: solid;
  background-color: var(--Background-Plain-300, #E0E0E0);
  border-color: var(--Lavender-600, #7673E0);
}
`);

// Replace uploadIconCircle
css = css.replace(/\.uploadIconCircle\s*\{[\s\S]*?\}/, `
.uploadIconCircle {
  width: 48px;
  height: 48px;
  background: var(--White, #ffffff);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--space-3);
  box-shadow: 0px 2px 8px rgba(0,0,0,0.05);
}
`);

// Replace uploadIconCircle svg
css = css.replace(/\.uploadIconCircle\s+svg\s*\{[\s\S]*?\}/, `
.uploadIconCircle svg {
  width: 24px;
  height: 24px;
  color: var(--Content-Primary-600, #292929);
}
`);

fs.writeFileSync('src/app/solution-strategy-v2/page.module.css', css, 'utf-8');
console.log("updated");
