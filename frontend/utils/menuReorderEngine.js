/**
 * Menu Reorder Engine
 *
 * Tracks usage frequency and reorders menu items within their priority group.
 * Items reorder ONLY within their priority group (LOW never rises above CRITICAL).
 *
 * Algorithm:
 * - score = frequency * 0.7 + recencyBonus * 0.3
 * - Recency decays over 7 days
 * - Items get isPersonalized flag after threshold
 */

const STORAGE_KEY = 'axolop_menu_frequency';
const ACTIVATION_THRESHOLD = 20; // Total actions before reordering activates
const RECENCY_DECAY_DAYS = 7;

/**
 * Get frequency data from localStorage
 */
function getFrequencyData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { actions: {}, totalClicks: 0 };
  } catch {
    return { actions: {}, totalClicks: 0 };
  }
}

/**
 * Save frequency data to localStorage
 */
function saveFrequencyData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // localStorage full or unavailable
  }
}

/**
 * Record a click on a menu item
 * @param {string} entityType - 'lead', 'contact', etc.
 * @param {string} itemKey - Menu item key
 */
export function recordMenuClick(entityType, itemKey) {
  if (!entityType || !itemKey) return;

  const data = getFrequencyData();
  const key = `${entityType}:${itemKey}`;

  if (!data.actions[key]) {
    data.actions[key] = { count: 0, lastUsed: null };
  }

  data.actions[key].count++;
  data.actions[key].lastUsed = Date.now();
  data.totalClicks++;

  saveFrequencyData(data);
}

/**
 * Calculate score for a menu item
 */
function calculateScore(actionData) {
  if (!actionData) return 0;

  const frequency = actionData.count || 0;
  const lastUsed = actionData.lastUsed || 0;

  // Recency bonus: 1.0 if used today, decays to 0 over RECENCY_DECAY_DAYS
  const daysSinceUse = (Date.now() - lastUsed) / (1000 * 60 * 60 * 24);
  const recencyBonus = Math.max(0, 1 - (daysSinceUse / RECENCY_DECAY_DAYS));

  return frequency * 0.7 + recencyBonus * 0.3;
}

/**
 * Check if reordering is active (enough total clicks)
 */
export function isReorderingActive() {
  const data = getFrequencyData();
  return data.totalClicks >= ACTIVATION_THRESHOLD;
}

/**
 * Reorder menu items within their priority groups
 * @param {Array} items - Original menu items
 * @param {string} entityType - Entity type for frequency lookup
 * @returns {Array} Reordered items with isPersonalized flag
 */
export function reorderMenuItems(items, entityType) {
  if (!isReorderingActive() || !entityType || !items?.length) {
    return items;
  }

  const data = getFrequencyData();

  // Group items by priority (using item.priority or default to 2)
  const groups = {};
  const nonGroupable = []; // dividers, headers, smart-headers

  items.forEach((item, originalIndex) => {
    if (item.type === 'divider' || item.type === 'header' || item.type === 'smart-header') {
      nonGroupable.push({ item, originalIndex });
      return;
    }

    const priority = item.priority ?? 2; // Default to MEDIUM
    if (!groups[priority]) groups[priority] = [];

    const key = `${entityType}:${item.key}`;
    const score = calculateScore(data.actions[key]);

    groups[priority].push({
      item: score > 0 ? { ...item, isPersonalized: true } : item,
      originalIndex,
      score,
    });
  });

  // Sort within each priority group by score (highest first)
  Object.keys(groups).forEach(priority => {
    groups[priority].sort((a, b) => b.score - a.score);
  });

  // Rebuild the items array maintaining structural elements (dividers/headers)
  // in their original positions relative to the items
  const result = [];
  let itemQueue = [];

  // Flatten groups in priority order
  const priorities = Object.keys(groups).sort((a, b) => Number(a) - Number(b));
  priorities.forEach(p => {
    groups[p].forEach(entry => itemQueue.push(entry.item));
  });

  // Interleave with structural elements at original positions
  let structuralIdx = 0;
  let itemIdx = 0;

  for (let i = 0; i < items.length; i++) {
    const structural = nonGroupable.find(s => s.originalIndex === i);
    if (structural) {
      result.push(structural.item);
    } else if (itemIdx < itemQueue.length) {
      result.push(itemQueue[itemIdx++]);
    }
  }

  // Add any remaining items
  while (itemIdx < itemQueue.length) {
    result.push(itemQueue[itemIdx++]);
  }

  return result;
}

/**
 * Reset all frequency data
 */
export function resetMenuFrequency() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
