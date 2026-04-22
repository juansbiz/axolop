#!/usr/bin/env node

/**
 * Translation Validation Script
 *
 * Validates that Spanish translations match English structure (no orphan keys)
 * Used in build process to prevent orphan keys from reaching production
 *
 * Exit codes:
 *   0 - All translations in sync
 *   1 - Orphan keys found (build should fail)
 *
 * Usage:
 *   node validate-translations.js
 */

import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { extractAllKeys, compareKeys } from './lib/key-path-utils.js';
import { readJSON, fileExists } from './lib/json-utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = resolve(__dirname, '../..');

// Translation namespaces (must match frontend/utils/i18n.js)
const NAMESPACES = [
  'common',
  'navigation',
  'landing',
  'pricing',
  'features',
  'useCases',
  'auth',
  'app',
  'settings',
  'sidebar',
  'dashboard',
  'legal',
  'widgets',
  'invites'
];

/**
 * Main validation function
 */
async function validateTranslations() {
  console.log('\n🔍 Validating Translation Sync');
  console.log('='.repeat(50));
  console.log('Checking Spanish translations match English...\n');

  let hasErrors = false;
  let totalOrphans = 0;
  let namespacesChecked = 0;

  for (const ns of NAMESPACES) {
    const enPath = resolve(PROJECT_ROOT, `frontend/locales/en/${ns}.json`);
    const esPath = resolve(PROJECT_ROOT, `frontend/locales/es/${ns}.json`);

    // Skip if English file doesn't exist (unusual but not an error)
    if (!fileExists(enPath)) {
      console.warn(`⚠️  ${ns}: English file not found (skipped)`);
      continue;
    }

    // Skip if Spanish file doesn't exist (will be created on first sync)
    if (!fileExists(esPath)) {
      console.warn(`⚠️  ${ns}: Spanish file not found (will be created on sync)`);
      continue;
    }

    // Load and extract keys
    const enData = readJSON(enPath);
    const esData = readJSON(esPath);
    const enKeys = extractAllKeys(enData);
    const esKeys = extractAllKeys(esData);

    // Find orphans
    const { orphanKeys } = compareKeys(enKeys, esKeys);

    if (orphanKeys.length > 0) {
      console.error(`\n❌ ${ns}: Found ${orphanKeys.length} orphan key${orphanKeys.length > 1 ? 's' : ''} in Spanish:`);
      orphanKeys.forEach(key => console.error(`   - ${key}`));
      hasErrors = true;
      totalOrphans += orphanKeys.length;
    } else {
      console.log(`✅ ${ns}: In sync (${enKeys.length} keys)`);
    }

    namespacesChecked++;
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  if (hasErrors) {
    console.error('❌ Validation Failed');
    console.error('='.repeat(50));
    console.error(`Namespaces checked: ${namespacesChecked}`);
    console.error(`Total orphan keys: ${totalOrphans}`);
    console.error('\n💡 Run "npm run translations:sync" to fix orphan keys\n');
    process.exit(1);
  } else {
    console.log('✅ Validation Passed');
    console.log('='.repeat(50));
    console.log(`All ${namespacesChecked} namespaces are in sync!\n`);
    process.exit(0);
  }
}

// Run validation
validateTranslations().catch(error => {
  console.error('\n❌ Validation error:', error.message);
  process.exit(1);
});
