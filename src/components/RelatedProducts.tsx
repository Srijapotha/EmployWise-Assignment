
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getProductsByCategory } from '@/services/api';
import ProductCard from '@/components/ProductCard';

interface RelatedProductsProps {
  categoryId: string;
  currentProductId: number;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ 
  categoryId, 
  currentProductId 
}) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['products', 'category', categoryId],
    queryFn: () => getProductsByCategory(categoryId),
  });
  
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin h-8 w-8 border-4 border-pink-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }
  
  if (error || !data) {
    return null;
  }
  
  // Filter out the current product and limit to 4 related products
  const relatedProducts = data.products
    .filter(product => product.id !== currentProductId)
    .slice(0, 4);
  
  if (relatedProducts.length === 0) {
    return null;
  }
  
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">You may also like</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {relatedProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
