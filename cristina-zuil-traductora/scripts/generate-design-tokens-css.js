/**
 * Script to generate CSS variables from design-tokens.ts
 * Run this script to update the CSS variables in global.css
 * 
 * Usage: node scripts/generate-design-tokens-css.js
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { designTokens } from '../src/config/design-tokens.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// Generate CSS variables
const cssVars = [];

// Colors
const colors = designTokens.colors;
for (const key in colors) {
  if (colors.hasOwnProperty(key)) {
    cssVars.push(`  --color-${key}: ${colors[key]};`);
  }
}

// Breakpoints
const breakpoints = designTokens.breakpoints;
for (const key in breakpoints) {
  if (breakpoints.hasOwnProperty(key)) {
    const value = breakpoints[key];
    cssVars.push(`  --breakpoint-${key}: ${value.breakpoint};`);
    cssVars.push(`  --grid-columns-${key}: ${value.columns};`);
    cssVars.push(`  --grid-gap-${key}: ${value.gap};`);
    cssVars.push(`  --container-padding-${key}: ${value.padding};`);
    if ('maxWidth' in value && value.maxWidth) {
      cssVars.push(`  --container-max-width-${key}: ${value.maxWidth};`);
    }
  }
}

// Font families
const fontFamilies = designTokens.fonts.families;
for (const key in fontFamilies) {
  if (fontFamilies.hasOwnProperty(key)) {
    cssVars.push(`  --font-family-${key}: ${fontFamilies[key]};`);
  }
}

const cssVariables = `:root {
${cssVars.join('\n')}
}`;

// Read current global.css
const globalCssPath = join(rootDir, 'src/styles/global.css');
let globalCss = readFileSync(globalCssPath, 'utf-8');

// Replace or add CSS variables section
const cssVarsRegex = /:root\s*\{[\s\S]*?\n\}/;
if (cssVarsRegex.test(globalCss)) {
  globalCss = globalCss.replace(cssVarsRegex, cssVariables);
} else {
  // Add after imports
  const importEnd = globalCss.lastIndexOf('@import');
  const nextLine = globalCss.indexOf('\n', importEnd) + 1;
  globalCss = globalCss.slice(0, nextLine) + '\n' + cssVariables + '\n\n' + globalCss.slice(nextLine);
}

writeFileSync(globalCssPath, globalCss, 'utf-8');
console.log('✅ CSS variables generated successfully!');
