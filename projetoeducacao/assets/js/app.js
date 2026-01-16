import { courses } from './mockData.js';
import { login, register, logout, getUser } from './auth-service.js';

// --- Seletores e Estado Global ---
const app = document.getElementById('app');
const navButtons = document.querySelectorAll('.nav-btn');
let currentUser = null; // Armazena o usuário logado

// --- 1. Inicialização e Verificação de Segurança ---

async function initApp() {
    // Verifica se já existe sessão ativa ao abrir o app
    currentUser = await getUser();
    updateNavUI(); // Atualiza os ícones da barra inferior
    renderHome(); // Inicia na Home
}

// --- 2. Roteamento Inteligente (Smart Routing) ---

const routes = {
    'home': renderHome,
    'search': renderSearch,
    'profile': () => {
        // ROTA PROTEGIDA: Só renderiza se tiver usuário
        if (currentUser) {
            renderProfile();
        } else {
            renderAuth(); // Se não, joga para o Login
        }
    },
    'auth': renderAuth // Rota direta para login
};

function navigate(viewName) {
    // Atualiza visual da Nav
    navButtons.forEach(btn => {
        btn.classList.remove('active');
        if(btn.dataset.target === viewName) btn.classList.add('active');
        
        // Se for clicar em "Perfil" mas não estiver logado, destaca o botão mesmo assim
        // (A lógica interna da rota 'profile' vai decidir o que mostrar)
    });

    // Transição Suave
    app.style.opacity = '0';
    setTimeout(() => {
        if (routes[viewName]) routes[viewName]();
        app.style.opacity = '1';
    }, 200);
}

// --- 3. Views (Telas) ---

function renderHome() {
    const featured = courses.slice(0, 3);
    // Se o usuário estiver logado, mostra o primeiro nome dele
    const welcomeName = currentUser ? currentUser.user_metadata.full_name.split(' ')[0] : 'Profissional';

    app.innerHTML = `
        <header style="padding: 20px 20px 10px;">
            <h1 style="font-size: 1.8rem; font-weight: 700; margin-bottom: 5px;">Olá, ${welcomeName}! 👋</h1>
            <p style="color: var(--text-muted); font-size: 0.9rem;">Vamos oficializar sua experiência hoje?</p>
        </header>

        <section style="padding: 0 20px; margin-bottom: 20px;">
            <div class="glass-card" style="background: linear-gradient(135deg, var(--primary), #1e3a8a); border: none;">
                <h3 style="margin-bottom: 10px;">Diploma em 45 dias*</h3>
                <p style="font-size: 0.85rem; opacity: 0.9; margin-bottom: 15px;">Sem TCC, sem provas. Apenas análise documental.</p>
                <button onclick="window.navigate('search')" 
                        style="background: white; color: var(--primary); border: none; padding: 10px 20px; border-radius: 20px; font-weight: 600; cursor: pointer;">
                    Ver Cursos Elegíveis
                </button>
            </div>
        </section>

        <h2 style="padding: 0 20px; font-size: 1.2rem; margin-bottom: 10px;">Em Alta Demanda 🔥</h2>
        <div style="padding-bottom: 100px;">
            ${featured.map(course => createCourseCard(course)).join('')}
        </div>
    `;
}

function renderSearch() {
    app.innerHTML = `
        <div style="padding: 20px; position: sticky; top: 0; z-index: 10;">
            <input type="text" id="searchInput" placeholder="Busque por profissão..." 
                   style="width: 100%; padding: 15px; border-radius: 15px; border: 1px solid var(--glass-border); background: var(--glass-bg); color: white; backdrop-filter: blur(10px); outline: none;">
        </div>
        <div id="resultsList" style="padding-bottom: 100px;">
            ${courses.map(course => createCourseCard(course)).join('')}
        </div>
    `;

    document.getElementById('searchInput').addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = courses.filter(c => c.title.toLowerCase().includes(term) || c.area.toLowerCase().includes(term));
        document.getElementById('resultsList').innerHTML = filtered.length ? filtered.map(createCourseCard).join('') : `<p style="text-align:center; color: var(--text-muted); padding: 20px;">Nenhum curso encontrado.</p>`;
    });
}

// --- A MÁGICA DO LOGIN/CADASTRO ---
function renderAuth() {
    app.innerHTML = `
        <div style="padding: 20px; display: flex; flex-direction: column; justify-content: center; height: 80vh;">
            <div class="glass-card" style="text-align: center; border-top: 4px solid var(--accent);">
                <h2 style="margin-bottom: 20px;" id="authTitle">Acesse sua conta</h2>
                
                <form id="authForm" style="display: flex; flex-direction: column; gap: 15px;">
                    <input type="text" id="nameInput" placeholder="Seu Nome Completo" style="display:none; padding: 12px; border-radius: 10px; border: none; background: rgba(0,0,0,0.3); color: white;">
                    
                    <input type="email" id="emailInput" placeholder="E-mail" required style="padding: 12px; border-radius: 10px; border: none; background: rgba(0,0,0,0.3); color: white;">
                    <input type="password" id="passInput" placeholder="Senha" required style="padding: 12px; border-radius: 10px; border: none; background: rgba(0,0,0,0.3); color: white;">
                    
                    <button type="submit" id="submitBtn" style="background: var(--primary); color: white; padding: 12px; border: none; border-radius: 10px; font-weight: bold; cursor: pointer;">
                        ENTRAR
                    </button>
                </form>

                <div id="msgError" style="color: #ef4444; font-size: 0.85rem; margin-top: 15px; min-height: 20px;"></div>

                <p style="margin-top: 15px; font-size: 0.9rem; color: var(--text-muted); cursor: pointer;" id="toggleAuth">
                    Não tem conta? <span style="color: var(--primary); font-weight:bold;">Crie agora</span>
                </p>
            </div>
        </div>
    `;

    // Lógica do Formulário
    let isLogin = true;
    const form = document.getElementById('authForm');
    const toggle = document.getElementById('toggleAuth');
    const nameInput = document.getElementById('nameInput');
    const title = document.getElementById('authTitle');
    const btn = document.getElementById('submitBtn');
    const msg = document.getElementById('msgError');

    // Alternar entre Login e Cadastro
    toggle.addEventListener('click', () => {
        isLogin = !isLogin;
        title.innerText = isLogin ? "Acesse sua conta" : "Criar nova conta";
        btn.innerText = isLogin ? "ENTRAR" : "CADASTRAR";
        toggle.innerHTML = isLogin ? 'Não tem conta? <span style="color: var(--primary); font-weight:bold;">Crie agora</span>' : 'Já tem conta? <span style="color: var(--primary); font-weight:bold;">Fazer login</span>';
        nameInput.style.display = isLogin ? 'none' : 'block';
        if(!isLogin) nameInput.required = true;
        msg.innerText = "";
    });

    // Submissão do Formulário
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('emailInput').value;
        const password = document.getElementById('passInput').value;
        
        btn.innerText = "Processando...";
        btn.disabled = true;
        msg.innerText = "";

        let result;
        if (isLogin) {
            result = await login(email, password);
        } else {
            const name = nameInput.value;
            result = await register(email, password, name);
        }

        if (result.error) {
            msg.innerText = "Erro: " + translateError(result.error.message);
            btn.innerText = "Tentar Novamente";
            btn.disabled = false;
        } else {
            // Sucesso
            currentUser = await getUser();
            navigate('home');
        }
    });
}

function renderProfile() {
    const userName = currentUser.user_metadata?.full_name || currentUser.email;

    app.innerHTML = `
        <div style="padding: 20px; text-align: center; margin-top: 40px;">
            <div style="width: 80px; height: 80px; background: linear-gradient(to right, var(--primary), var(--accent)); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; font-size: 2rem; color: white; font-weight: bold;">
                ${userName.charAt(0).toUpperCase()}
            </div>
            
            <h2>${userName}</h2>
            <p style="color: var(--text-muted); margin-bottom: 30px;">${currentUser.email}</p>
            
            <div class="glass-card" style="text-align: left;">
                <h3 style="margin-bottom: 10px;">Meus Diplomas</h3>
                <div style="padding: 15px; background: rgba(0,0,0,0.2); border-radius: 10px; margin-bottom: 10px; border-left: 3px solid var(--accent);">
                    <p style="font-size: 0.9rem;"><strong>Nenhum processo ativo</strong></p>
                    <p style="font-size: 0.8rem; color: var(--text-muted);">Seus cursos aparecerão aqui.</p>
                </div>
            </div>

            <button id="logoutBtn" style="margin-top: 30px; background: transparent; border: 1px solid #ef4444; color: #ef4444; padding: 10px 30px; border-radius: 20px; cursor: pointer; font-weight:600;">
                Sair da Conta
            </button>
        </div>
    `;

    document.getElementById('logoutBtn').addEventListener('click', logout);
}

// --- 4. Helpers (Funções Auxiliares) ---

function createCourseCard(course) {
    return `
    <div class="glass-card" onclick="alert('Funcionalidade futura: Abrir detalhes de ${course.title}')">
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 10px;">
            <span style="background: rgba(59, 130, 246, 0.2); color: #60a5fa; padding: 4px 10px; border-radius: 10px; font-size: 0.75rem; font-weight: 600;">${course.area}</span>
            <span style="color: var(--accent); font-weight: 700;">${course.price}</span>
        </div>
        <h3 style="font-size: 1.1rem; margin-bottom: 5px;">${course.title}</h3>
        <p style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 15px;">${course.level}</p>
        <p style="font-size: 0.85rem; line-height: 1.4;">${course.description}</p>
    </div>
    `;
}

function updateNavUI() {
    const profileBtn = document.querySelector('[data-target="profile"] .label');
    if(currentUser) {
        profileBtn.innerText = "Conta";
    } else {
        profileBtn.innerText = "Entrar";
    }
}

function translateError(msg) {
    if (msg.includes("Invalid login credentials")) return "E-mail ou senha incorretos.";
    if (msg.includes("already registered")) return "E-mail já cadastrado.";
    return msg;
}

// Hack para permitir onclick no HTML chamar função do módulo
window.navigate = navigate;

// Event Listeners Globais
window.addEventListener('load', initApp);
navButtons.forEach(btn => btn.addEventListener('click', () => navigate(btn.dataset.target)));