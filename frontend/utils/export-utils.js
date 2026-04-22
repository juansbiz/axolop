/**
 * Export Utilities
 * Handles data export with tier-based limitations
 */

import { canAccessFeature, FEATURES } from "@/lib/featureGating";
import { getTierLimits } from "@/utils/subscription-tiers";

// Export row limit for Sales tier
const SALES_TIER_EXPORT_LIMIT = 50;

/**
 * Check if user has unlimited export access
 * @param {string} userTier - User's subscription tier
 * @param {boolean} isGodMode - Whether user is in god mode
 * @returns {boolean}
 */
export function hasUnlimitedExport(userTier, isGodMode = false) {
  if (isGodMode) return true;
  return canAccessFeature(FEATURES.BULK_EXPORT, userTier);
}

/**
 * Get the export row limit for a user
 * @param {string} userTier - User's subscription tier
 * @param {boolean} isGodMode - Whether user is in god mode
 * @returns {number} - The row limit (-1 for unlimited)
 */
export function getExportRowLimit(userTier, isGodMode = false) {
  if (isGodMode) return -1; // Unlimited

  // Check tier limits from subscription-tiers.js
  const limits = getTierLimits(userTier);
  if (limits?.exportRows && limits.exportRows > 0) {
    return limits.exportRows;
  }

  // Check if user has bulk export feature
  if (hasUnlimitedExport(userTier, isGodMode)) {
    return -1; // Unlimited
  }

  return SALES_TIER_EXPORT_LIMIT;
}

/**
 * Apply export row limit to data
 * @param {Array} data - The data to export
 * @param {string} userTier - User's subscription tier
 * @param {boolean} isGodMode - Whether user is in god mode
 * @returns {Object} - { data: Array, limited: boolean, totalRows: number, exportedRows: number }
 */
export function applyExportLimit(data, userTier, isGodMode = false) {
  const limit = getExportRowLimit(userTier, isGodMode);
  const totalRows = data.length;

  if (limit === -1 || totalRows <= limit) {
    return {
      data,
      limited: false,
      totalRows,
      exportedRows: totalRows,
    };
  }

  return {
    data: data.slice(0, limit),
    limited: true,
    totalRows,
    exportedRows: limit,
  };
}

/**
 * Generate export warning message for limited exports
 * @param {number} totalRows - Total rows in data
 * @param {number} exportedRows - Number of rows exported
 * @param {string} requiredTier - Tier required for unlimited export
 * @returns {string}
 */
export function getExportLimitMessage(totalRows, exportedRows, requiredTier = "Build") {
  return `Exported ${exportedRows} of ${totalRows} rows. Upgrade to ${requiredTier} for unlimited exports.`;
}

/**
 * Convert data to CSV format
 * @param {Array} data - Array of objects to convert
 * @param {Array} columns - Array of column definitions { key, label }
 * @returns {string} - CSV content
 */
export function convertToCSV(data, columns) {
  const headers = columns.map((col) => col.label || col.key);
  const rows = data.map((item) =>
    columns.map((col) => {
      const value = item[col.key];
      // Escape quotes and wrap in quotes if contains comma, quote, or newline
      const strValue = value == null ? "" : String(value);
      if (strValue.includes(",") || strValue.includes('"') || strValue.includes("\n")) {
        return `"${strValue.replace(/"/g, '""')}"`;
      }
      return strValue;
    })
  );

  return [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
}

/**
 * Download CSV file
 * @param {string} csvContent - CSV content
 * @param {string} filename - Filename for download
 */
export function downloadCSV(csvContent, filename) {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export data with tier-based limitations
 * @param {Object} options - Export options
 * @param {Array} options.data - Data to export
 * @param {Array} options.columns - Column definitions
 * @param {string} options.filename - Filename for download
 * @param {string} options.userTier - User's subscription tier
 * @param {boolean} options.isGodMode - Whether user is in god mode
 * @param {Function} options.onSuccess - Success callback
 * @param {Function} options.onLimitReached - Callback when export is limited
 * @returns {Object} - Export result
 */
export function exportDataWithLimits({
  data,
  columns,
  filename,
  userTier,
  isGodMode = false,
  onSuccess,
  onLimitReached,
}) {
  const { data: exportData, limited, totalRows, exportedRows } = applyExportLimit(
    data,
    userTier,
    isGodMode
  );

  const csvContent = convertToCSV(exportData, columns);
  downloadCSV(csvContent, filename);

  if (limited) {
    const message = getExportLimitMessage(totalRows, exportedRows);
    onLimitReached?.(message, totalRows, exportedRows);
  } else {
    onSuccess?.(exportedRows);
  }

  return {
    success: true,
    limited,
    totalRows,
    exportedRows,
  };
}

export default {
  hasUnlimitedExport,
  getExportRowLimit,
  applyExportLimit,
  getExportLimitMessage,
  convertToCSV,
  downloadCSV,
  exportDataWithLimits,
};
