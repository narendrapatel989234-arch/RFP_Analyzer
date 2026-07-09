import re

with open('src/app/know-your-client-v2/page.module.css', 'r', encoding='utf-8') as f:
    css = f.read()

# 1. Document icon container backgrounds
css = re.sub(r'(\.fileListIconWrapper\s*\{[^}]*background:\s*)var\(--action-primary-bg-soft\)([^}]*\})', r'\1var(--Background-Plain-300)\2', css)

# 2. File icons themselves
css = re.sub(r'(\.fileListIconWrapper\s*\{[^}]*color:\s*)var\(--action-primary-bg-pressed\)([^}]*\})', r'\1var(--Content-Primary-400)\2', css)
css = re.sub(r'(\.extractedToolbarIcon\s*\{[^}]*background-color:\s*)var\(--action-primary-bg-soft\)([^}]*\})', r'\1var(--Background-Plain-300)\2', css)
css = re.sub(r'(\.extractedToolbarIcon\s*\{[^}]*color:\s*)var\(--action-primary-bg-pressed\)([^}]*\})', r'\1var(--Content-Primary-400)\2', css)
css = re.sub(r'(\.uploadIconCircle\s*\{[^}]*background:\s*)var\(--bg-surface-2\)([^}]*\})', r'\1var(--Background-Plain-300)\2', css)


# 3. Delete icon button (trashBtnList & extractedToolbarTrash & extractedCardDeleteBtn)
css = re.sub(r'(\.trashBtnList\s*\{[^}]*background:\s*)var\(--status-error-bg\)([^}]*\})', r'\1transparent\2', css)
css = re.sub(r'(\.trashBtnList\s*\{[^}]*color:\s*)var\(--status-error-icon\)([^}]*\})', r'\1var(--Content-Primary-400)\2', css)
css = re.sub(r'(\.trashBtnList:hover\s*\{[^}]*background:\s*)var\(--action-destructive-bg-default\)([^}]*\})', r'\1color-mix(in srgb, var(--status-red) 10%, transparent)\2', css)
css = re.sub(r'(\.trashBtnList:hover\s*\{[^}]*color:\s*)var\(--action-destructive-text\)([^}]*\})', r'\1var(--status-red)\2', css)

css = re.sub(r'(\.extractedToolbarTrash\s*\{[^}]*background-color:\s*)var\(--status-error-bg\)([^}]*\})', r'\1transparent\2', css)
css = re.sub(r'(\.extractedToolbarTrash\s*\{[^}]*color:\s*)var\(--status-error-icon\)([^}]*\})', r'\1var(--Content-Primary-400)\2', css)
css = re.sub(r'(\.extractedToolbarTrash:hover\s*\{[^}]*)opacity:\s*0\.8', r'background-color: color-mix(in srgb, var(--status-red) 10%, transparent);\n  color: var(--status-red)', css)

css = re.sub(r'(\.extractedCardDeleteBtn\s*\{[^}]*background:\s*)var\(--status-error-bg\)([^}]*\})', r'\1transparent\2', css)
css = re.sub(r'(\.extractedCardDeleteBtn\s*\{[^}]*color:\s*)var\(--status-error-icon\)([^}]*\})', r'\1var(--Content-Primary-400)\2', css)
css = re.sub(r'(\.extractedCardDeleteBtn:hover\s*\{[^}]*background:\s*)var\(--action-destructive-bg-default\)([^}]*\})', r'\1color-mix(in srgb, var(--status-red) 10%, transparent)\2', css)
css = re.sub(r'(\.extractedCardDeleteBtn:hover\s*\{[^}]*color:\s*)var\(--action-destructive-text\)([^}]*\})', r'\1var(--status-red)\2', css)

# 4. "+ Add Document" button text color
css = re.sub(r'(\.addCapabilitiesBtn\s*\{[^}]*color:\s*)var\(--action-primary-bg-default\)([^}]*\})', r'\1var(--Lavender-600)\2', css)

# 5 & 6. Active tab underline and active tab label text (.summaryTabActive)
css = re.sub(r'(\.summaryTabActive\s*\{[^}]*color:\s*)var\(--action-primary-bg-default[^)]*\)([^}]*\})', r'\1var(--Content-Primary-600)\2', css)
css = re.sub(r'(\.summaryTabActive\s*\{[^}]*border-bottom:\s*2px solid\s*)var\(--action-primary-bg-default[^)]*\)([^}]*\})', r'\1var(--Lavender-600)\2', css)

# 7. "Refresh Summary" button color (.refreshBtn)
css = re.sub(r'(\.refreshBtn\s*\{[^}]*color:\s*)var\(--action-primary-bg-default\)([^}]*\})', r'\1var(--Content-Primary-300)\2', css)

# 8. Remaining warm/beige border colors on cards (replace with --Background-Plain-400)
# Look for var(--border-default) or var(--border-subtle) which might be old colors in this context
css = css.replace('var(--border-default)', 'var(--Background-Plain-400)')
css = css.replace('var(--border-subtle)', 'var(--Background-Plain-400)')

# 9. Scan for old hex values/old brand tokens
css = css.replace('var(--action-primary-bg-soft)', 'var(--Background-Plain-300)')
css = css.replace('var(--action-primary-bg-pressed)', 'var(--Content-Primary-600)')
css = css.replace('var(--action-primary-bg-default)', 'var(--Lavender-600)')
css = css.replace('var(--action-primary-bg-hover)', 'var(--Lavender-500)')
css = css.replace('var(--action-primary-bg-soft-hover)', 'var(--Background-Plain-400)')
css = css.replace('var(--action-primary-text)', 'var(--White, #ffffff)')
css = css.replace('#f7f7f7', 'var(--Background-Plain-200)')

with open('src/app/know-your-client-v2/page.module.css', 'w', encoding='utf-8') as f:
    f.write(css)

# Also update page.tsx
with open('src/app/know-your-client-v2/page.tsx', 'r', encoding='utf-8') as f:
    tsx = f.read()

tsx = tsx.replace("#d97706", "var(--Lavender-600)")
tsx = tsx.replace("var(--border-subtle)", "var(--Background-Plain-400)")

with open('src/app/know-your-client-v2/page.tsx', 'w', encoding='utf-8') as f:
    f.write(tsx)

print("done")
