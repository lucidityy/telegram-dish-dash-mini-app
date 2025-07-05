import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { MapPin, Truck, ArrowLeft, Check, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTelegram } from "@/contexts/TelegramContext";
import { TelegramBotService } from "@/services/telegramBot";

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CheckoutProps {
  items: CartItem[];
  total: number;
  onBack: () => void;
  onOrderComplete: () => void;
}

interface FormData {
  phone: string;
  orderType: "pickup" | "delivery";
  deliveryAddress?: string;
}

interface FormErrors {
  phone?: string;
  orderType?: string;
  deliveryAddress?: string;
}

export function Checkout({ items, total, onBack, onOrderComplete }: CheckoutProps) {
  const { toast } = useToast();
  const { 
    user, 
    showMainButton, 
    hideMainButton, 
    showBackButton, 
    hideBackButton, 
    showAlert, 
    showConfirm, 
    hapticFeedback,
    isReady 
  } = useTelegram();
  
  // Initialize form with better defaults for development
  const [formData, setFormData] = useState<FormData>({
    phone: "",
    orderType: "pickup",
    deliveryAddress: ""
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // No need to pre-fill anything since we only collect phone number
  useEffect(() => {
    if (user && isReady) {
      console.log('User connected:', { username: user.username, firstName: user.first_name });
    }
  }, [user, isReady]);

  // Set up Telegram UI
  useEffect(() => {
    if (isReady) {
      showBackButton(onBack);
    }
    
    return () => {
      hideBackButton();
      hideMainButton();
    };
  }, [isReady]);

  // Update MainButton separately to avoid conflicts
  useEffect(() => {
    if (isReady) {
      updateMainButton();
    }
  }, [isReady, isSubmitting, total]);

  const updateMainButton = () => {
    if (!isReady) return;
    
    if (isSubmitting) {
      showMainButton('Processing Order...', () => {});
    } else {
      showMainButton(`Complete Order ($${total.toFixed(2)})`, handleSubmit);
    }
  };

  // Remove this duplicate validation function - we'll use inline validation in handleSubmit

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    // Clear any existing errors first
    setErrors({});
    
    // Get phone number
    const finalPhoneNumber = formData.phone.trim();
    
    // Very simple validation - just check phone number
    if (!finalPhoneNumber || finalPhoneNumber.length < 6) {
      hapticFeedback('heavy');
      showAlert("Please enter your phone number");
      return;
    }
    
    if (formData.orderType === "delivery" && (!formData.deliveryAddress?.trim() || formData.deliveryAddress.trim().length < 5)) {
      hapticFeedback('heavy');
      showAlert("Please enter your delivery address");
      return;
    }

    setIsSubmitting(true);
    hapticFeedback('light');

    try {
      // Generate order ID
      const orderId = TelegramBotService.generateOrderId();
      
      // Prepare order data
      const orderData = {
        items,
        total,
        customerInfo: {
          telegram: user?.username ? `@${user.username}` : "N/A",
          phone: formData.phone,
          firstName: user?.first_name,
          lastName: user?.last_name,
          userId: user?.id,
        },
        orderType: formData.orderType,
        deliveryAddress: formData.deliveryAddress,
        timestamp: new Date().toLocaleString(),
        orderId,
      };

      // Send order notification to restaurant owner
      const orderNotificationSuccess = await TelegramBotService.sendOrderNotification(orderData);
      
      // Send confirmation to customer (if we have their user ID)
      if (user?.id) {
        try {
          await TelegramBotService.sendOrderConfirmation(orderData, user.id.toString());
        } catch (confirmError) {
          console.warn('Failed to send customer confirmation:', confirmError);
          // Don't fail the entire order if customer confirmation fails
        }
      }
      
      if (orderNotificationSuccess) {
        hapticFeedback('heavy');
        showAlert(`Order ${orderId} placed successfully! 🎉\n\nYou'll receive a confirmation message and updates about your order.`);
        onOrderComplete();
      } else {
        throw new Error('Failed to send order notification');
      }
    } catch (error) {
      hapticFeedback('heavy');
      showAlert("Sorry, we couldn't process your order. Please check your internet connection and try again.");
      console.error('Order submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear specific field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
    hapticFeedback('light');
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="container-custom py-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            hapticFeedback('light');
            onBack();
          }}
          className="text-food-text-secondary hover:text-food-text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Cart
        </Button>
      </div>

      {/* Main Checkout Content */}
      <div className="container-custom pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 xl:gap-12">
            
            {/* Order Summary - Mobile First, Then Desktop Sidebar */}
            <div className="xl:col-span-4 order-2 xl:order-1">
              <div className="xl:sticky xl:top-8">
                <Card className="glass-card shadow-xl">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 text-food-text-primary font-display text-lg">
                      <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      Order Summary
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Items */}
                    <div className="space-y-3 max-h-64 xl:max-h-96 overflow-y-auto scrollbar-thin">
                      {items.map((item) => (
                        <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl bg-food-bg-elevated/50 transition-colors hover:bg-food-bg-elevated/70">
                          <div className="w-10 h-10 xl:w-12 xl:h-12 bg-gradient-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-lg xl:text-xl" role="img" aria-label={item.name}>
                              {item.image}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-food-text-primary truncate text-sm xl:text-base">{item.name}</h4>
                            <p className="text-xs xl:text-sm text-food-text-muted">
                              ${item.price.toFixed(2)} × {item.quantity}
                            </p>
                          </div>
                          <Badge variant="secondary" className="bg-food-bg-elevated text-food-text-primary text-xs xl:text-sm font-semibold">
                            ${(item.price * item.quantity).toFixed(2)}
                          </Badge>
                        </div>
                      ))}
                    </div>

                    <Separator className="bg-food-border-default" />

                    {/* Total */}
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm xl:text-base text-food-text-secondary">
                        <span>Subtotal</span>
                        <span>${total.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-lg xl:text-xl font-bold font-display">
                        <span className="text-food-text-primary">Total</span>
                        <span className="text-gradient">${total.toFixed(2)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Checkout Form - Properly Sized */}
            <div className="xl:col-span-8 order-1 xl:order-2">
              <Card className="glass-card shadow-xl">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center gap-3 text-food-text-primary font-display text-xl xl:text-2xl">
                    <div className="w-10 h-10 xl:w-12 xl:h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
                      <span className="text-xl xl:text-2xl">🛒</span>
                    </div>
                    Checkout Information
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-8">
                  <form className="space-y-8">
                    {/* Contact Information */}
                    <div className="space-y-6">
                      <h3 className="text-lg xl:text-xl font-semibold text-food-text-primary font-display">
                        Contact Information
                      </h3>
                      
                      {/* Phone Number - Full Width */}
                      <div className="space-y-3">
                        <Label htmlFor="phone" className="text-food-text-secondary font-medium text-sm xl:text-base">
                          Phone Number *
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="06 12 34 56 78"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          className={`h-12 xl:h-14 bg-food-bg-elevated border-food-border-default text-food-text-primary placeholder:text-food-text-muted focus:border-food-primary focus:ring-food-primary transition-colors ${
                            errors.phone ? "border-food-danger" : ""
                          }`}
                        />
                        {errors.phone && (
                          <div className="flex items-center gap-2 text-food-danger text-sm">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            {errors.phone}
                          </div>
                        )}
                      </div>
                    </div>

                    <Separator className="bg-food-border-default" />

                    {/* Order Type */}
                    <div className="space-y-6">
                      <h3 className="text-lg xl:text-xl font-semibold text-food-text-primary font-display">
                        Order Type
                      </h3>
                      
                      <RadioGroup
                        value={formData.orderType}
                        onValueChange={(value) => handleInputChange("orderType", value)}
                        className="space-y-4"
                      >
                        {/* Pickup Option */}
                        <div className="flex items-center space-x-4 p-4 xl:p-6 rounded-xl border border-food-border-default hover:border-food-primary/50 transition-all duration-200 hover:bg-food-bg-elevated/30">
                          <RadioGroupItem value="pickup" id="pickup" className="border-food-border-default data-[state=checked]:border-food-primary" />
                          <Label htmlFor="pickup" className="flex items-center gap-4 cursor-pointer flex-1">
                            <div className="w-10 h-10 xl:w-12 xl:h-12 bg-food-bg-elevated rounded-lg flex items-center justify-center">
                              <MapPin className="w-5 h-5 xl:w-6 xl:h-6 text-food-primary" />
                            </div>
                            <div>
                              <div className="font-medium text-food-text-primary text-base xl:text-lg">Pickup on Site</div>
                              <div className="text-sm xl:text-base text-food-text-muted">Collect your order from our location</div>
                            </div>
                          </Label>
                        </div>

                        {/* Delivery Option */}
                        <div className="flex items-center space-x-4 p-4 xl:p-6 rounded-xl border border-food-border-default hover:border-food-primary/50 transition-all duration-200 hover:bg-food-bg-elevated/30">
                          <RadioGroupItem value="delivery" id="delivery" className="border-food-border-default data-[state=checked]:border-food-primary" />
                          <Label htmlFor="delivery" className="flex items-center gap-4 cursor-pointer flex-1">
                            <div className="w-10 h-10 xl:w-12 xl:h-12 bg-food-bg-elevated rounded-lg flex items-center justify-center">
                              <Truck className="w-5 h-5 xl:w-6 xl:h-6 text-food-primary" />
                            </div>
                            <div>
                              <div className="font-medium text-food-text-primary text-base xl:text-lg">Delivery</div>
                              <div className="text-sm xl:text-base text-food-text-muted">Get your order delivered to your address</div>
                            </div>
                          </Label>
                        </div>
                      </RadioGroup>

                      {/* Delivery Address */}
                      {formData.orderType === "delivery" && (
                        <div className="space-y-3 animate-fade-in">
                          <Label htmlFor="deliveryAddress" className="text-food-text-secondary font-medium text-sm xl:text-base">
                            Delivery Address *
                          </Label>
                          <Input
                            id="deliveryAddress"
                            type="text"
                            placeholder="Enter your complete delivery address"
                            value={formData.deliveryAddress}
                            onChange={(e) => handleInputChange("deliveryAddress", e.target.value)}
                            className={`h-12 xl:h-14 bg-food-bg-elevated border-food-border-default text-food-text-primary placeholder:text-food-text-muted focus:border-food-primary focus:ring-food-primary transition-colors ${
                              errors.deliveryAddress ? "border-food-danger" : ""
                            }`}
                          />
                          {errors.deliveryAddress && (
                            <div className="flex items-center gap-2 text-food-danger text-sm">
                              <AlertCircle className="w-4 h-4 flex-shrink-0" />
                              {errors.deliveryAddress}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <Separator className="bg-food-border-default" />

                    {/* Telegram MainButton will handle checkout */}
                    <div className="text-center py-6">
                      <p className="text-food-text-muted text-sm">
                        Use the button below to complete your order
                      </p>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 