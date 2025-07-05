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
    
    // App is ready
    setIsReady(true);
    
    // Setup event listeners
    WebApp.onEvent('viewportChanged', () => {
      setIsExpanded(WebApp.isExpanded);
    });
    
    WebApp.onEvent('themeChanged', () => {
      setThemeParams(WebApp.themeParams);
    });
    
    return () => {
      WebApp.offEvent('viewportChanged', () => {});
      WebApp.offEvent('themeChanged', () => {});
    };
  }, []);

  const showMainButton = (text: string, callback: () => void) => {
    WebApp.MainButton.setText(text);
    WebApp.MainButton.show();
    WebApp.MainButton.onClick(callback);
  };

  const hideMainButton = () => {
    WebApp.MainButton.hide();
    WebApp.MainButton.offClick(() => {});
  };

  const showBackButton = (callback: () => void) => {
    WebApp.BackButton.show();
    WebApp.BackButton.onClick(callback);
  };

  const hideBackButton = () => {
    WebApp.BackButton.hide();
    WebApp.BackButton.offClick(() => {});
  };

  const showAlert = (message: string) => {
    WebApp.showAlert(message);
  };

  const showConfirm = (message: string, callback: (confirmed: boolean) => void) => {
    WebApp.showConfirm(message, callback);
  };

  const hapticFeedback = (type: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => {
    WebApp.HapticFeedback.impactOccurred(type);
  };

  const sendData = (data: string) => {
    WebApp.sendData(data);
  };

  const close = () => {
    WebApp.close();
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