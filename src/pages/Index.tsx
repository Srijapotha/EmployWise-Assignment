
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getProducts, getCategories, searchProducts, getProductsByCategory } from '@/services/api';
import ProductCard from '@/components/ProductCard';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';
import { ShoppingCart, Heart, Search, Filter, X } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import CartList from '@/components/CartList';
import WishlistPanel from '@/components/WishlistPanel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const PRODUCTS_PER_PAGE = 8;

const Index = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { items: cartItems } = useCart();
  const { items: wishlistItems } = useWishlist();
  
  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1);
    }, 500);
    
    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);
  
  // Get categories
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });
  
  // Get products based on search term and category
  const { data, isLoading, error } = useQuery({
    queryKey: ['products', debouncedSearchTerm, selectedCategory, currentPage],
    queryFn: async () => {
      if (debouncedSearchTerm) {
        return searchProducts(debouncedSearchTerm);
      }
      
      if (selectedCategory && selectedCategory !== 'all') {
        return getProductsByCategory(selectedCategory);
      }
      
      return getProducts(currentPage, PRODUCTS_PER_PAGE);
    },
  });

  const totalPages = data ? Math.ceil(data.total / PRODUCTS_PER_PAGE) : 0;
  
  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo(0, 0);
    }
  };
  
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setCurrentPage(1);
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin h-12 w-12 border-4 border-pink-500 rounded-full border-t-transparent mb-4"></div>
          <p className="text-gray-600">Loading amazing products...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
          <div className="text-red-500 mb-4 flex justify-center">
            <X className="h-16 w-16" />
          </div>
          <h2 className="text-2xl font-bold text-center mb-4">Oops! Something went wrong</h2>
          <p className="text-gray-600 text-center mb-6">Failed to load products. Please try again.</p>
          <Button onClick={() => window.location.reload()} className="w-full bg-pink-500 hover:bg-pink-600">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const displayedProducts = data?.products || [];
  const hasActiveFilters = debouncedSearchTerm || selectedCategory !== 'all';

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      <div className="container mx-auto px-4 py-6">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-sm">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600">
            Catalogue
          </h1>
          
          <div className="flex w-full md:w-auto gap-2">
            <div className="relative flex-grow md:w-64">
              <Input
                type="search"
                placeholder="Search products..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10 border-pink-200 focus:border-pink-400 focus:ring-pink-400"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="relative ml-auto border-pink-200 hover:bg-pink-100">
                  <Heart className="h-5 w-5 mr-2 text-pink-500" />
                  Wishlist
                  {wishlistItems.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-pink-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                      {wishlistItems.length}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-md p-0">
                <WishlistPanel />
              </SheetContent>
            </Sheet>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="relative border-pink-200 hover:bg-pink-100">
                  <ShoppingCart className="h-5 w-5 mr-2 text-pink-500" />
                  Cart
                  {cartItems.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-pink-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                      {cartItems.length}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-md p-0">
                <CartList />
              </SheetContent>
            </Sheet>
          </div>
        </header>
        
        {categories && categories.length > 0 && (
          <div className="mb-6 p-4 bg-white/70 backdrop-blur-sm rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-gray-700">Categories</h2>
              {hasActiveFilters && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearFilters}
                  className="text-pink-500 hover:text-pink-600 hover:bg-pink-50"
                >
                  <X className="h-4 w-4 mr-1" /> Clear filters
                </Button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge 
                className={`cursor-pointer ${selectedCategory === 'all' ? 'bg-pink-500 hover:bg-pink-600' : 'bg-white text-gray-800 hover:bg-gray-100 border border-pink-200'}`}
                onClick={() => handleCategoryChange('all')}
              >
                All Categories
              </Badge>
              {categories.slice(0, 10).map((category, index) => {
                // Handle different data types for category
                const categoryName = typeof category === 'object' && category !== null 
                  ? (category.name || category.slug || String(category)) 
                  : String(category);
                
                const categoryValue = typeof category === 'object' && category !== null
                  ? (category.slug || String(category))
                  : String(category);
                  
                // Format display name by replacing hyphens with spaces and capitalizing
                const displayName = categoryName.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
                
                return (
                  <Badge 
                    key={index}
                    className={`cursor-pointer ${selectedCategory === categoryValue ? 'bg-pink-500 hover:bg-pink-600' : 'bg-white text-gray-800 hover:bg-gray-100 border border-pink-200'}`}
                    onClick={() => handleCategoryChange(categoryValue)}
                  >
                    {displayName}
                  </Badge>
                );
              })}
            </div>
          </div>
        )}
        
        {displayedProducts.length === 0 ? (
          <div className="py-16 text-center bg-white/70 backdrop-blur-sm rounded-xl shadow-sm p-8">
            <div className="inline-flex justify-center items-center w-20 h-20 bg-pink-100 rounded-full mb-6">
              <Search className="h-10 w-10 text-pink-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">No products found</h3>
            <p className="text-gray-500 mb-4 max-w-md mx-auto">We couldn't find any products matching your criteria. Try adjusting your search or browse our categories.</p>
            <Button 
              variant="outline" 
              onClick={clearFilters}
              className="border-pink-500 text-pink-500 hover:bg-pink-50"
            >
              Clear filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {displayedProducts.map(product => (
              <div key={product.id} className="transform transition-transform hover:-translate-y-1 hover:shadow-lg">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
        
        {totalPages > 1 && !debouncedSearchTerm && selectedCategory === 'all' && (
          <Pagination className="mt-8">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => handlePageChange(currentPage - 1)} 
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer hover:bg-pink-50 hover:text-pink-500"} 
                />
              </PaginationItem>
              
              {Array.from({ length: Math.min(5, totalPages) }).map((_, index) => {
                let pageNumber;
                
                // Calculate page numbers to show (current page and nearby pages)
                if (totalPages <= 5) {
                  pageNumber = index + 1;
                } else if (currentPage <= 3) {
                  pageNumber = index + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNumber = totalPages - 4 + index;
                } else {
                  pageNumber = currentPage - 2 + index;
                }
                
                return (
                  <PaginationItem key={index}>
                    <PaginationLink
                      isActive={pageNumber === currentPage}
                      onClick={() => handlePageChange(pageNumber)}
                      className={`cursor-pointer ${pageNumber === currentPage ? 'bg-pink-500 text-white hover:bg-pink-600' : 'hover:bg-pink-50 hover:text-pink-500'}`}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => handlePageChange(currentPage + 1)} 
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer hover:bg-pink-50 hover:text-pink-500"} 
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
};

export default Index;
