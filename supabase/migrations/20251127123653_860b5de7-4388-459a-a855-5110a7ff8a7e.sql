
-- Update pasta products
UPDATE products 
SET images = ARRAY['https://bctazdnfpgxymmmhawnn.supabase.co/storage/v1/object/public/product-images/products/product-pasta.jpg']
WHERE (name ILIKE '%pasta%' OR name ILIKE '%penne%' OR name ILIKE '%spaghetti%' OR name ILIKE '%fusilli%' OR name ILIKE '%rigatoni%' OR name ILIKE '%farfalle%')
  AND (images IS NULL OR images = '{}' OR images = ARRAY['/placeholder.svg']);

-- Update pesto/sauce products  
UPDATE products
SET images = ARRAY['https://bctazdnfpgxymmmhawnn.supabase.co/storage/v1/object/public/product-images/products/product-pesto.jpg']
WHERE (name ILIKE '%pesto%' OR name ILIKE '%sauce%' OR subcategory = 'asian-sauces' OR subcategory = 'cooking-pastes')
  AND (images IS NULL OR images = '{}' OR images = ARRAY['/placeholder.svg'])
  AND name NOT ILIKE '%pasta%';

-- Update chips/snacks
UPDATE products
SET images = ARRAY['https://bctazdnfpgxymmmhawnn.supabase.co/storage/v1/object/public/product-images/products/product-chips.jpg']  
WHERE (name ILIKE '%chips%' OR name ILIKE '%crisps%' OR subcategory IN ('potato-chips', 'tortilla-chips'))
  AND (images IS NULL OR images = '{}' OR images = ARRAY['/placeholder.svg']);

-- Update nuts and seeds
UPDATE products
SET images = ARRAY['https://bctazdnfpgxymmmhawnn.supabase.co/storage/v1/object/public/product-images/products/product-chips.jpg']
WHERE (name ILIKE '%nuts%' OR name ILIKE '%seeds%' OR name ILIKE '%peanuts%' OR name ILIKE '%cashew%' OR name ILIKE '%almonds%' OR name ILIKE '%trail mix%' OR name ILIKE '%pistachios%' OR name ILIKE '%walnuts%' OR subcategory = 'nuts-seeds')
  AND (images IS NULL OR images = '{}' OR images = ARRAY['/placeholder.svg']);

-- Update cola/soft drinks
UPDATE products
SET images = ARRAY['https://bctazdnfpgxymmmhawnn.supabase.co/storage/v1/object/public/product-images/products/product-cola.jpg']
WHERE (name ILIKE '%cola%' OR name ILIKE '%lemonade%' OR subcategory IN ('cola-drinks', 'lemonade', 'soft-drinks'))
  AND (images IS NULL OR images = '{}' OR images = ARRAY['/placeholder.svg']);

-- Update juice products
UPDATE products
SET images = ARRAY['https://bctazdnfpgxymmmhawnn.supabase.co/storage/v1/object/public/product-images/products/product-orange-juice.jpg']
WHERE (name ILIKE '%juice%' OR subcategory = 'juices')
  AND (images IS NULL OR images = '{}' OR images = ARRAY['/placeholder.svg']);

-- Update water products
UPDATE products
SET images = ARRAY['https://bctazdnfpgxymmmhawnn.supabase.co/storage/v1/object/public/product-images/products/product-water.jpg']
WHERE name ILIKE '%water%'
  AND (images IS NULL OR images = '{}' OR images = ARRAY['/placeholder.svg']);

-- Update canned goods with passata image as fallback
UPDATE products
SET images = ARRAY['https://bctazdnfpgxymmmhawnn.supabase.co/storage/v1/object/public/product-images/products/product-passata.jpg']
WHERE subcategory = 'canned-goods'
  AND (images IS NULL OR images = '{}' OR images = ARRAY['/placeholder.svg']);
