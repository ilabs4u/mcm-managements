# Entity Relationship Map

```
auth.users (Supabase managed)
    └── profiles (1:1, ON DELETE CASCADE)
            ├── franchises.manager_id (1:1)
            └── franchises.approved_by (1:many)

franchises
    └── daily_logs (1:many, per day unique)
            └── daily_log_items (1:many, multiple entries per day)

products
    ├── product_ingredients (1:many, recipe components)
    └── daily_log_items.product_id (1:many)

ingredients
    └── product_ingredients (1:many)
```

## Key Constraints
- `daily_logs` has UNIQUE(franchise_id, log_date) — one log per day per franchise
- `product_ingredients` has UNIQUE(product_id, ingredient_id) — one recipe entry per product-ingredient pair
- `daily_log_items.quantity_kg` has CHECK >= 0
- `profiles.role` has CHECK IN ('owner', 'franchise_manager')
- `franchises.status` has CHECK IN ('pending', 'approved', 'rejected', 'suspended')