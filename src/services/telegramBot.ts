const BOT_TOKEN = '7963409900:AAEkKalsUPkRbFq04ofgILuJqY8fUYxXspA';
const CHAT_ID = '1823225052';

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface OrderData {
  items: CartItem[];
  total: number;
  customerInfo: {
    telegram: string;
    phone: string;
    firstName?: string;
    lastName?: string;
    userId?: number;
  };
  orderType: 'pickup' | 'delivery';
  deliveryAddress?: string;
  timestamp: string;
  orderId: string;
}

export class TelegramBotService {
  private static readonly API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

  static async sendMessage(text: string, chatId: string = CHAT_ID): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_URL}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: 'HTML',
        }),
      });

      const result = await response.json();
      return result.ok;
    } catch (error) {
      console.error('Error sending message:', error);
      return false;
    }
  }

  static async sendOrderNotification(orderData: OrderData): Promise<boolean> {
    const orderMessage = this.formatOrderMessage(orderData);
    return await this.sendMessage(orderMessage);
  }

  private static formatOrderMessage(orderData: OrderData): string {
    const { items, total, customerInfo, orderType, deliveryAddress, timestamp, orderId } = orderData;
    
    // Calculate delivery estimate
    const deliveryEstimate = this.calculateDeliveryEstimate(orderType, items.length);
    
    let message = `🍽️ <b>NEW ORDER RECEIVED!</b>\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    
    message += `📋 <b>Order ID:</b> <code>${orderId}</code>\n`;
    message += `🕐 <b>Ordered at:</b> ${timestamp}\n`;
    message += `⏱️ <b>Est. ${orderType === 'pickup' ? 'Ready' : 'Delivery'} Time:</b> ${deliveryEstimate}\n\n`;
    
    // Customer Info
    message += `👤 <b>CUSTOMER INFORMATION</b>\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    if (customerInfo.firstName || customerInfo.lastName) {
      message += `📝 <b>Name:</b> ${customerInfo.firstName || ''} ${customerInfo.lastName || ''}`.trim() + '\n';
    }
    message += `📱 <b>Telegram:</b> ${customerInfo.telegram}\n`;
    message += `☎️ <b>Phone:</b> ${customerInfo.phone}\n`;
    if (customerInfo.userId) {
      message += `🆔 <b>User ID:</b> <code>${customerInfo.userId}</code>\n`;
    }
    
    // Order Type
    message += `\n📦 <b>ORDER TYPE</b>\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `${orderType === 'pickup' ? '🏪 <b>PICKUP</b>' : '🚚 <b>DELIVERY</b>'}\n`;
    if (orderType === 'delivery' && deliveryAddress) {
      message += `📍 <b>Address:</b> ${deliveryAddress}\n`;
    }
    
    // Items
    message += `\n🛒 <b>ORDER DETAILS</b>\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    items.forEach((item, index) => {
      message += `${index + 1}. ${item.image} <b>${item.name}</b>\n`;
      message += `   💰 $${item.price.toFixed(2)} × ${item.quantity} = <b>$${(item.price * item.quantity).toFixed(2)}</b>\n\n`;
    });
    
    // Total
    message += `💳 <b>TOTAL AMOUNT: $${total.toFixed(2)}</b>\n\n`;
    
    // Action Items
    message += `⚡ <b>ACTION REQUIRED</b>\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `1. 📞 Contact customer to confirm order\n`;
    message += `2. 🍳 Start preparation\n`;
    message += `3. ${orderType === 'pickup' ? '📢 Notify when ready for pickup' : '🚚 Arrange delivery'}\n`;
    message += `4. 💬 Update customer on progress\n\n`;
    
    message += `🔔 <i>Customer will receive automatic confirmation.</i>`;
    
    return message;
  }

  static async sendOrderConfirmation(orderData: OrderData, customerChatId?: string): Promise<boolean> {
    if (!customerChatId) return false;
    
    const confirmationMessage = this.formatCustomerConfirmation(orderData);
    return await this.sendMessage(confirmationMessage, customerChatId);
  }

  private static formatCustomerConfirmation(orderData: OrderData): string {
    const { items, total, orderType, deliveryAddress, orderId } = orderData;
    
    // Calculate delivery estimate
    const deliveryEstimate = this.calculateDeliveryEstimate(orderType, items.length);
    
    let message = `✅ <b>ORDER CONFIRMED!</b>\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    
    message += `📋 <b>Order ID:</b> <code>${orderId}</code>\n`;
    message += `🕐 <b>Placed:</b> ${orderData.timestamp}\n`;
    message += `⏱️ <b>Est. ${orderType === 'pickup' ? 'Ready' : 'Delivery'} Time:</b> ${deliveryEstimate}\n\n`;
    
    // Order Type
    message += `📦 <b>ORDER TYPE</b>\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `${orderType === 'pickup' ? '🏪 <b>PICKUP</b>' : '🚚 <b>DELIVERY</b>'}\n`;
    if (orderType === 'delivery' && deliveryAddress) {
      message += `📍 <b>Delivery to:</b> ${deliveryAddress}\n`;
    }
    
    // Items Summary
    message += `\n🛒 <b>YOUR ORDER</b>\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    items.forEach((item, index) => {
      message += `${index + 1}. ${item.image} <b>${item.name}</b> × ${item.quantity}\n`;
      message += `   💰 $${item.price.toFixed(2)} × ${item.quantity} = <b>$${(item.price * item.quantity).toFixed(2)}</b>\n\n`;
    });
    
    // Total
    message += `💳 <b>TOTAL: $${total.toFixed(2)}</b>\n\n`;
    
    // Status Updates
    message += `📱 <b>WHAT HAPPENS NEXT?</b>\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `1. 🍳 We'll start preparing your order\n`;
    message += `2. 📞 You'll receive updates on progress\n`;
    message += `3. ${orderType === 'pickup' ? '📢 We\'ll notify when ready for pickup' : '🚚 Driver will contact you before delivery'}\n`;
    message += `4. 😋 Enjoy your delicious meal!\n\n`;
    
    // Footer
    message += `🔔 <i>You'll receive notifications about your order status.</i>\n`;
    message += `🙏 <b>Thank you for your order!</b>`;
    
    return message;
  }

  static generateOrderId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `ORD-${timestamp}-${random}`.toUpperCase();
  }

  private static calculateDeliveryEstimate(orderType: 'pickup' | 'delivery', itemCount: number): string {
    const now = new Date();
    
    // Base preparation time (10-15 minutes)
    let prepTime = 10 + Math.floor(Math.random() * 6);
    
    // Add time based on number of items
    prepTime += Math.floor(itemCount / 2) * 3;
    
    // Add delivery time if applicable
    if (orderType === 'delivery') {
      prepTime += 15 + Math.floor(Math.random() * 11); // 15-25 minutes for delivery
    }
    
    const estimatedTime = new Date(now.getTime() + prepTime * 60000);
    
    // Format time
    const timeString = estimatedTime.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
    
    return `${timeString} (~${prepTime} minutes)`;
  }
} 