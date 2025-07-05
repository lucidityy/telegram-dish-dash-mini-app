import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import WebApp from '@twa-dev/sdk';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  photo_url?: string;
}

interface TelegramContextType {
  webApp: typeof WebApp;
  user: TelegramUser | null;
  isExpanded: boolean;
  themeParams: any;
  isReady: boolean;
  showMainButton: (text: string, callback: () => void) => void;
  hideMainButton: () => void;
  showBackButton: (callback: () => void) => void;
  hideBackButton: () => void;
  showAlert: (message: string) => void;
  showConfirm: (message: string, callback: (confirmed: boolean) => void) => void;
  hapticFeedback: (type: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
  sendData: (data: string) => void;
  close: () => void;
}

const TelegramContext = createContext<TelegramContextType | null>(null);

export const useTelegram = () => {
  const context = useContext(TelegramContext);
  if (!context) {
    throw new Error('useTelegram must be used within a TelegramProvider');
  }
  return context;
};

interface TelegramProviderProps {
  children: ReactNode;
}

export const TelegramProvider: React.FC<TelegramProviderProps> = ({ children }) => {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [themeParams, setThemeParams] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      // Check if we're in Telegram WebApp environment
      if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
        // Initialize Telegram WebApp
        WebApp.ready();
        
        // Set up the WebApp
        WebApp.expand();
        WebApp.enableClosingConfirmation();
        
        // Get user data
        if (WebApp.initDataUnsafe.user) {
          setUser(WebApp.initDataUnsafe.user as TelegramUser);
        }
        
        // Set theme
        setThemeParams(WebApp.themeParams);
        
        // Set expanded state
        setIsExpanded(WebApp.isExpanded);
        
        // Setup event listeners
        WebApp.onEvent('viewportChanged', () => {
          setIsExpanded(WebApp.isExpanded);
        });
        
        WebApp.onEvent('themeChanged', () => {
          setThemeParams(WebApp.themeParams);
        });
      } else {
        // Development mode - not in Telegram
        console.log('Running outside Telegram WebApp environment');
        setThemeParams({});
        setIsExpanded(true);
      }
      
      // App is ready
      setIsReady(true);
    } catch (error) {
      console.error('Error initializing Telegram WebApp:', error);
      setIsReady(true); // Still mark as ready for development
    }
    
    return () => {
      if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
        WebApp.offEvent('viewportChanged', () => {});
        WebApp.offEvent('themeChanged', () => {});
      }
    };
  }, []);

  const isTelegramWebApp = typeof window !== 'undefined' && window.Telegram?.WebApp;

  const showMainButton = (text: string, callback: () => void) => {
    if (isTelegramWebApp) {
      WebApp.MainButton.setText(text);
      WebApp.MainButton.show();
      WebApp.MainButton.onClick(callback);
    } else {
      // Development mode - could show a regular button or log
      console.log(`MainButton: ${text}`);
    }
  };

  const hideMainButton = () => {
    if (isTelegramWebApp) {
      WebApp.MainButton.hide();
      WebApp.MainButton.offClick(() => {});
    }
  };

  const showBackButton = (callback: () => void) => {
    if (isTelegramWebApp) {
      WebApp.BackButton.show();
      WebApp.BackButton.onClick(callback);
    } else {
      console.log('BackButton shown');
    }
  };

  const hideBackButton = () => {
    if (isTelegramWebApp) {
      WebApp.BackButton.hide();
      WebApp.BackButton.offClick(() => {});
    }
  };

  const showAlert = (message: string) => {
    if (isTelegramWebApp) {
      WebApp.showAlert(message);
    } else {
      // Fallback to browser alert in development
      alert(message);
    }
  };

  const showConfirm = (message: string, callback: (confirmed: boolean) => void) => {
    if (isTelegramWebApp) {
      WebApp.showConfirm(message, callback);
    } else {
      // Fallback to browser confirm in development
      const result = confirm(message);
      callback(result);
    }
  };

  const hapticFeedback = (type: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => {
    if (isTelegramWebApp) {
      WebApp.HapticFeedback.impactOccurred(type);
    } else {
      // No haptic feedback in development, just log
      console.log(`Haptic feedback: ${type}`);
    }
  };

  const sendData = (data: string) => {
    if (isTelegramWebApp) {
      WebApp.sendData(data);
    } else {
      console.log('Send data:', data);
    }
  };

  const close = () => {
    if (isTelegramWebApp) {
      WebApp.close();
    } else {
      console.log('Close app');
    }
  };

  const contextValue: TelegramContextType = {
    webApp: WebApp,
    user,
    isExpanded,
    themeParams,
    isReady,
    showMainButton,
    hideMainButton,
    showBackButton,
    hideBackButton,
    showAlert,
    showConfirm,
    hapticFeedback,
    sendData,
    close,
  };

  return (
    <TelegramContext.Provider value={contextValue}>
      {children}
    </TelegramContext.Provider>
  );
}; 