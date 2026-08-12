let currentUser = null;

async function handleLogin(email) {
    try {
        // Verificar se o email está aprovado
        const { data: user, error } = await supabase
            .from('funcionarios')
            .select('*')
            .eq('email', email)
            .single();

        if (error || !user) {
            showError('Email não aprovado. Contate um gerente.');
            return;
        }

        if (user.status !== 'ativo') {
            showError('Sua conta não está ativa.');
            return;
        }

        currentUser = user;
        localStorage.setItem('burgerShotUser', JSON.stringify(user));
        
        // Mostrar aplicação principal
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('mainApp').style.display = 'flex';
        
        // Configurar permissões
        setupPermissions(user);
        initializeDashboard();
        
    } catch (err) {
        showError('Erro ao fazer login. Tente novamente.');
        console.error(err);
    }
}

function setupPermissions(user) {
    const canManageMetas = ['gerente', 'dono', 'admin'].includes(user.cargo);
    const canManageEstoque = ['membro', 'supervisor', 'gerente', 'dono', 'admin'].includes(user.cargo);
    const canManageFuncionarios = ['gerente', 'dono', 'admin'].includes(user.cargo);
    const canSeeAdmin = user.cargo === 'admin';
    
    // Mostrar/esconder seções baseado nas permissões
    document.getElementById('metaFormSection').style.display = canManageMetas ? 'block' : 'none';
    document.getElementById('adminMenu').style.display = canSeeAdmin ? 'block' : 'none';
}

function logout() {
    currentUser = null;
    localStorage.removeItem('burgerShotUser');
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('mainApp').style.display = 'none';
}

function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 3000);
}

// Event Listeners
document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    handleLogin(email);
});

// Verificar se usuário já está logado
const savedUser = localStorage.getItem('burgerShotUser');
if (savedUser) {
    currentUser = JSON.parse(savedUser);
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('mainApp').style.display = 'flex';
    setupPermissions(currentUser);
    initializeDashboard();
}