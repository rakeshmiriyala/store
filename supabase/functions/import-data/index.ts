import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.84.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Import data from the repository
const tags = [
  { id: "special-offer", name: "Special Offer" },
  { id: "organic", name: "Organic" },
  { id: "new", name: "New" },
  { id: "vegan", name: "Vegan" },
  { id: "vegetarian", name: "Vegetarian" },
  { id: "gluten-free", name: "Gluten Free" },
  { id: "5-days-msl", name: "5 Days MSL" },
];

const categories = [
  { id: "15", slug: "food-cupboard", name: "Food Cupboard", parent_id: null, product_count: 42, image: "category-food-cupboard" },
  { id: "16", slug: "beverages", name: "Beverages", parent_id: null, product_count: 30, image: "category-beverages" },
  { id: "17", slug: "frozen-foods", name: "Frozen Foods", parent_id: null, product_count: 24, image: "category-frozen-foods" },
  { id: "19", slug: "snacks", name: "Snacks", parent_id: null, product_count: 22, image: "category-snacks" },
  { id: "114", slug: "sauces-pastes-pasta", name: "Sauces, Pastes & Pasta", parent_id: "15", product_count: 22, image: null },
  { id: "115", slug: "canned-goods", name: "Canned Goods", parent_id: "15", product_count: 12, image: null },
  { id: "116", slug: "rice-grains", name: "Rice & Grains", parent_id: "15", product_count: 8, image: null },
  { id: "pasta-passata", slug: "pasta-passata-pesto", name: "Pasta, Passata & Pesto", parent_id: "114", product_count: 10, image: null },
  { id: "asian-sauces", slug: "asian-sauces", name: "Asian Sauces", parent_id: "114", product_count: 7, image: null },
  { id: "cooking-pastes", slug: "cooking-pastes", name: "Cooking Pastes", parent_id: "114", product_count: 5, image: null },
  { id: "frozen-meat", slug: "frozen-meat", name: "Frozen Meat", parent_id: "17", product_count: 12, image: null },
  { id: "frozen-vegetables", slug: "frozen-vegetables", name: "Frozen Vegetables", parent_id: "17", product_count: 12, image: null },
  { id: "frozen-chicken", slug: "frozen-chicken", name: "Frozen Chicken", parent_id: "frozen-meat", product_count: 6, image: null },
  { id: "frozen-beef", slug: "frozen-beef", name: "Frozen Beef", parent_id: "frozen-meat", product_count: 6, image: null },
  { id: "soft-drinks", slug: "soft-drinks", name: "Soft Drinks", parent_id: "16", product_count: 15, image: null },
  { id: "juices", slug: "juices", name: "Juices", parent_id: "16", product_count: 15, image: null },
  { id: "cola-drinks", slug: "cola-drinks", name: "Cola Drinks", parent_id: "soft-drinks", product_count: 8, image: null },
  { id: "lemonade", slug: "lemonade", name: "Lemonade", parent_id: "soft-drinks", product_count: 7, image: null },
  { id: "chips-crisps", slug: "chips-crisps", name: "Chips & Crisps", parent_id: "19", product_count: 12, image: null },
  { id: "nuts-seeds", slug: "nuts-seeds", name: "Nuts & Seeds", parent_id: "19", product_count: 10, image: null },
  { id: "potato-chips", slug: "potato-chips", name: "Potato Chips", parent_id: "chips-crisps", product_count: 7, image: null },
  { id: "tortilla-chips", slug: "tortilla-chips", name: "Tortilla Chips", parent_id: "chips-crisps", product_count: 5, image: null },
];

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    console.log('Starting data import...')

    // Insert tags
    console.log('Inserting tags...')
    const { error: tagsError } = await supabase
      .from('tags')
      .upsert(tags, { onConflict: 'id' })
    
    if (tagsError) {
      console.error('Error inserting tags:', tagsError)
      throw tagsError
    }
    console.log(`Inserted ${tags.length} tags`)

    // Insert categories
    console.log('Inserting categories...')
    const { error: categoriesError } = await supabase
      .from('categories')
      .upsert(categories, { onConflict: 'id' })
    
    if (categoriesError) {
      console.error('Error inserting categories:', categoriesError)
      throw categoriesError
    }
    console.log(`Inserted ${categories.length} categories`)

    // Fetch products data from the GitHub repository
    console.log('Fetching products from GitHub...')
    const response = await fetch(
      'https://raw.githubusercontent.com/harshasharma21/database-connect-pro/main/src/data/mockData.ts'
    )
    const content = await response.text()

    // Parse products from the TypeScript file
    const productsMatch = content.match(/export const mockProducts: Product\[\] = \[([\s\S]*)\];/)
    if (!productsMatch) {
      throw new Error('Could not parse products from file')
    }

    // Extract product objects using regex
    const productStrings = productsMatch[1].match(/\{[^}]*\}/g) || []
    const products = productStrings.map((prodStr) => {
      const getId = (str: string) => str.match(/id:\s*"([^"]+)"/)?.[1] || ''
      const getSku = (str: string) => str.match(/sku:\s*"([^"]+)"/)?.[1] || ''
      const getName = (str: string) => str.match(/name:\s*"([^"]+)"/)?.[1] || ''
      const getDesc = (str: string) => str.match(/description:\s*"([^"]+)"/)?.[1] || ''
      const getShortDesc = (str: string) => str.match(/shortDescription:\s*"([^"]+)"/)?.[1] || ''
      const getPrice = (str: string) => parseFloat(str.match(/price:\s*([\d.]+)/)?.[1] || '0')
      const getImages = (str: string) => {
        const match = str.match(/images:\s*\[([^\]]+)\]/)
        if (!match) return []
        return match[1].split(',').map(img => img.trim().replace(/['"]/g, ''))
      }
      const getCategory = (str: string) => str.match(/category:\s*"([^"]+)"/)?.[1] || ''
      const getSubcategory = (str: string) => str.match(/subcategory:\s*"([^"]+)"/)?.[1] || null
      const getBrand = (str: string) => str.match(/brand:\s*"([^"]+)"/)?.[1] || ''
      const getPackSize = (str: string) => str.match(/packSize:\s*"([^"]+)"/)?.[1] || ''
      const getUnit = (str: string) => str.match(/unit:\s*"([^"]+)"/)?.[1] || ''
      const getStock = (str: string) => parseInt(str.match(/stock:\s*(\d+)/)?.[1] || '0')
      const getInStock = (str: string) => str.includes('inStock: true')
      const getTags = (str: string) => {
        const match = str.match(/tags:\s*\[([^\]]+)\]/)
        if (!match) return []
        return match[1].split(',').map(tag => tag.trim().replace(/['"]/g, ''))
      }

      return {
        id: getId(prodStr),
        sku: getSku(prodStr),
        name: getName(prodStr),
        description: getDesc(prodStr),
        short_description: getShortDesc(prodStr),
        price: getPrice(prodStr),
        images: getImages(prodStr),
        category: getCategory(prodStr),
        subcategory: getSubcategory(prodStr),
        brand: getBrand(prodStr),
        pack_size: getPackSize(prodStr),
        unit: getUnit(prodStr),
        stock: getStock(prodStr),
        in_stock: getInStock(prodStr),
        tags: getTags(prodStr),
      }
    }).filter(p => p.id && p.sku && p.name)

    console.log(`Parsed ${products.length} products`)

    // Insert products in batches
    const batchSize = 100
    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize)
      console.log(`Inserting products batch ${i / batchSize + 1}...`)
      
      const { error: productsError } = await supabase
        .from('products')
        .upsert(batch, { onConflict: 'id' })
      
      if (productsError) {
        console.error('Error inserting products batch:', productsError)
        throw productsError
      }
    }

    console.log('Data import completed successfully!')

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Data imported successfully',
        stats: {
          tags: tags.length,
          categories: categories.length,
          products: products.length
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Import error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})