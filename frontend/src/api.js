// Переменная для хранения токена в оперативной памяти
let accessToken = null;

export const setAccessToken = (token) => {
    accessToken = token;
};

export const apiFetch = async (endpoint, options = {}) => {
    const url = `http://localhost:3000${endpoint}`;
    
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (!(options.body instanceof FormData)) {
        headers['Content-Type'] = headers['Content-Type'] || 'application/json';
    }

    if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const response = await fetch(url, { ...options, headers });

    if (response.status === 401) {
        console.error('Ошибка авторизации. Необходимо войти заново.');
        // В будущем здесь можно добавить логику перенаправления на страницу /login
        // window.location.href = '/login';
    }

    return response;
};