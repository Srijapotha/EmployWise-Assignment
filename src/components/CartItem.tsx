
import React from 'react';
import { CartItem as CartItemType } from '@/types/types';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Plus, Minus, Trash2 } from 'lucide-react';

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeFromCart, getDiscountedPrice } = useCart();
  const { product, quantity } = item;
  const discountedPrice = getDiscountedPrice(product);
  const itemTotal = discountedPrice * quantity;

  return (
    <div className="flex items-center gap-4 py-4 border-b border-gray-100">
      <div className="h-20 w-20 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
        <img 
          src={product.thumbnail} 
          alt={product.title} 
          className="h-full w-full object-cover"
        />
      </div>
      
      <div className="flex-grow">
        <h3 className="font-medium line-clamp-1">{product.title}</h3>
        <p className="text-sm text-gray-600">{product.brand}</p>
        
        <div className="mt-1">
          <span className="font-medium">₹{discountedPrice.toFixed(2)}</span>
          <span className="ml-2 text-sm text-pink-500">{product.discountPercentage.toFixed(1)}% OFF</span>
        </div>
      </div>
      
      <div className="flex flex-col items-end gap-2">
        <div className="flex items-center gap-2 border border-gray-200 rounded-md">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-md"
            onClick={() => updateQuantity(product.id, quantity - 1)}
          >
            <Minus className="h-3 w-3" />
          </Button>
          
          <span className="w-6 text-center text-sm">{quantity}</span>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-md"
            onClick={() => updateQuantity(product.id, quantity + 1)}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">₹{itemTotal.toFixed(2)}</span>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 text-gray-400 hover:text-red-500"
            onClick={() => removeFromCart(product.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
