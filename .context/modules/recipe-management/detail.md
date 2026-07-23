# Recipe Management Module — Full Detail

## Endpoints

### GET /api/products
- **Input**: none
- **Output**: { success: boolean, data?: { products[] with ingredients[] } }
- **Validation**: Authenticated user
- **Side effects**: None

### PUT /api/products/[id]
- **Input**: { name?, packet_size_kg?, is_active?, sort_order? }
- **Output**: { success: boolean, data?: { product } }
- **Validation**: Owner only, packet_size_kg > 0
- **Side effects**: UPDATE products row

### POST /api/products
- **Input**: { name, packet_size_kg, sort_order? }
- **Output**: { success: boolean, data?: { product } }
- **Validation**: Owner only, name unique, packet_size_kg > 0
- **Side effects**: INSERT products

### PUT /api/products/[id]/recipe
- **Input**: { ingredients: [{ ingredient_id, quantity_per_packet, unit }] }
- **Output**: { success: boolean }
- **Validation**: Owner only, quantities > 0
- **Side effects**: DELETE existing + INSERT new product_ingredients rows

### POST /api/ingredients
- **Input**: { name, unit }
- **Output**: { success: boolean, data?: { ingredient } }
- **Validation**: Owner only, name unique
- **Side effects**: INSERT ingredients

---

## Seed Data (Initial Products)

| Product | Packet Size | Ingredients |
|---------|------------|-------------|
| Dum Biryani | 3 kg | Rice: 4kg, Berista: 500gm, Dum Masala: 1 packet |
| Tandoori Biryani | 3 kg | Rice: 4kg, Berista: 500gm, Tandoori Masala: 1 packet |
| Chicken Tikka | 2 kg | No sub-ingredients (Phase 1) |

## Component Hierarchy

```
owner/recipes/page.js
  ├── ProductCard (× N products)
  │     ├── Product name, packet size (editable)
  │     └── RecipeEditor
  │           └── Ingredient rows (add/edit/remove)
  └── "Add New Product" button
```

## File Map

| File | Purpose |
|------|---------|
| src/app/(owner)/owner/recipes/page.js | Recipe management page |
| src/components/owner/ProductCard.js | Product display + edit card |
| src/components/owner/RecipeEditor.js | Ingredient list editor within product |
| src/hooks/useProducts.js | Products + recipes fetch hook |
