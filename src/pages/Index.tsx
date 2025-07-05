import { useState } from "react";
import { Header } from "@/components/Header";
import { ProductGrid } from "@/components/ProductGrid";
import { Cart } from "@/components/Cart";
import { useToast } from "@/hooks/use-toast";

interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isPopular?: boolean;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

const dishes: Dish[] = [{
  id: "1",
  name: "Snow",
  description: "Premium quality snow for recreational use",
  price: 180.00,
  image: "❄️",
  category: "Powder",
  isPopular: true
}, {
  id: "2",
  name: "Keta",
  description: "High-grade ketamine for therapeutic experiences",
  price: 120.00,
  image: "🐴",
  category: "Dissociative"
}, {
  id: "3",
  name: "Weed",
  description: "Premium cannabis flower, organically grown",
  price: 45.00,
  image: "🌱",
  category: "Herb",
  isPopular: true
}, {
  id: "4",
  name: "Exta",
  description: "Pure MDMA pills for enhanced experiences",
  price: 25.00,
  image: "💊",
  category: "Pills"
}];

const Index = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { toast } = useToast();
  
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleAddToCart = (dish: { id: string; name: string; price: number; image: string }) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === dish.id);
      if (existingItem) {
        return prevItems.map(item => 
          item.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevItems, { ...dish, quantity: 1 }];
      }
    });
    
    toast({
      title: "Added to Cart!",
      description: `${dish.name} has been added to your cart.`,
    });
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity === 0) {
      handleRemoveItem(id);
      return;
    }
    setCartItems(prevItems => 
      prevItems.map(item => item.id === id ? { ...item, quantity } : item)
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    toast({
      title: "Item Removed",
      description: "The item has been removed from your cart.",
    });
  };

  const handleOrder = () => {
    setCartItems([]);
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Header cartItemCount={cartItemCount} />
      
      <div className="container-custom py-12">
        <div className="lg:grid lg:grid-cols-4 lg:gap-12">
          <div className="lg:col-span-3">
            <ProductGrid products={dishes} onAddToCart={handleAddToCart} />
          </div>
          
          <div className="lg:col-span-1 mt-12 lg:mt-0">
            <Cart 
              items={cartItems} 
              onUpdateQuantity={handleUpdateQuantity} 
              onRemoveItem={handleRemoveItem} 
              onOrder={handleOrder} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;