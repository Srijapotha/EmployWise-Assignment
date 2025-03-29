
import React from 'react';
import { useCart } from '@/contexts/CartContext';
import CartItem from './CartItem';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ShoppingBag } from 'lucide-react';

const CartList: React.FC = () => {
  const { items, getTotalPrice, clearCart } = useCart();
  const totalPrice = getTotalPrice();
  
  if (items.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6">
        <ShoppingBag className="h-12 w-12 text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900">Your cart is empty</h3>
        <p className="text-gray-500 text-center mt-1">Add items to your cart to see them here</p>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold">Shopping Cart</h2>
        <p className="text-gray-500">{items.length} item(s)</p>
      </div>
      
      <div className="flex-grow overflow-auto p-6">
        <div className="space-y-4">
          {items.map(item => (
            <CartItem key={item.product.id} item={item} />
          ))}
        </div>
      </div>
      
      <div className="border-t p-6">
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span>₹{totalPrice.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Shipping</span>
            <span>Free</span>
          </div>
          
          <Separator />
          
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>₹{totalPrice.toFixed(2)}</span>
          </div>
        </div>
        
        <div className="mt-6 space-y-3">
          <Button className="w-full bg-pink-500 hover:bg-pink-600 text-white">
            Checkout
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full"
            onClick={clearCart}
          >
            Clear Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartList;
