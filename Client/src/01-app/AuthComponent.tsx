import React, { useEffect, useState } from 'react'
import { handleError } from '../07-shared/handleError'
//import { BrowserApp } from '../../BrowserApp'
import { HomePageBrowser } from '../03-pages/HomePageBrowser'
import { AdminApp } from './AdminApp'
import axios from 'axios'

export const AuthComponent:React.FC = () => {

    const host = import.meta.env.VITE_BACKEND_HOST
    const port = import.meta.env.VITE_BACKEND_PORT

    console.log(host);
    

    const FlagmanAlexId = import.meta.env.VITE_ID_TELEGRAM_FLAGMANALEX
    const OlgaVitamins = import.meta.env.VITE_ID_TELEGRAM_OLGA_VITAMINS

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [environment, setEnvironment] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true); // Новый state для отслеживания загрузки

    useEffect(() => {

        // Определяем, зашел ли пользователь через Telegram WebApp
        const tgUser:TelegramWebAppUser | undefined = window.Telegram?.WebApp?.initDataUnsafe?.user;
        const detectedEnvironment = tgUser ? 'telegram' : 'web';
        setEnvironment(detectedEnvironment);

        // Извлекаем данные из localStorage
        const hash = localStorage.getItem('hash');
        const user_id = localStorage.getItem('user_id');

        if (detectedEnvironment === 'telegram' && tgUser) {
            verifyUserDatabase(tgUser.id);
        } else if (user_id && hash) {
            verifyHashDatabase(hash);
        } else {
            clearStorageAndReautorize();
        }

        // Подписываемся на событие фокуса окна для периодической проверки при возврате в браузер
        window.addEventListener('focus', handleFocus);

        return () => {
            window.removeEventListener('focus', handleFocus);
        };

    }, [environment]);

    const handleFocus = () => {
        const userHash = localStorage.getItem('hash');
        if (userHash && !isAuthenticated) {
            pollForUserAuth(userHash);
        }
    };

    // Проверка пользователя в базе по Telegram user_id
    async function verifyUserDatabase(user_id: number) {
        try {
            const response = await axios.get(`${host}:${port}/api/user/${user_id}`);
            if (response.data.user_id === user_id) {
                localStorage.setItem('user_id', user_id.toString());
                setIsAuthenticated(true);
            } else {
                clearStorageAndReautorize();
            }
        } catch (error) {
            console.log("Ошибка авторизации", handleError(error));
            clearStorageAndReautorize();
        } finally {
            setIsLoading(false); // Останавливаем загрузку
        }
    }

    // Проверка по хэшу (используется в web-авторизации)
    async function verifyHashDatabase(hash: string) {
        try {
            const response = await axios.get(`${host}:${port}/api/auth/check`, {
                params: { hash }
            });

            if (response.data.exist) {
                localStorage.setItem('user_id', response.data.user_id);
                setIsAuthenticated(true);
            } else {
                clearStorageAndReautorize();
            }
        } catch (error) {
            console.log("Ошибка авторизации", handleError(error));
            clearStorageAndReautorize();
        } finally {
            setIsLoading(false); // Останавливаем загрузку
        }
    }

    // Очистка хэша и переавторизация
    const clearStorageAndReautorize = () => {
        localStorage.removeItem('user_id');
        localStorage.removeItem('hash');
        initiateAuthorization();
    };

    // Начало авторизации
    const initiateAuthorization = () => {
        if (environment === 'telegram') {
            authorizeTelegram();
        } else {
            authorizeWeb();
        }
    };

    // Авторизация через Telegram WebApp
    const authorizeTelegram = async () => {
        
        const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
        if (!tgUser) return;

        try {
            const userDb = await axios.get(`${host}:${port}/api/user/${tgUser.id}`);

            if (userDb.data.user_id === tgUser.id) {
                localStorage.setItem('user_id', tgUser.id.toString());
                setIsAuthenticated(true);
            } else {
                const response = await axios.post(`${host}:${port}/api/user/create`, {
                    user_id: tgUser.id,
                    chat_id: tgUser.chat_id,
                    first_name: tgUser.first_name,
                    username: tgUser.username,
                });

                if (response) {
                    localStorage.setItem('user_id', tgUser.id.toString());
                    setIsAuthenticated(true);
                }
            }
        } catch (error: any) {
            console.log('Ошибка при отправке данных', handleError(error));
        } finally {
            setIsLoading(false); // Останавливаем загрузку
        }
    };

    // Авторизация через Web
    const authorizeWeb = async () => {
        const hash = generateRandomHash();
        localStorage.setItem('hash', hash);

        const botUsername = 'VitaminsOrderBot';
        const telegramLink = `https://t.me/${botUsername}?start=${hash}`;

        // Ставим задержку перед проверкой хэша для предотвращения цикличности
        setTimeout(() => {
            pollForUserAuth(hash);
        }, 3000); // Задержка 3 секунды перед проверкой

        // Открытие ссылки в новом окне
        window.open(telegramLink, "_blank");
    };

    // Периодическая проверка наличия пользователя в базе
    const pollForUserAuth = async (hash: string) => {
        try {
            const response = await axios.get(`${host}:${port}/api/auth/check`, {
                params: { hash }
            });

            if (response.data.user_id) {
                localStorage.setItem('user_id', response.data.user_id);
                setIsAuthenticated(true);
            }
        } catch (error) {
            console.error("Ошибка при проверке базы:", handleError(error));
        } finally {
            setIsLoading(false); // Останавливаем загрузку
        }
    };

    // Генерация случайного хэша
    const generateRandomHash = () => Math.random().toString(36).substring(2, 15);

    // Отображение контента приложения на основе авторизации
    if (isLoading) {
        return <p>Загрузка...</p>; // Показать загрузочный экран, пока проверка в процессе
    }

    if (isAuthenticated) {
        const user_id = localStorage.getItem('user_id');
        return (
            user_id === FlagmanAlexId || user_id === OlgaVitamins ? (
                <AdminApp />
            ) : (
                <HomePageBrowser />
            )
        );
    }

    return (
        <>
            <h1>Авторизация через Телеграм</h1>
            {environment === 'telegram' ? (
                <p>Пожалуйста, ожидайте проверки авторизации через Телеграм...</p>
            ) : (
                <>
                    <p>Пожалуйста, авторизуйтесь через Телеграм!</p>
                    <button onClick={authorizeWeb}>Войти через Телеграм</button>
                </>
            )}
        </>
    );
};

