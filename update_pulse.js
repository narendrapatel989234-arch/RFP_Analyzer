const fs = require('fs');

let css = fs.readFileSync('src/components/ProcessingRFPModal.module.css', 'utf-8');

// Update spinnerWrapper
css = css.replace(/\.spinnerWrapper\s*\{[\s\S]*?\}/, `.spinnerWrapper {
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto 24px auto;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--Lavender-100, #E9E8FA);
  border-radius: 50%;
}`);

// Replace smallSpinner with pulseCircle
css = css.replace(/\.smallSpinner\s*\{[\s\S]*?\}/, `.pulseCircle {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: transparent;
  border: 2px solid var(--Background-Plain-300, #EDEDED);
  animation: pulseBorder 1.5s ease-in-out infinite alternate;
}

@keyframes pulseBorder {
  0% {
    border-width: 2px;
    border-color: var(--Background-Plain-300, #EDEDED);
  }
  100% {
    border-width: 6px;
    border-color: var(--Content-Primary-300, #CCCCCC);
  }
}`);

fs.writeFileSync('src/components/ProcessingRFPModal.module.css', css, 'utf-8');

let tsx = fs.readFileSync('src/components/ProcessingRFPModal.tsx', 'utf-8');
tsx = tsx.replace(/styles\.smallSpinner/g, 'styles.pulseCircle');
fs.writeFileSync('src/components/ProcessingRFPModal.tsx', tsx, 'utf-8');

console.log('Fixed spinner and replaced with pulseCircle');
