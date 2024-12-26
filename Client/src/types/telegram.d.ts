interface TelegramWebAppUser {
    id: number
    chat_id: string
    first_name: string
    last_name?: string
    username?: string
    language_code?: string
  }
  
  interface TelegramWebApp {
    initDataUnsafe: {
      user?: TelegramWebAppUser;
    };
    ready: () => void;
  }
  
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }