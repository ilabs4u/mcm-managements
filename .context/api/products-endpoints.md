# Products & Recipe API Endpoints

## GET /api/products
**Purpose**: List all products with their recipe ingredients
**Auth**: Any authenticated user (franchise managers need this for calculations)
**Input**: none
**Output**:
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "uuid",
        "name": "Dum Biryani",
        "packet_size_kg": 3.0,
        "is_active": true,
        "sort_order": 1,
        "ingredients": [
          { "id": "uuid", "name": "Rice", "quantity_per_packet": 4.0, "unit": "kg" },
          { "id": "uuid", "name": "Berista", "quantity_per_packet": 500, "unit": "gm" },
          { "id": "uuid", "name": "Dum Masala", "quantity_per_packet": 1.0, "unit": "packet" }
        ]
      }
    ]
  }
}
```

---

## PUT /api/products/[id] (Owner only)
**Purpose**: Update a product's name, packet size, or active status
**Input**: `{ name?, packet_size_kg?, is_active?, sort_order? }`
**Output**: `{ success: true, data: { product } }`
**Validation**: packet_size_kg > 0 if provided

---

## POST /api/products (Owner only)
**Purpose**: Add a new product
**Input**: `{ name, packet_size_kg, sort_order? }`
**Output**: `{ success: true, data: { product } }`
**Validation**: name required and unique, packet_size_kg > 0

---

## PUT /api/products/[id]/recipe (Owner only)
**Purpose**: Update recipe for a product (replaces all ingredients)
**Input**:
```json
{
  "ingredients": [
    { "ingredient_id": "uuid", "quantity_per_packet": 4.0, "unit": "kg" }
  ]
}
```
**Output**: `{ success: true }`
**Side effects**: DELETE all existing product_ingredients for this product, INSERT new ones
**Note**: Past daily_log_items retain their material_breakdown snapshot — not affected.

---

## POST /api/ingredients (Owner only)
**Purpose**: Add a new ingredient type
**Input**: `{ name, unit }`
**Output**: `{ success: true, data: { ingredient } }`
**Validation**: name unique, unit required
