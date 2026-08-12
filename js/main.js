// Configuração da interface baseada no cargo do usuário
function setupUserInterface(user) {
    // Atualizar badge do usuário
    document.getElementById('userBadge').textContent = `${user.nome} - ${user.cargo.toUpperCase()}`;
    
    // Mostrar menu admin apenas para admin
    if (user.cargo === 'admin') {
        document.getElementById('adminMenu').style.display = 'block';
    } else {
        document.getElementById('adminMenu').style.display = 'none';
    }
    
    // Carregar dashboard apropriado
    if (user.cargo === 'admin') {
        loadAdminDashboard();
    } else if (user.cargo === 'gerente' || user.cargo === 'dono') {
        loadGerenteDashboard();
    } else {
        loadFuncionarioDashboard();
    }
    
    // Carregar todas as seções
    loadMetas();
    loadEstoque();
    loadVendas();
    loadAvisos();
    loadFuncionarios();
    loadExpediente();
    
    if (user.cargo === 'admin') {
        loadAdminPanel();
    }
}

// Navegação entre seções
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const sectionName = btn.dataset.section;
        
        // Atualizar botões
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Atualizar seções
        document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
        document.getElementById(sectionName).classList.add('active');
    });
});

// Funções de utilidade para modais
function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}