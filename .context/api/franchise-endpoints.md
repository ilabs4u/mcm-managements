# Franchise API Endpoints

All endpoints require `role = 'franchise_manager'` with `franchise.status = 'approved'`.
Franchise ID is derived from the authenticated user's session (not passed by client).

## GET /api/franchise/today
**Purpose**: Get today's daily log with all entries for the manager's franchise
**Input**: none
**Output**:
```json
{
  "success": true,
  "data": {
    "log": { "id": "uuid", "log_date": "2026-07-19", "is_open": true },
    "items": [
      {
        "id": "uuid",
        "product_id": "uuid",
        "product_name": "Dum Biryani",
        "quantity_kg": 1.5,
        "quantity_packets": 0.5,
        "material_breakdown": { "ingredients": [...] },
        "created_at": "2026-07-19T10:30:00Z"
      }
    ],
    "products": [...],
    "recipes": [...]
  }
}
```

---

## POST /api/franchise/entries
**Purpose**: Add a production entry (auto-calculates materials server-side)
**Input**:
```json
{
  "product_id": "uuid (required)",
  "quantity_kg": 1.5
}
```
**Output**: `{ success: true, data: { entry } }`
**Validation**: 
- quantity_kg > 0
- product_id must be a valid active product
- franchise must be approved
**Side effects**:
1. UPSERT daily_logs for today (creates if not exists)
2. Fetch latest recipe for product from product_ingredients
3. Calculate: packets = quantity_kg / packet_size_kg
4. Calculate material breakdown from recipe × packets
5. INSERT daily_log_items with all calculated fields
**Note**: Recipe is fetched at insert time (server is source of truth).

---

## DELETE /api/franchise/entries/[id]
**Purpose**: Delete a production entry (for corrections)
**Input**: entry ID in URL
**Output**: `{ success: true }`
**Validation**:
- Entry must belong to the authenticated user's franchise
- Entry must be from today (cannot delete past entries)
**Side effects**: DELETE from daily_log_items

---

## PATCH /api/franchise/toggle-open
**Purpose**: Toggle franchise open/closed for today
**Input**: `{ is_open: boolean }`
**Output**: `{ success: true }`
**Side effects**:
- UPDATE franchises SET is_open = value
- UPSERT daily_logs for today SET is_open = value

---

## GET /api/franchise/history
**Purpose**: Get past daily logs for a given month
**Input**: `?month=2026-07` (defaults to current month)
**Output**:
```json
{
  "success": true,
  "data": {
    "logs": [
      {
        "log_date": "2026-07-18",
        "is_open": true,
        "items": [
          { "product_name": "Dum Biryani", "total_kg": 9, "total_packets": 3 }
        ]
      }
    ]
  }
}
```
