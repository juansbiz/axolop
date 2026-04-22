/**
 * Radial Menu Position Utilities
 *
 * Angle calculation for the 5-slice radial menu.
 * Fixed positions by action category:
 * - Top (0deg / 90deg): Primary action (View/Edit)
 * - Right (72deg / 18deg): Communication (Email/Call)
 * - Bottom-right (144deg / -54deg): Organization (Move/Assign)
 * - Bottom-left (216deg / -126deg): Destructive (Delete/Archive)
 * - Left (288deg / -198deg): Quick create (Add Task/Note)
 */

const SLICE_COUNT = 5;
const SLICE_ANGLE = 360 / SLICE_COUNT; // 72 degrees per slice

// Starting angle offset so first slice is at top
const START_ANGLE = -90;

/**
 * Get the angle range for each slice position
 */
export const SLICE_POSITIONS = Array.from({ length: SLICE_COUNT }, (_, i) => {
  const centerAngle = START_ANGLE + (i * SLICE_ANGLE);
  return {
    index: i,
    centerAngle,
    startAngle: centerAngle - SLICE_ANGLE / 2,
    endAngle: centerAngle + SLICE_ANGLE / 2,
  };
});

/**
 * Position labels for categories
 */
export const POSITION_CATEGORIES = [
  'primary',     // Top (0): View/Edit
  'communicate', // Right (72): Email/Call
  'organize',    // Bottom-right (144): Move/Assign
  'destructive', // Bottom-left (216): Delete/Archive
  'create',      // Left (288): Add Task/Note
];

/**
 * Calculate which slice the mouse is hovering over
 * @param {number} mouseX - Mouse X position
 * @param {number} mouseY - Mouse Y position
 * @param {number} centerX - Center X of radial menu
 * @param {number} centerY - Center Y of radial menu
 * @param {number} deadZone - Radius of dead zone in center (pixels)
 * @returns {number} Slice index (0-4) or -1 if in dead zone
 */
export function getHoveredSlice(mouseX, mouseY, centerX, centerY, deadZone = 25) {
  const dx = mouseX - centerX;
  const dy = mouseY - centerY;
  const distance = Math.sqrt(dx * dx + dy * dy);

  // Dead zone in center
  if (distance < deadZone) return -1;

  // Calculate angle in degrees (-180 to 180)
  let angle = Math.atan2(dy, dx) * (180 / Math.PI);

  // Find which slice this angle falls into
  for (let i = 0; i < SLICE_COUNT; i++) {
    const { startAngle, endAngle } = SLICE_POSITIONS[i];

    // Normalize angles for comparison
    let normalizedAngle = angle;
    let normalizedStart = startAngle;
    let normalizedEnd = endAngle;

    // Handle wrap-around
    if (normalizedStart < -180) {
      normalizedStart += 360;
      normalizedEnd += 360;
      if (normalizedAngle < 0) normalizedAngle += 360;
    }
    if (normalizedEnd > 180) {
      if (normalizedAngle < normalizedStart) normalizedAngle += 360;
    }

    if (normalizedAngle >= normalizedStart && normalizedAngle < normalizedEnd) {
      return i;
    }
  }

  return 0; // Fallback to first slice
}

/**
 * Get the position for an item in the radial menu
 * @param {number} index - Slice index (0-4)
 * @param {number} radius - Distance from center
 * @returns {{ x: number, y: number }} Position offset from center
 */
export function getSlicePosition(index, radius = 80) {
  const { centerAngle } = SLICE_POSITIONS[index];
  const radians = centerAngle * (Math.PI / 180);

  return {
    x: Math.cos(radians) * radius,
    y: Math.sin(radians) * radius,
  };
}

/**
 * Get SVG path for a pie slice
 * @param {number} index - Slice index
 * @param {number} innerRadius - Inner radius
 * @param {number} outerRadius - Outer radius
 * @returns {string} SVG path data
 */
export function getSlicePath(index, innerRadius = 30, outerRadius = 100) {
  const { startAngle, endAngle } = SLICE_POSITIONS[index];

  const startRad = startAngle * (Math.PI / 180);
  const endRad = endAngle * (Math.PI / 180);

  const x1 = Math.cos(startRad) * outerRadius;
  const y1 = Math.sin(startRad) * outerRadius;
  const x2 = Math.cos(endRad) * outerRadius;
  const y2 = Math.sin(endRad) * outerRadius;
  const x3 = Math.cos(endRad) * innerRadius;
  const y3 = Math.sin(endRad) * innerRadius;
  const x4 = Math.cos(startRad) * innerRadius;
  const y4 = Math.sin(startRad) * innerRadius;

  const largeArc = SLICE_ANGLE > 180 ? 1 : 0;

  return [
    `M ${x1} ${y1}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x2} ${y2}`,
    `L ${x3} ${y3}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4}`,
    'Z',
  ].join(' ');
}
