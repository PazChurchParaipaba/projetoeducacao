// assets/js/supabase.js

// 1. Configuração (Substitua pelas suas chaves do Painel do Supabase)
const SUPABASE_URL = 'SUA_URL_DO_SUPABASE_AQUI';
const SUPABASE_KEY = 'SUA_ANON_KEY_DO_SUPABASE_AQUI';

// 2. Inicializa o Cliente
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 3. Funções de Autenticação (Exportadas para usar no App)
export async function login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });
    return { data, error };
}

export async function register(email, password, fullName) {
    // Cria o usuário
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { full_name: fullName } // Salva o nome nos metadados
        }
    });
    return { data, error };
}

export async function logout() {
    const { error } = await supabase.auth.signOut();
    window.location.reload(); // Recarrega para limpar estados
}

export async function getUser() {
    const { data } = await supabase.auth.getSession();
    return data.session?.user || null;
}

export { supabase };