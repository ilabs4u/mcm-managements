# Recipe Management Module — Summary

Allows the owner to configure products, ingredients, and recipes. Changes to recipes automatically affect all franchise portals — future production entries will use the updated ingredient quantities. Existing entries retain their snapshot. Owner can add new products, modify packet sizes, and adjust ingredient quantities per packet.

**Key files**: src/app/(owner)/owner/recipes/page.js, src/components/owner/RecipeEditor.js, src/components/owner/ProductCard.js
**DB tables**: products, ingredients, product_ingredients
**External deps**: None beyond Supabase
**Data flow**: Owner edits recipe → Server action UPDATE product_ingredients → All franchise calcs use new values

→ Full detail: .context/modules/recipe-management/detail.md
