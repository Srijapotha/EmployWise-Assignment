
import React from 'react';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const WishlistPanel: React.FC = () => {
  const { items, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart, getDiscountedPrice } = useCart();
  
  if (items.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6">
        <Heart className="h-12 w-12 text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900">Your wishlist is empty</h3>
        <p className="text-gray-500 text-center mt-1">Save your favorite items to your wishlist</p>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold">Wishlist</h2>
        <p className="text-gray-500">{items.length} item(s)</p>
      </div>
      
      <div className="flex-grow overflow-auto p-6">
        <div className="space-y-4">
          {items.map(product => (
            <div key={product.id} className="flex gap-4 py-4 border-b border-gray-100">
              <Link to={`/product/${product.id}`} className="h-20 w-20 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                <img 
                  src={product.thumbnail} 
                  alt={product.title} 
                  className="h-full w-full object-cover"
                />
              </Link>
              
              <div className="flex-grow">
                <Link to={`/product/${product.id}`} className="font-medium hover:text-pink-500 transition-colors">
                  {product.title}
                </Link>
                <p className="text-sm text-gray-600">{product.brand}</p>
                
                <div className="mt-1">
                  <span className="font-medium">₹{getDiscountedPrice(product).toFixed(2)}</span>
                  <span className="ml-2 text-sm text-pink-500">{product.discountPercentage.toFixed(1)}% OFF</span>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-gray-400 hover:text-red-500"
                  onClick={() => removeFromWishlist(product.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs"
                  onClick={() => {
                    addToCart(product);
                    toast('Added to cart');
                  }}
                >
                  <ShoppingCart className="h-3 w-3 mr-1" />
                  Add to Cart
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="border-t p-6">
        <Button 
          variant="outline" 
          className="w-full"
          onClick={clearWishlist}
        >
          Clear Wishlist
        </Button>
      </div>
    </div>
  );
};

export default WishlistPanel;
