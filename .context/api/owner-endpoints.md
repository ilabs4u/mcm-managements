# Owner API Endpoints

All endpoints require `role = 'owner'`.

## GET /api/owner/dashboard
**Purpose**: Aggregated today's production data across all franchises
**Input**: none
**Output**:
```json
{
  "success": true,
  "data": {
    "franchises": [
      {
        "id": "uuid",
        "name": "MCM Navrangpura",
        "is_open": true,
        "manager_name": "Rahul Patel",
        "today": {
          "products": [
            { "name": "Dum Biryani", "total_kg": 12, "total_packets": 4 },
            { "name": "Tandoori Biryani", "total_kg": 9, "total_packets": 3 },
            { "name": "Chicken Tikka", "total_kg": 4, "total_packets": 2 }
          ],
          "materials": [
            { "name": "Rice", "total": 28, "unit": "kg" },
            { "name": "Berista", "total": 3500, "unit": "gm" }
          ],
          "last_entry_at": "2026-07-19T14:30:00Z"
        }
      }
    ],
    "aggregate": {
      "open_count": 28,
      "total_franchises": 30,
      "products": [...],
      "materials": [...]
    }
  }
}
```

---

## GET /api/owner/franchises
**Purpose**: List all franchises with optional status filter
**Input**: `?status=approved|pending|rejected|suspended|all`
**Output**: `{ success: true, data: { franchises[] } }`

---

## GET /api/owner/franchises/[id]
**Purpose**: Single franchise detail with monthly logs
**Input**: franchise ID in URL, `?month=2026-07` (optional, defaults to current)
**Output**: `{ success: true, data: { franchise, manager, logs[] } }`

---

## PATCH /api/owner/franchises/[id]
**Purpose**: Approve, reject, or suspend a franchise
**Input**: `{ status: "approved" | "rejected" | "suspended" }`
**Output**: `{ success: true }`
**Side effects**: 
- Updates franchise.status
- If approving: sets approved_at = now(), approved_by = owner's id

---

## GET /api/owner/reports
**Purpose**: Monthly report data for a franchise
**Input**: `?franchise_id=UUID&month=2026-07`
**Output**:
```json
{
  "success": true,
  "data": {
    "days": [
      {
        "date": "2026-07-19",
        "is_open": true,
        "products": [
          { "name": "Dum Biryani", "total_packets": 4, "total_kg": 12 }
        ]
      }
    ],
    "monthSummary": {
      "products": [...],
      "materials": [...],
      "days_open": 25,
      "days_closed": 5
    }
  }
}
```
