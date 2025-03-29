
import React from 'react';
import { Product } from '@/types/types';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, getDiscountedPrice } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const discountedPrice = getDiscountedPrice(product);
  const isWishlisted = isInWishlist(product.id);
  
  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isWishlisted) {
      removeFromWishlist(product.id);
      toast.success('Removed from wishlist');
    } else {
      addToWishlist(product);
      toast.success('Added to wishlist');
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
    toast.success('Added to cart');
  };
  
  return (
    <Card className="h-full flex flex-col group overflow-hidden border-0 shadow-md bg-white">
      <Link to={`/product/${product.id}`} className="flex-grow flex flex-col">
        <div className="relative w-full pt-[75%] overflow-hidden bg-gray-100">
          <img 
            src={product.thumbnail} 
            alt={product.title}
            className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn(
              "absolute top-2 right-2 rounded-full bg-white shadow-md hover:bg-white transition-colors",
              isWishlisted ? "text-pink-500" : "text-gray-500"
            )}
            onClick={handleWishlistToggle}
          >
            <Heart className={cn("h-5 w-5", isWishlisted && "fill-pink-500")} />
          </Button>
          {product.discountPercentage > 0 && (
            <div className="absolute top-2 left-2 bg-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              {product.discountPercentage.toFixed(0)}% OFF
            </div>
          )}
        </div>
        
        <CardContent className="flex-grow p-4">
          <div className="flex items-center mb-2">
            <div className="flex items-center text-amber-400">
              <Star className="h-4 w-4 fill-amber-400" />
              <span className="ml-1 text-xs font-medium">{product.rating.toFixed(1)}</span>
            </div>
            <span className="text-xs text-gray-500 ml-2">{product.brand}</span>
          </div>
          
          <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-pink-500 transition-colors">{product.title}</h3>
          <p className="text-sm text-gray-600 line-clamp-2 h-10 mt-1">{product.description}</p>
          
          <div className="mt-3 flex items-baseline">
            <span className="text-lg font-bold text-gray-900">₹{discountedPrice.toFixed(2)}</span>
            {product.discountPercentage > 0 && (
              <span className="ml-2 line-through text-sm text-gray-400">₹{product.price.toFixed(2)}</span>
            )}
          </div>
        </CardContent>
      </Link>
      
      <CardFooter className="pt-0 pb-4 px-4">
        <Button 
          onClick={handleAddToCart}
          className="w-full bg-pink-500 hover:bg-pink-600 text-white transition-all shadow-sm hover:shadow"
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
