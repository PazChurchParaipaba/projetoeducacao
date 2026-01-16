// assets/js/auth-service.js

// Agora chamamos nossos próprios endpoints em vez do SDK do Supabase
// Se estiver rodando local, use http://localhost:3000/api
// Na produção, será apenas /api

const API_URL = '/api'; 

export async function login(email, password) {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        
        if (!response.ok) throw new Error(data.error);

        // Salva o usuário no navegador (Sessão manual)
        // ATENÇÃO: Em produção real, usaríamos Cookies HttpOnly
        localStorage.setItem('user_session', JSON.stringify(data.user));
        
        return { data: data.user, error: null };
    } catch (err) {
        return { data: null, error: err };
    }
}

export async function register(email, password, fullName) {
    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, fullName })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error);

        localStorage.setItem('user_session', JSON.stringify(data.user));
        return { data: data.user, error: null };
    } catch (err) {
        return { data: null, error: err };
    }
}

export async function logout() {
    localStorage.removeItem('user_session');
    window.location.reload();
}

export async function getUser() {
    // Recupera a sessão salva
    const session = localStorage.getItem('user_session');
    return session ? JSON.parse(session) : null;
}