import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, Minus, Trash2, ShoppingCart, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTelegram } from "@/contexts/TelegramContext";
import { Checkout } from "./Checkout";

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartProps {
  items: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onOrder: () => void;
}

export function Cart({ items, onUpdateQuantity, onRemoveItem, onOrder }: CartProps) {
  const { toast } = useToast();
  const { hapticFeedback, showAlert } = useTelegram();
  const [isCheckout, setIsCheckout] = useState(false);
  
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleProceedToCheckout = () => {
    if (items.length === 0) {
      hapticFeedback('heavy');
      showAlert("Add some items to your cart before ordering.");
      return;
    }
    
    hapticFeedback('light');
    setIsCheckout(true);
  };

  const handleBackToCart = () => {
    setIsCheckout(false);
  };

  const handleOrderComplete = () => {
    onOrder();
    setIsCheckout(false);
  };

    // Show checkout if in checkout mode
  if (isCheckout) {
    return (
      <Checkout 
        items={items}
        total={total}
        onBack={handleBackToCart}
        onOrderComplete={handleOrderComplete}
      />
    );
  }

  if (items.length === 0) {
    return (
      <div className="sticky top-8">
        <Card className="glass-card shadow-xl">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-food-text-primary font-display">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
                <ShoppingCart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl">Your Cart</span>
              <Badge variant="secondary" className="bg-food-bg-elevated text-food-text-muted border-food-border-default">
                0
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-16 space-y-4">
              <div className="w-20 h-20 bg-food-bg-elevated rounded-2xl flex items-center justify-center mx-auto">
                <ShoppingCart className="w-8 h-8 text-food-text-muted opacity-50" />
              </div>
              <div className="space-y-2">
                <p className="text-food-text-secondary font-medium text-lg">Your cart is empty</p>
                <p className="text-sm text-food-text-muted">Add some premium products to get started</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="sticky top-8">
      <Card className="glass-card shadow-2xl">
        <CardHeader className="pb-6">
          <CardTitle className="flex items-center gap-3 text-food-text-primary font-display">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow animate-bounce-gentle">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl">Your Cart</span>
            <Badge className="bg-food-primary text-white shadow-md font-semibold">
              {itemCount}
            </Badge>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-8">
          {/* Cart Items */}
          <div className="space-y-4 max-h-80 overflow-y-auto scrollbar-thin">
            {items.map((item, index) => (
              <div 
                key={item.id} 
                className="flex items-center gap-4 p-4 rounded-2xl hover:bg-food-bg-elevated/50 transition-all duration-300 group border border-transparent hover:border-food-border-default/50"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Product Emoji */}
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-secondary rounded-2xl overflow-hidden shadow-md flex items-center justify-center">
                    <span 
                      className="text-3xl"
                      role="img" 
                      aria-label={item.name}
                    >
                      {item.image}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-20 rounded-2xl transition-opacity duration-300" />
                </div>
                
                {/* Product Info */}
                <div className="flex-1 min-w-0 space-y-1">
                  <h4 className="font-semibold text-food-text-primary truncate font-display">{item.name}</h4>
                  <p className="text-sm text-food-text-muted">
                    ${item.price.toFixed(2)} × {item.quantity}
                  </p>
                </div>
                
                {/* Quantity Controls */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-food-bg-elevated rounded-xl border border-food-border-default shadow-inner">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 text-food-text-muted hover:text-food-text-primary hover:bg-food-border-default/30 rounded-l-xl"
                      onClick={() => {
                        hapticFeedback('light');
                        onUpdateQuantity(item.id, Math.max(0, item.quantity - 1));
                      }}
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </Button>
                    
                    <span className="w-10 text-center text-sm font-semibold text-food-text-primary bg-food-bg-primary">
                      {item.quantity}
                    </span>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 text-food-text-muted hover:text-food-text-primary hover:bg-food-border-default/30 rounded-r-xl"
                      onClick={() => {
                        hapticFeedback('light');
                        onUpdateQuantity(item.id, item.quantity + 1);
                      }}
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-food-danger/70 hover:text-food-danger hover:bg-food-danger/10 rounded-xl"
                    onClick={() => {
                      hapticFeedback('medium');
                      onRemoveItem(item.id);
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <Separator className="bg-food-border-default" />
          
          {/* Order Summary */}
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between text-base">
                <span className="text-food-text-muted">Subtotal</span>
                <span className="text-food-text-primary font-semibold">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xl font-bold font-display">
                <span className="text-food-text-primary">Total</span>
                <span className="text-gradient">${total.toFixed(2)}</span>
              </div>
            </div>
            
            <Button 
              onClick={handleProceedToCheckout}
              className="w-full h-14 btn-premium text-lg font-semibold gap-3 shadow-xl hover:shadow-glow-strong"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}