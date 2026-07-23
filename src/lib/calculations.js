/**
 * Auto-calculation engine for MCM franchise material tracking.
 *
 * WHY: Franchise managers only log kg produced. This engine converts
 * that into raw material usage based on owner-defined recipes.
 * Used client-side for live preview AND server-side for authoritative save.
 * Server-side calculation is the source of truth — never trust client math.
 */

/**
 * Calculate material usage for a given quantity of a product.
 *
 * @param {number} quantity_kg - How many kg the manager produced
 * @param {number} packet_size_kg - The packet size for this product (e.g. 3 for Dum Biryani)
 * @param {Array} recipe - Array of { name, quantity_per_packet, unit } from product_ingredients
 * @returns {{ packets: number, ingredients: Array<{ name: string, quantity: number, unit: string }> }}
 */
export function calculateMaterials(quantity_kg, packet_size_kg, recipe) {
  if (!quantity_kg || !packet_size_kg || packet_size_kg <= 0) {
    return { packets: 0, ingredients: [] };
  }

  const packets = quantity_kg / packet_size_kg;

  const ingredients = recipe.map((item) => ({
    name: item.name,
    quantity: roundTo(packets * item.quantity_per_packet, 3),
    unit: item.unit,
  }));

  return {
    packets: roundTo(packets, 3),
    ingredients,
  };
}

/**
 * Build the material_breakdown JSON snapshot for DB storage.
 * Stored frozen in daily_log_items.material_breakdown so recipe changes
 * do not affect historical records.
 *
 * @param {string} product_name
 * @param {number} quantity_kg
 * @param {number} packets
 * @param {Array} ingredients - From calculateMaterials()
 * @returns {object} material_breakdown JSONB-ready object
 */
export function buildMaterialBreakdown(product_name, quantity_kg, packets, ingredients) {
  return {
    product_name,
    quantity_kg,
    packets_used: packets,
    ingredients,
  };
}

/**
 * Aggregate material totals across multiple entries.
 * Used for the day summary bar and owner aggregate view.
 *
 * @param {Array} entries - Array of { material_breakdown: { ingredients[] } }
 * @returns {Array<{ name: string, total: number, unit: string }>}
 */
export function aggregateMaterials(entries) {
  const totals = {};

  entries.forEach((entry) => {
    const breakdown = entry.material_breakdown;
    if (!breakdown?.ingredients) return;

    breakdown.ingredients.forEach(({ name, quantity, unit }) => {
      if (!totals[name]) {
        totals[name] = { name, total: 0, unit };
      }
      totals[name].total = roundTo(totals[name].total + quantity, 3);
    });
  });

  return Object.values(totals);
}

// Round to N decimal places to avoid floating-point drift
function roundTo(num, decimals) {
  return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
}
