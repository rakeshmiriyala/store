import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { mockProducts, categories, tags } from "@/data/mockData";
import { ChevronRight, ChevronDown, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Category = () => {
  const { "*": fullPath } = useParams();
  const navigate = useNavigate();
  
  // Parse the path - can be category, category/subcategory, or includes /product/id
  const pathParts = fullPath?.split('/').filter(Boolean) || [];
  
  // Check if this is a product detail page (has "product" in path)
  const productIndex = pathParts.indexOf('product');
  
  // If it's a product page, redirect to ProductDetail (this shouldn't happen with proper routing)
  if (productIndex !== -1) {
    return null;
  }
  
  // Get the last part of the path to find the current category
  const lastSlug = pathParts[pathParts.length - 1];
  
  // Try to find by slug directly first
  let category = categories.find(c => c.slug === lastSlug);
  
  // If not found by slug alone, try parsing slug-id format
  if (!category && lastSlug) {
    const categoryId = lastSlug.split('-').pop() || '';
    category = categories.find(c => c.id === categoryId);
  }

  // Filter state
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [openCategories, setOpenCategories] = useState<string[]>(() => {
    // Auto-expand the current category and its parents
    if (category) {
      const expandedIds: string[] = [category.id];
      let current = category;
      while (current?.parentId) {
        expandedIds.push(current.parentId);
        current = categories.find(c => c.id === current?.parentId) as typeof category;
      }
      return expandedIds;
    }
    return [];
  });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Build full breadcrumb chain
  const buildBreadcrumbChain = () => {
    if (!category) return [];
    
    const chain: typeof categories = [];
    let current = category;
    
    while (current) {
      chain.unshift(current);
      if (current.parentId) {
        current = categories.find(c => c.id === current.parentId) as typeof category;
      } else {
        break;
      }
    }
    
    return chain;
  };

  const breadcrumbChain = buildBreadcrumbChain();

  // Get all descendant category slugs for filtering products
  const getAllDescendantSlugs = (catId: string): string[] => {
    const cat = categories.find(c => c.id === catId);
    if (!cat) return [];
    
    const slugs = [cat.slug];
    const children = categories.filter(c => c.parentId === catId);
    
    children.forEach(child => {
      slugs.push(...getAllDescendantSlugs(child.id));
    });
    
    return slugs;
  };

  let categoryProducts = category 
    ? mockProducts.filter(p => {
        const descendantSlugs = getAllDescendantSlugs(category!.id);
        return descendantSlugs.includes(p.category) || 
               descendantSlugs.includes(p.subcategory || '');
      })
    : [];

  // Filter by tags
  if (selectedTags.length > 0) {
    categoryProducts = categoryProducts.filter(p =>
      p.tags?.some(tag => selectedTags.includes(tag))
    );
  }

  const toggleCategory = (categoryId: string) => {
    setOpenCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const getSubcategories = (parentId: string) => {
    return categories.filter(cat => cat.parentId === parentId);
  };

  const handleCategoryClick = (cat: typeof category) => {
    if (cat) {
      navigate(buildCategoryPath(cat));
    }
  };

  // Build link path for a category in the breadcrumb
  const buildCategoryPath = (targetCategory: typeof category) => {
    if (!targetCategory) return '/shop';
    
    const chain: string[] = [];
    let current = targetCategory;
    
    while (current) {
      chain.unshift(current.slug);
      if (current.parentId) {
        current = categories.find(c => c.id === current.parentId) as typeof category;
      } else {
        break;
      }
    }
    
    return `/shop/${chain.join('/')}`;
  };

  const FilterContent = () => (
    <>
      <div className="mb-6">
        <h2 className="font-semibold text-lg mb-4">Categories</h2>
        <div className="space-y-1">
          {/* All Products option */}
          <Link
            to="/shop"
            className={`flex items-center space-x-2 py-1.5 px-2 rounded cursor-pointer transition-colors hover:bg-muted`}
          >
            <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
            <span className="text-sm font-medium">All Products</span>
          </Link>

          {categories.filter(cat => !cat.parentId).map((cat) => {
            const level2Categories = getSubcategories(cat.id);
            const hasSubcategories = level2Categories.length > 0;
            const isSelected = category?.id === cat.id;
            const descendantSlugs = getAllDescendantSlugs(cat.id);
            const isChildSelected = category && descendantSlugs.includes(category.slug);
            
            return (
              <div key={cat.id} className="space-y-0.5">
                <div 
                  className={`flex items-center py-1.5 px-2 rounded cursor-pointer transition-colors ${
                    isSelected ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
                  }`}
                  onClick={() => {
                    handleCategoryClick(cat);
                    if (hasSubcategories) toggleCategory(cat.id);
                  }}
                >
                  <div className={`w-2 h-2 rounded-full ${isSelected || isChildSelected ? 'bg-primary' : 'bg-muted-foreground/30'}`} />
                  <span className="text-sm ml-2 flex-1">{cat.name}</span>
                  {hasSubcategories && (
                    <div className="ml-auto">
                      {openCategories.includes(cat.id) ? (
                        <ChevronDown className="h-3 w-3" />
                      ) : (
                        <ChevronRight className="h-3 w-3" />
                      )}
                    </div>
                  )}
                </div>

                {/* Level 2 Subcategories */}
                {hasSubcategories && openCategories.includes(cat.id) && (
                  <div className="ml-5 space-y-0.5">
                    {level2Categories.map((subcat) => {
                      const level3Categories = getSubcategories(subcat.id);
                      const hasLevel3 = level3Categories.length > 0;
                      const isSubSelected = category?.id === subcat.id;
                      const subDescendantSlugs = getAllDescendantSlugs(subcat.id);
                      const isSubChildSelected = category && subDescendantSlugs.includes(category.slug);
                      
                      return (
                        <div key={subcat.id} className="space-y-0.5">
                          <div 
                            className={`flex items-center py-1 px-2 rounded cursor-pointer transition-colors ${
                              isSubSelected ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
                            }`}
                            onClick={() => {
                              handleCategoryClick(subcat);
                              if (hasLevel3) toggleCategory(subcat.id);
                            }}
                          >
                            <div className={`w-1.5 h-1.5 rounded-full ${isSubSelected || isSubChildSelected ? 'bg-primary' : 'bg-muted-foreground/30'}`} />
                            <span className="text-sm text-muted-foreground ml-2 flex-1">{subcat.name}</span>
                            {hasLevel3 && (
                              <div className="ml-auto">
                                {openCategories.includes(subcat.id) ? (
                                  <ChevronDown className="h-3 w-3" />
                                ) : (
                                  <ChevronRight className="h-3 w-3" />
                                )}
                              </div>
                            )}
                          </div>

                          {/* Level 3 Sub-subcategories */}
                          {hasLevel3 && openCategories.includes(subcat.id) && (
                            <div className="ml-5 space-y-0.5">
                              {level3Categories.map((subsubcat) => {
                                const isSubSubSelected = category?.id === subsubcat.id;
                                return (
                                  <div 
                                    key={subsubcat.id} 
                                    className={`flex items-center space-x-2 py-1 px-2 ml-5 rounded cursor-pointer transition-colors ${
                                      isSubSubSelected ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
                                    }`}
                                    onClick={() => handleCategoryClick(subsubcat)}
                                  >
                                    <div className={`w-1.5 h-1.5 rounded-full ${isSubSubSelected ? 'bg-primary' : 'bg-muted-foreground/30'}`} />
                                    <span className="text-sm text-muted-foreground">{subsubcat.name}</span>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <Separator />

      {/* Tags */}
      <div className="mt-6">
        <h3 className="font-semibold mb-3">Tags</h3>
        <div className="space-y-2">
          {tags.map((tag) => (
            <div key={tag.id} className="flex items-center space-x-2">
              <Checkbox
                id={tag.id}
                checked={selectedTags.includes(tag.id)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedTags([...selectedTags, tag.id]);
                  } else {
                    setSelectedTags(selectedTags.filter(t => t !== tag.id));
                  }
                }}
              />
              <Label htmlFor={tag.id} className="text-sm font-normal cursor-pointer">
                {tag.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Button 
        variant="outline" 
        className="w-full mt-6" 
        onClick={() => {
          setSelectedTags([]);
        }}
      >
        Clear Filters
      </Button>
    </>
  );

  if (!category) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Category Not Found</h1>
          <Link to="/shop" className="text-primary hover:underline">
            Back to Shop
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-neutral-50 border-b border-border">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex items-center gap-2 text-sm flex-wrap">
              <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                Home
              </Link>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              <Link 
                to="/shop" 
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Shop
              </Link>
              {breadcrumbChain.map((cat, index) => (
                <span key={cat.id} className="flex items-center gap-2">
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  {index === breadcrumbChain.length - 1 ? (
                    <span className="font-medium text-foreground">{cat.name}</span>
                  ) : (
                    <Link
                      to={buildCategoryPath(cat)}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {cat.name}
                    </Link>
                  )}
                </span>
              ))}
            </nav>
          </div>
        </div>

        {/* Category Header */}
        <section className="bg-gradient-to-r from-primary/10 to-accent/10 py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{category.name}</h1>
            <p className="text-sm text-muted-foreground">
              {categoryProducts.length} products available
            </p>
          </div>
        </section>

        {/* Products with Sidebar */}
        <section className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Mobile Filter Button */}
            <div className="lg:hidden">
              <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filters
                    {selectedTags.length > 0 && (
                      <span className="ml-2 bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                        {selectedTags.length}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 overflow-y-auto">
                  <FilterContent />
                </SheetContent>
              </Sheet>
            </div>

            {/* Desktop Filters Sidebar */}
            <aside className="hidden lg:block lg:w-64 flex-shrink-0">
              <div className="sticky top-24">
                <FilterContent />
              </div>
            </aside>

            {/* Products Grid */}
            <div className="flex-1 min-w-0">
              {categoryProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                  {categoryProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-lg text-muted-foreground mb-4">
                    No products available in this category{selectedTags.length > 0 ? ' with selected filters' : ''}.
                  </p>
                  {selectedTags.length > 0 ? (
                    <Button 
                      variant="link" 
                      onClick={() => setSelectedTags([])}
                      className="mt-4"
                    >
                      Clear filters
                    </Button>
                  ) : (
                    <Link to="/shop" className="text-primary hover:underline">
                      Browse all products
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Category;
