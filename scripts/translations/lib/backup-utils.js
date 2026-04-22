/**
 * Backup Utilities for Translation Sync
 *
 * Provides functions to create, list, and restore backups of translation files
 * Backups are timestamped and stored in .backups/ directory
 */

import { copyFileSync, readdirSync, existsSync, statSync } from 'fs';
import { dirname, basename, join } from 'path';
import { ensureDirectory } from './json-utils.js';

/**
 * Creates a timestamped backup of a file
 * @param {string} filePath - Path to the file to backup
 * @returns {string} Path to the backup file
 * @example
 * createBackup('frontend/locales/es/landing.json')
 * // Creates: frontend/locales/es/.backups/landing.json.backup.20251209_143022
 */
export function createBackup(filePath) {
  if (!existsSync(filePath)) {
    throw new Error(`Cannot backup non-existent file: ${filePath}`);
  }

  const dir = dirname(filePath);
  const file = basename(filePath);
  // User mandate: Backups MUST go to external drive, never in project directory
  const backupDir = join('/Volumes/Axolop Backups/Axolop Backups/ALL/translations_backups', dir.replace(/^\//, ''));

  const timestamp = getTimestamp();
  const backupPath = join(backupDir, `${file}.backup.${timestamp}`);

  // Ensure backup directory exists
  ensureDirectory(backupDir);

  // Copy file to backup
  copyFileSync(filePath, backupPath);

  return backupPath;
}

/**
 * Lists all backups for a given file
 * @param {string} filePath - Path to the original file
 * @returns {Array<{path: string, timestamp: string, date: Date}>} Array of backup info
 * @example
 * listBackups('frontend/locales/es/landing.json')
 * // Returns: [{ path: '...', timestamp: '20251209_143022', date: Date(...) }]
 */
export function listBackups(filePath) {
  const dir = dirname(filePath);
  const file = basename(filePath);
  // User mandate: Backups MUST go to external drive, never in project directory
  const backupDir = join('/Volumes/Axolop Backups/Axolop Backups/ALL/translations_backups', dir.replace(/^\//, ''));

  if (!existsSync(backupDir)) {
    return [];
  }

  const prefix = `${file}.backup.`;
  const backupFiles = readdirSync(backupDir)
    .filter(f => f.startsWith(prefix))
    .map(f => {
      const fullPath = join(backupDir, f);
      const timestamp = f.replace(prefix, '');
      const stats = statSync(fullPath);

      return {
        path: fullPath,
        timestamp,
        date: stats.mtime
      };
    })
    .sort((a, b) => b.date - a.date); // Most recent first

  return backupFiles;
}

/**
 * Restores a backup to the original file location
 * @param {string} backupPath - Path to the backup file
 * @param {string} targetPath - Path to restore to
 * @example
 * restoreBackup(
 *   'frontend/locales/es/.backups/landing.json.backup.20251209_143022',
 *   'frontend/locales/es/landing.json'
 * )
 */
export function restoreBackup(backupPath, targetPath) {
  if (!existsSync(backupPath)) {
    throw new Error(`Backup file not found: ${backupPath}`);
  }

  copyFileSync(backupPath, targetPath);
  console.log(`✅ Restored backup from ${backupPath} to ${targetPath}`);
}

/**
 * Gets the most recent backup for a file
 * @param {string} filePath - Path to the original file
 * @returns {string|null} Path to the most recent backup, or null if none exist
 */
export function getMostRecentBackup(filePath) {
  const backups = listBackups(filePath);
  return backups.length > 0 ? backups[0].path : null;
}

/**
 * Generates a timestamp string in YYYYMMDD_HHMMSS format
 * @returns {string} Timestamp string
 * @example
 * getTimestamp() // Returns: "20251209_143022"
 */
function getTimestamp() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return `${year}${month}${day}_${hours}${minutes}${seconds}`;
}
