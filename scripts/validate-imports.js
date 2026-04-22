#!/usr/bin/env node
/**
 * Import Validation Script for Axolop CRM
 *
 * Checks for common import errors:
 * - Imports from non-existent files
 * - Incorrect alias usage
 * - Deprecated import paths
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Vite alias configuration (keep in sync with vite.config.js)
const ALIASES = {
  '@': './frontend',
  '@/components': './frontend/components',
  '@/pages': './frontend/pages',
  '@/services': './frontend/services',
  '@/utils': './frontend/utils',
  '@/lib': './frontend/lib',
  '@/context': './frontend/context',
  '@/hooks': './frontend/hooks',
};

// Known problematic import patterns to flag
const FORBIDDEN_IMPORTS = [
  { pattern: /from ['"]\.\.\/lib\/supabase/, message: 'Use "../config/supabaseClient" instead of "../lib/supabase"' },
  { pattern: /from ['"]@\/lib\/supabase/, message: 'Use "@/config/supabaseClient" instead of "@/lib/supabase"' },
  { pattern: /from ['"]@\/contexts\//, message: 'Use "@/context/" (singular) instead of "@/contexts/"' },
  { pattern: /from ['"]\.\.\/contexts\//, message: 'Use "../context/" (singular) instead of "../contexts/"' },
];

let errorCount = 0;
let warningCount = 0;

console.log('🔍 Validating imports in Axolop CRM...\n');

// Get all JS/JSX files
const files = glob.sync('frontend/**/*.{js,jsx}', {
  cwd: projectRoot,
  ignore: ['**/node_modules/**', '**/dist/**', '**/build/**']
});

console.log(`Checking ${files.length} files...\n`);

for (const file of files) {
  const filePath = path.join(projectRoot, file);
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  lines.forEach((line, index) => {
    const lineNumber = index + 1;

    // Check for forbidden import patterns
    for (const forbidden of FORBIDDEN_IMPORTS) {
      if (forbidden.pattern.test(line)) {
        console.error(`❌ ERROR in ${file}:${lineNumber}`);
        console.error(`   ${forbidden.message}`);
        console.error(`   Found: ${line.trim()}\n`);
        errorCount++;
      }
    }

    // Check for imports from non-existent files (basic check)
    const importMatch = line.match(/from ['"]([^'"]+)['"]/);
    if (importMatch) {
      const importPath = importMatch[1];

      // Skip node_modules and external packages
      if (!importPath.startsWith('.') && !importPath.startsWith('@/')) {
        return;
      }

      // Resolve alias (sort by length descending to match most specific alias first)
      let resolvedPath = importPath;
      let wasAliasReplaced = false;
      const sortedAliases = Object.entries(ALIASES).sort((a, b) => b[0].length - a[0].length);
      for (const [alias, aliasPath] of sortedAliases) {
        if (importPath.startsWith(alias + '/') || importPath === alias) {
          resolvedPath = importPath.replace(alias, aliasPath);
          wasAliasReplaced = true;
          break;
        }
      }

      // Resolve paths
      if (wasAliasReplaced) {
        // Alias paths are always relative to project root
        resolvedPath = path.resolve(projectRoot, resolvedPath);
      } else if (resolvedPath.startsWith('.')) {
        // True relative paths are relative to the importing file
        const fileDir = path.dirname(filePath);
        resolvedPath = path.resolve(fileDir, resolvedPath);
      } else {
        // Absolute or other paths resolve from project root
        resolvedPath = path.resolve(projectRoot, resolvedPath);
      }

      // Check common extensions
      const extensions = ['', '.js', '.jsx', '.ts', '.tsx'];
      let exists = false;

      for (const ext of extensions) {
        const checkPath = resolvedPath + ext;
        if (fs.existsSync(checkPath)) {
          exists = true;
          break;
        }
        // Check index files
        const indexPath = path.join(resolvedPath, `index${ext}`);
        if (fs.existsSync(indexPath)) {
          exists = true;
          break;
        }
      }

      if (!exists) {
        console.warn(`⚠️  WARNING in ${file}:${lineNumber}`);
        console.warn(`   Possible non-existent import: ${importPath}`);
        console.warn(`   Resolved to: ${resolvedPath}`);
        console.warn(`   Line: ${line.trim()}\n`);
        warningCount++;
      }
    }
  });
}

console.log('\n' + '='.repeat(50));
console.log(`Validation Complete!`);
console.log(`Files checked: ${files.length}`);
console.log(`Errors: ${errorCount}`);
console.log(`Warnings: ${warningCount}`);
console.log('='.repeat(50) + '\n');

if (errorCount > 0) {
  console.error('❌ Import validation FAILED! Please fix the errors above.');
  process.exit(1);
} else if (warningCount > 0) {
  console.warn('⚠️  Import validation passed with warnings. Review warnings above.');
  process.exit(0);
} else {
  console.log('✅ Import validation PASSED! No issues found.');
  process.exit(0);
}
