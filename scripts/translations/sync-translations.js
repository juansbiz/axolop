#!/usr/bin/env node

/**
 * Translation Sync Script
 *
 * Synchronizes Spanish translations to match English (source of truth)
 * - Removes orphan keys (in Spanish but not English)
 * - Adds missing keys (in English but not Spanish) with [TRANSLATE] placeholder
 * - Creates automatic backups before changes
 *
 * Usage:
 *   node sync-translations.js              # Sync all namespaces
 *   node sync-translations.js --dry-run    # Preview changes without applying
 *   node sync-translations.js --namespace landing  # Sync specific namespace
 */

import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { extractAllKeys, setValueByPath, deleteKeyByPath, compareKeys, getValueByPath } from './lib/key-path-utils.js';
import { readJSON, writeJSON, fileExists } from './lib/json-utils.js';
import { createBackup } from './lib/backup-utils.js';

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
 * Main sync function
 */
async function syncTranslations(options = {}) {
  const { dryRun = false, namespace = null } = options;

  console.log('\n🔄 Translation Synchronization');
  console.log('='.repeat(50));
  console.log(`Mode: ${dryRun ? 'DRY RUN (preview only)' : 'LIVE (will apply changes)'}`);
  console.log(`Source: English (en) → Target: Spanish (es)`);
  console.log('='.repeat(50) + '\n');

  // Filter namespaces if specific one provided
  const namespacesToSync = namespace ? [namespace] : NAMESPACES;

  if (namespace && !NAMESPACES.includes(namespace)) {
    console.error(`❌ Error: Unknown namespace "${namespace}"`);
    console.error(`Available namespaces: ${NAMESPACES.join(', ')}`);
    process.exit(1);
  }

  let totalOrphans = 0;
  let totalMissing = 0;
  let totalBackups = 0;
  let failedNamespaces = [];

  // Sync each namespace with error recovery
  for (const ns of namespacesToSync) {
    try {
      const result = await syncNamespace(ns, dryRun);
      totalOrphans += result.orphansRemoved;
      totalMissing += result.missingAdded;
      if (result.backupCreated) totalBackups++;
    } catch (error) {
      console.error(`\n❌ Failed to sync ${ns}:`, error.message);
      failedNamespaces.push({ namespace: ns, error: error.message });
      // Continue with other namespaces
    }
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 Sync Summary');
  console.log('='.repeat(50));
  console.log(`Namespaces synced: ${namespacesToSync.length - failedNamespaces.length}/${namespacesToSync.length}`);
  console.log(`Orphan keys removed: ${totalOrphans}`);
  console.log(`Missing keys added: ${totalMissing}`);
  console.log(`Backups created: ${totalBackups}`);

  if (failedNamespaces.length > 0) {
    console.log(`\n⚠️  Failed namespaces: ${failedNamespaces.length}`);
    failedNamespaces.forEach(({ namespace, error }) => {
      console.log(`   ❌ ${namespace}: ${error}`);
    });
  }

  if (dryRun) {
    console.log('\n💡 This was a DRY RUN. No files were modified.');
    console.log('   Run without --dry-run to apply changes.\n');
  } else {
    if (failedNamespaces.length > 0) {
      console.log('\n⚠️  Sync completed with errors. See failed namespaces above.\n');
    } else {
      console.log('\n✅ Sync complete!\n');
    }
  }
}

/**
 * Syncs a single namespace
 */
async function syncNamespace(namespace, dryRun) {
  const enPath = resolve(PROJECT_ROOT, `frontend/locales/en/${namespace}.json`);
  const esPath = resolve(PROJECT_ROOT, `frontend/locales/es/${namespace}.json`);

  // Check if English file exists (required)
  if (!fileExists(enPath)) {
    console.error(`\n❌ ${namespace}: English file not found at ${enPath}`);
    return { orphansRemoved: 0, missingAdded: 0, backupCreated: false };
  }

  // Load English (source of truth)
  const enData = readJSON(enPath);
  const enKeys = extractAllKeys(enData);

  // If Spanish file doesn't exist, create it from English template
  if (!fileExists(esPath)) {
    console.log(`\n⚠️  ${namespace}: Spanish file not found, creating from English template`);
    if (!dryRun) {
      const esTemplate = createTemplateWithPlaceholders(enData);
      writeJSON(esPath, esTemplate);
      console.log(`   ✅ Created: ${esPath}`);
    }
    return { orphansRemoved: 0, missingAdded: enKeys.length, backupCreated: false };
  }

  // Load Spanish (target to sync)
  const esData = readJSON(esPath);
  const esKeys = extractAllKeys(esData);

  // Find differences
  const { orphanKeys, missingKeys } = compareKeys(enKeys, esKeys);

  // If already in sync, skip
  if (orphanKeys.length === 0 && missingKeys.length === 0) {
    console.log(`✅ ${namespace}: Already in sync (${enKeys.length} keys)`);
    return { orphansRemoved: 0, missingAdded: 0, backupCreated: false };
  }

  // Create backup if changes will be made
  let backupCreated = false;
  if (!dryRun && (orphanKeys.length > 0 || missingKeys.length > 0)) {
    const backupPath = createBackup(esPath);
    console.log(`\n💾 ${namespace}: Backup created at ${backupPath}`);
    backupCreated = true;
  }

  // Remove orphans
  if (orphanKeys.length > 0) {
    console.log(`\n🗑️  ${namespace}: Removing ${orphanKeys.length} orphan key${orphanKeys.length > 1 ? 's' : ''}:`);
    orphanKeys.forEach(key => {
      console.log(`   ❌ ${key}`);
      if (!dryRun) deleteKeyByPath(esData, key);
    });
  }

  // Add missing
  if (missingKeys.length > 0) {
    console.log(`\n➕ ${namespace}: Adding ${missingKeys.length} missing key${missingKeys.length > 1 ? 's' : ''}:`);
    missingKeys.forEach(key => {
      console.log(`   ✅ ${key}`);
      if (!dryRun) {
        // Copy English value instead of using placeholder
        const enValue = getValueByPath(enData, key);
        setValueByPath(esData, key, enValue);
      }
    });
  }

  // Write file
  if (!dryRun) {
    writeJSON(esPath, esData);
    console.log(`\n💾 Saved: ${esPath}`);
  }

  return {
    orphansRemoved: orphanKeys.length,
    missingAdded: missingKeys.length,
    backupCreated
  };
}

/**
 * Creates a template by copying English structure
 * Now copies English values instead of using placeholders
 */
function createTemplateWithPlaceholders(obj) {
  const template = {};

  for (const key in obj) {
    if (!obj.hasOwnProperty(key)) continue;

    const value = obj[key];

    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      // Recurse for nested objects
      template[key] = createTemplateWithPlaceholders(value);
    } else if (Array.isArray(value)) {
      // Preserve arrays as-is
      template[key] = value;
    } else {
      // Copy the English value (better than placeholder)
      template[key] = value;
    }
  }

  return template;
}

// Parse CLI arguments
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const namespaceIndex = args.indexOf('--namespace');
const namespace = namespaceIndex !== -1 ? args[namespaceIndex + 1] : null;

// Show help if requested
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
Translation Sync Script

Synchronizes Spanish translations to match English (source of truth)

Usage:
  node sync-translations.js              Sync all namespaces
  node sync-translations.js --dry-run    Preview changes without applying
  node sync-translations.js --namespace landing  Sync specific namespace

Options:
  --dry-run          Preview changes without modifying files
  --namespace <name> Sync only the specified namespace
  --help, -h         Show this help message

Examples:
  node sync-translations.js
  node sync-translations.js --dry-run
  node sync-translations.js --namespace landing
  node sync-translations.js --namespace landing --dry-run
`);
  process.exit(0);
}

// Run sync
syncTranslations({ dryRun, namespace }).catch(error => {
  console.error('\n❌ Sync failed:', error.message);
  process.exit(1);
});
