// Variável para controlar o filtro atual
let currentFilter = 'TODOS'; 

function renderHome() {
    const userName = currentUser ? currentUser.user_metadata.full_name.split(' ')[0] : 'Visitante';
    
    // Filtra os cursos localmente ou chama a API novamente (faremos filtro local por performance)
    const filteredCourses = currentFilter === 'TODOS' 
        ? courses 
        : courses.filter(c => c.type === currentFilter);

    app.innerHTML = `
        <header style="padding: 20px;">
            <h1 style="font-size: 1.5rem;">Olá, ${userName}! 🎓</h1>
            <p style="color: var(--text-muted);">Qual o seu próximo passo?</p>
            
            <div style="display: flex; gap: 10px; overflow-x: auto; padding: 15px 0; margin-bottom: 10px;">
                <button onclick="filterCourses('TODOS')" class="filter-chip ${currentFilter === 'TODOS' ? 'active' : ''}">Tudo</button>
                <button onclick="filterCourses('EJA')" class="filter-chip ${currentFilter === 'EJA' ? 'active' : ''}">EJA (Supletivo)</button>
                <button onclick="filterCourses('PROFISSIONALIZANTE')" class="filter-chip ${currentFilter === 'PROFISSIONALIZANTE' ? 'active' : ''}">Cursos Rápidos</button>
                <button onclick="filterCourses('GRADUACAO')" class="filter-chip ${currentFilter === 'GRADUACAO' ? 'active' : ''}">Faculdade</button>
                <button onclick="filterCourses('POS')" class="filter-chip ${currentFilter === 'POS' ? 'active' : ''}">Pós-Graduação</button>
            </div>
        </header>

        <div style="padding: 0 20px 100px 20px;">
            ${filteredCourses.length > 0 
                ? filteredCourses.map(course => createCourseCard(course)).join('') 
                : '<p style="text-align:center; color:gray;">Nenhum curso nesta categoria.</p>'}
        </div>
    `;
}

// Função para atualizar o filtro
window.filterCourses = function(type) {
    currentFilter = type;
    renderHome();
}

// O CARD AGORA MOSTRA O PARCEIRO (Ex: UniBF, Anhanguera)
function createCourseCard(course) {
    // Define cor da badge baseada no tipo
    let badgeColor = '#3b82f6'; // Azul padrão
    if(course.type === 'EJA') badgeColor = '#10b981'; // Verde
    if(course.type === 'PROFISSIONALIZANTE') badgeColor = '#f59e0b'; // Laranja

    return `
    <div class="glass-card" onclick="openMecDetails(${course.id})">
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="background: ${badgeColor}33; color: ${badgeColor}; padding: 4px 8px; border-radius: 6px; font-size: 0.7rem; font-weight: 800;">
                ${course.type}
            </span>
            <span style="color: var(--text-muted); font-size: 0.75rem;">${course.partner_name}</span>
        </div>
        <h3 style="color:white; margin-bottom: 5px; font-size: 1.1rem;">${course.title}</h3>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:10px;">
            <span style="color: var(--accent); font-weight: 700;">R$ ${course.price}</span>
            <span style="font-size: 0.8rem; color: #94a3b8;">${course.hours}h</span>
        </div>
    </div>
    `;
}

// O MODAL "e-MEC" ATUALIZADO COM O PARCEIRO
window.openMecDetails = function(id) {
    const course = courses.find(c => c.id === id);
    if(!course) return;

    const modalHtml = `
        <div style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); z-index:999; display:flex; justify-content:center; align-items:end;" onclick="this.remove()">
            <div style="background:white; width:100%; max-width:600px; border-radius: 20px 20px 0 0; overflow:hidden; animation: slideUp 0.3s ease;" onclick="event.stopPropagation()">
                
                <div style="background: #f1f5f9; padding: 20px; border-bottom: 1px solid #e2e8f0;">
                    <p style="font-size: 0.8rem; color: #64748b; text-transform: uppercase; font-weight: bold; margin-bottom: 5px;">
                        INSTITUIÇÃO CERTIFICADORA:
                    </p>
                    <h3 style="color: #0f172a; margin: 0; font-size: 1.4rem;">🏛️ ${course.partner_name}</h3>
                </div>

                <div style="padding: 20px;">
                    <div class="mec-table">
                        <div class="mec-header">
                            <span>REGISTRO OFICIAL DO CURSO</span>
                        </div>
                        <div class="mec-row">
                            <div class="mec-cell">
                                <span class="mec-label">Curso</span>
                                <span class="mec-value">${course.title}</span>
                            </div>
                        </div>
                        <div class="mec-row">
                            <div class="mec-cell" style="border-right: 1px solid #e2e8f0;">
                                <span class="mec-label">Modalidade</span>
                                <span class="mec-value">${course.modality}</span>
                            </div>
                            <div class="mec-cell">
                                <span class="mec-label">Carga Horária</span>
                                <span class="mec-value">${course.hours} Horas</span>
                            </div>
                        </div>
                        <div class="mec-row">
                            <div class="mec-cell">
                                <span class="mec-label">Ato Legal / Portaria</span>
                                <span class="mec-value" style="color:#0369a1; font-weight:bold;">${course.ordinance}</span>
                            </div>
                        </div>
                    </div>

                    <div style="margin-top: 20px;">
                        <p style="font-size:0.9rem; line-height:1.5; color:#334155;">${course.description}</p>
                    </div>

                    <button onclick="enrollUser(${course.id})" 
                            style="width:100%; margin-top:25px; background:var(--primary); color:white; border:none; padding:18px; border-radius:12px; font-weight:bold; font-size:1.1rem; box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);">
                        MATRICULAR AGORA
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
}