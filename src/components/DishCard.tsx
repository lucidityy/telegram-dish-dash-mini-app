import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Star } from "lucide-react";
import { useTelegram } from "@/contexts/TelegramContext";

interface DishCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category?: string;
  isPopular?: boolean;
  onAddToCart: (dish: { id: string; name: string; price: number; image: string }) => void;
}

export function DishCard({ 
  id, 
  name, 
  description, 
  price, 
  image, 
  category, 
  isPopular, 
  onAddToCart 
}: DishCardProps) {
  const { hapticFeedback } = useTelegram();
  
  const handleAddToCart = () => {
    hapticFeedback('medium');
    onAddToCart({ id, name, price, image });
  };

  return (
    <Card className="group glass-card card-interactive hover:border-food-border-accent overflow-hidden">
      {/* Product Emoji */}
      <div className="relative">
        <div className="aspect-[4/3] bg-gradient-secondary overflow-hidden flex items-center justify-center">
          <span 
            className="text-8xl lg:text-9xl transition-transform duration-500 group-hover:scale-110"
            role="img" 
            aria-label={name}
          >
            {image}
          </span>
          {/* Subtle overlay */}
          <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
        </div>
        
        {/* Floating Badges */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
          {isPopular && (
            <Badge className="bg-food-primary/90 hover:bg-food-primary text-white backdrop-blur-md shadow-glow border-0 font-medium flex items-center gap-1.5">
              <Star className="w-3 h-3 fill-current" />
              Popular
            </Badge>
          )}
          {category && (
            <Badge 
              variant="secondary" 
              className="bg-food-bg-elevated/90 text-food-text-secondary border-food-border-default/50 backdrop-blur-md font-medium ml-auto"
            >
              {category}
            </Badge>
          )}
        </div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      {/* Card Content */}
      <div className="p-6 lg:p-8 space-y-6">
        <div className="space-y-3">
          <CardTitle className="text-xl lg:text-2xl font-display font-semibold text-food-text-primary group-hover:text-gradient transition-colors duration-300 leading-tight">
            {name}
          </CardTitle>
          <CardDescription className="text-food-text-secondary leading-relaxed text-base line-clamp-2">
            {description}
          </CardDescription>
        </div>
        
        {/* Price and Action */}
        <div className="flex items-center justify-between pt-2">
          <div className="space-y-1">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl lg:text-4xl font-bold text-gradient font-display">
                ${price.toFixed(2)}
              </span>
            </div>
          </div>
          
          <Button 
            variant="add" 
            size="lg"
            onClick={handleAddToCart}
            className="btn-premium gap-2 px-6 py-3 h-12 font-semibold text-base shadow-lg hover:shadow-glow-strong"
          >
            <Plus className="w-4 h-4" />
            Add to Cart
          </Button>
        </div>
      </div>
    </Card>
  );
}