
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProductById } from '@/services/api';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, Heart, ShoppingCart, Star } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import ProductImageGallery from '@/components/ProductImageGallery';
import RelatedProducts from '@/components/RelatedProducts';
import { toast } from 'sonner';
import { useWishlist } from '@/contexts/WishlistContext';

const ProductDetails: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const { addToCart, getDiscountedPrice } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => getProductById(Number(productId)),
  });
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin h-8 w-8 border-4 border-pink-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }
  
  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        <p className="text-red-500 mb-4">Failed to load product details. Please try again.</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }
  
  const discountedPrice = getDiscountedPrice(product);
  const isWishlisted = isInWishlist(product.id);
  
  const handleWishlistToggle = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id);
      toast('Removed from wishlist');
    } else {
      addToWishlist(product);
      toast('Added to wishlist');
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <div className="mb-6">
        <Link to="/" className="inline-flex items-center text-gray-600 hover:text-pink-500 transition-colors">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to products
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg overflow-hidden">
          <ProductImageGallery images={product.images} />
        </div>
        
        <div className="flex flex-col">
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-semibold">{product.title}</h1>
                <p className="text-gray-600 mb-2">{product.brand}</p>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className={isWishlisted ? "text-pink-500" : "text-gray-400"}
                onClick={handleWishlistToggle}
              >
                <Heart className={`h-6 w-6 ${isWishlisted ? "fill-pink-500" : ""}`} />
              </Button>
            </div>
            
            <div className="flex items-center mb-4">
              <div className="flex items-center text-yellow-400 mr-2">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-4 w-4 ${i < Math.floor(product.rating) ? "fill-yellow-400" : ""}`} 
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">{product.rating} rating</span>
            </div>
          </div>
          
          <div className="mb-6">
            <Badge className="bg-green-100 text-green-800 hover:bg-green-100 mb-2">
              In Stock: {product.stock} left
            </Badge>
            
            <div className="flex items-baseline mt-2">
              <span className="text-3xl font-bold text-gray-900">₹{discountedPrice.toFixed(2)}</span>
              <span className="ml-3 line-through text-lg text-gray-400">₹{product.price.toFixed(2)}</span>
              <span className="ml-3 text-pink-500 font-medium">
                {product.discountPercentage.toFixed(1)}% OFF
              </span>
            </div>
          </div>
          
          <Separator className="my-6" />
          
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Description</h3>
            <p className="text-gray-600">{product.description}</p>
          </div>
          
          <div className="mt-auto">
            <Button 
              onClick={() => {
                addToCart(product);
              }}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white font-medium py-3"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
      
      <Separator className="my-10" />
      
      <RelatedProducts 
        categoryId={product.category} 
        currentProductId={product.id} 
      />
    </div>
  );
};

export default ProductDetails;
