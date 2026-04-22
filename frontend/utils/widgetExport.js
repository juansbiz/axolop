/**
 * Widget Export Utilities
 *
 * Exports dashboard widget data in various formats:
 * - CSV (comma-separated values)
 * - Excel (XLSX)
 * - PDF (document)
 * - Image (PNG screenshot)
 * - Clipboard (text/JSON)
 *
 * Usage:
 * import { exportWidgetData } from '@/utils/widgetExport';
 *
 * await exportWidgetData(widgetElement, 'csv', { title: 'Revenue Chart', data: [...] });
 */

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * Export widget data in the specified format
 *
 * @param {HTMLElement} widgetElement - DOM element to export (for image/PDF)
 * @param {String} format - Export format: 'csv', 'excel', 'pdf', 'image', 'clipboard'
 * @param {Object} data - Widget data object
 * @param {String} data.title - Widget title
 * @param {Array} data.data - Data array
 * @param {Object} data.metadata - Additional metadata
 * @returns {Promise<void>}
 */
export async function exportWidgetData(widgetElement, format, data = {}) {
  const { title = 'Widget Export', data: widgetData = [], metadata = {} } = data;

  switch (format) {
    case 'csv':
      return exportAsCSV(widgetData, title);

    case 'excel':
      return exportAsExcel(widgetData, title);

    case 'pdf':
      return exportAsPDF(widgetElement, title);

    case 'image':
      return exportAsImage(widgetElement, title);

    case 'clipboard':
      return copyToClipboard(widgetData, title);

    default:
      console.warn(`Unknown export format: ${format}`);
      return Promise.reject(new Error(`Unsupported format: ${format}`));
  }
}

/**
 * Export data as CSV file
 *
 * @param {Array} data - Array of objects or arrays
 * @param {String} filename - File name (without extension)
 */
export function exportAsCSV(data, filename = 'export') {
  if (!data || data.length === 0) {
    console.warn('No data to export');
    return;
  }

  let csvContent = '';

  // Handle array of objects
  if (typeof data[0] === 'object' && !Array.isArray(data[0])) {
    // Get headers from first object
    const headers = Object.keys(data[0]);
    csvContent += headers.join(',') + '\n';

    // Add rows
    data.forEach(row => {
      const values = headers.map(header => {
        const value = row[header];
        // Escape commas and quotes
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value ?? '';
      });
      csvContent += values.join(',') + '\n';
    });
  }
  // Handle array of arrays
  else if (Array.isArray(data[0])) {
    data.forEach(row => {
      csvContent += row.join(',') + '\n';
    });
  }
  // Handle simple values
  else {
    csvContent = data.join('\n');
  }

  // Download file
  downloadFile(csvContent, `${filename}.csv`, 'text/csv');
}

/**
 * Export data as Excel file (XLSX)
 *
 * Note: This requires the 'xlsx' library. For now, we'll export as CSV with .xlsx extension
 * For full Excel support, install: npm install xlsx
 *
 * @param {Array} data - Array of objects
 * @param {String} filename - File name (without extension)
 */
export function exportAsExcel(data, filename = 'export') {
  // TODO: Implement proper XLSX export using 'xlsx' library
  // For now, use CSV format with .xlsx extension
  console.warn('Excel export not fully implemented. Exporting as CSV.');
  exportAsCSV(data, filename);
}

/**
 * Export widget as PDF document
 *
 * @param {HTMLElement} element - DOM element to export
 * @param {String} filename - File name (without extension)
 * @returns {Promise<void>}
 */
export async function exportAsPDF(element, filename = 'widget') {
  if (!element) {
    console.error('No element provided for PDF export');
    return;
  }

  try {
    // Capture element as canvas
    const canvas = await html2canvas(element, {
      scale: 2, // Higher quality
      backgroundColor: '#ffffff',
    });

    // Convert to PDF
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
      unit: 'px',
      format: [canvas.width, canvas.height],
    });

    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save(`${filename}.pdf`);
  } catch (error) {
    console.error('Error exporting PDF:', error);
    throw error;
  }
}

/**
 * Export widget as PNG image
 *
 * @param {HTMLElement} element - DOM element to export
 * @param {String} filename - File name (without extension)
 * @returns {Promise<void>}
 */
export async function exportAsImage(element, filename = 'widget') {
  if (!element) {
    console.error('No element provided for image export');
    return;
  }

  try {
    // Capture element as canvas
    const canvas = await html2canvas(element, {
      scale: 2, // Higher quality
      backgroundColor: '#ffffff',
    });

    // Convert to blob and download
    canvas.toBlob(blob => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 'image/png');
  } catch (error) {
    console.error('Error exporting image:', error);
    throw error;
  }
}

/**
 * Copy widget data to clipboard
 *
 * @param {Array|Object} data - Data to copy
 * @param {String} title - Optional title
 * @returns {Promise<void>}
 */
export async function copyToClipboard(data, title = '') {
  try {
    let textContent = '';

    // Add title if provided
    if (title) {
      textContent += `${title}\n${'='.repeat(title.length)}\n\n`;
    }

    // Format data as text
    if (Array.isArray(data)) {
      if (typeof data[0] === 'object') {
        // Array of objects - format as table
        const headers = Object.keys(data[0]);
        textContent += headers.join('\t') + '\n';
        data.forEach(row => {
          const values = headers.map(h => row[h] ?? '');
          textContent += values.join('\t') + '\n';
        });
      } else {
        // Simple array
        textContent += data.join('\n');
      }
    } else if (typeof data === 'object') {
      // Single object - format as key-value pairs
      Object.entries(data).forEach(([key, value]) => {
        textContent += `${key}: ${value}\n`;
      });
    } else {
      // Primitive value
      textContent += data.toString();
    }

    // Copy to clipboard
    await navigator.clipboard.writeText(textContent);

    console.log('Copied to clipboard successfully');
    // TODO: Show toast notification
    return true;
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    throw error;
  }
}

/**
 * Download text content as a file
 *
 * @param {String} content - File content
 * @param {String} filename - File name
 * @param {String} mimeType - MIME type
 */
function downloadFile(content, filename, mimeType = 'text/plain') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Format widget data for export
 * Converts complex widget data structures to exportable format
 *
 * @param {Object} widget - Widget data object
 * @returns {Array} Formatted data array
 */
export function formatWidgetDataForExport(widget) {
  // Handle different widget types
  switch (widget.type) {
    case 'metric':
      return [
        { Metric: widget.title, Value: widget.value, Change: widget.change },
      ];

    case 'chart':
      return widget.data || [];

    case 'table':
      return widget.rows || [];

    case 'list':
      return widget.items?.map((item, index) => ({
        '#': index + 1,
        ...item,
      })) || [];

    default:
      // Try to extract data array
      return widget.data || widget.items || widget.rows || [];
  }
}

export default {
  exportWidgetData,
  exportAsCSV,
  exportAsExcel,
  exportAsPDF,
  exportAsImage,
  copyToClipboard,
  formatWidgetDataForExport,
};
