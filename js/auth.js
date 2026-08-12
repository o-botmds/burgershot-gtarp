// Sistema de Autenticação com Email e Senha
let currentUser = null;

// Alternar entre Login e Registro
function showAuthTab(tab) {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const loginTab = document.getElementById('loginTab');
    const registerTab = document.getElementById('registerTab');
    
    // Resetar mensagens
    document.getElementById('errorMessage').style.display = 'none';
    document.getElementById('successMessage').style.display = 'none';
    
    if (tab === 'login') {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
    } else {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        loginTab.classList.remove('active');
        registerTab.classList.add('active');
    }
}

// Função de Login
async function handleLogin(email, password) {
    try {
        // Buscar usuário pelo email
        const { data: user, error } = await supabase
            .from('funcionarios')
            .select('*')
            .eq('email', email.toLowerCase().trim())
            .single();

        if (error || !user) {
            showError('Email não encontrado. Crie uma conta ou contate um administrador.');
            return false;
        }

        // Verificar senha
        if (user.senha !== password) {
            showError('Senha incorreta. Tente novamente.');
            return false;
        }

        // Verificar status
        if (user.status === 'pendente') {
            showError('Sua conta está pendente de aprovação. Aguarde um administrador liberar.');
            return false;
        }

        if (user.status === 'rejeitado') {
            showError('Sua conta foi rejeitada. Contate um administrador.');
            return false;
        }

        if (user.status !== 'ativo') {
            showError('Sua conta está inativa.');
            return false;
        }

        // Login bem-sucedido
        currentUser = user;
        localStorage.setItem('burgerShotUser', JSON.stringify(user));
        
        // Registrar atividade de login
        await supabase.from('atividades').insert([{
            usuario: user.nome,
            acao: 'Fez login no sistema'
        }]);
        
        // Mostrar aplicação
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('mainApp').style.display = 'flex';
        
        // Configurar interface
        setupUserInterface(user);
        
        showSuccess('Bem-vindo, ' + user.nome + '!');
        return true;
        
    } catch (err) {
        showError('Erro ao fazer login. Tente novamente.');
        console.error(err);
        return false;
    }
}

// Função de Registro
async function handleRegister(nome, email, password, confirmPassword) {
    try {
        // Validar senha
        if (password !== confirmPassword) {
            showError('As senhas não coincidem!');
            return false;
        }
        
        if (password.length < 6) {
            showError('A senha deve ter pelo menos 6 caracteres!');
            return false;
        }
        
        // Verificar se email já existe
        const { data: existingUser } = await supabase
            .from('funcionarios')
            .select('id')
            .eq('email', email.toLowerCase().trim())
            .single();
        
        if (existingUser) {
            showError('Este email já está cadastrado. Tente fazer login.');
            return false;
        }
        
        // Criar nova solicitação
        const { error } = await supabase
            .from('funcionarios')
            .insert([{
                nome: nome,
                email: email.toLowerCase().trim(),
                senha: password, // Em produção, use hash!
                cargo: 'estagiario', // Cargo inicial
                status: 'pendente' // Aguardando aprovação
            }]);
        
        if (error) throw error;
        
        showSuccess('Cadastro solicitado com sucesso! Aguarde aprovação de um administrador.');
        
        // Limpar formulário
        document.getElementById('registerNome').value = '';
        document.getElementById('registerEmail').value = '';
        document.getElementById('registerPassword').value = '';
        document.getElementById('registerConfirmPassword').value = '';
        
        // Voltar para login após 2 segundos
        setTimeout(() => {
            showAuthTab('login');
        }, 2000);
        
        return true;
        
    } catch (err) {
        showError('Erro ao criar conta. Tente novamente.');
        console.error(err);
        return false;
    }
}

// Função de Logout
function logout() {
    currentUser = null;
    localStorage.removeItem('burgerShotUser');
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('mainApp').style.display = 'none';
    
    // Limpar campos de login
    document.getElementById('loginEmail').value = '';
    document.getElementById('loginPassword').value = '';
}

// Funções de mensagem
function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    const successDiv = document.getElementById('successMessage');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    successDiv.style.display = 'none';
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 5000);
}

function showSuccess(message) {
    const errorDiv = document.getElementById('errorMessage');
    const successDiv = document.getElementById('successMessage');
    successDiv.textContent = message;
    successDiv.style.display = 'block';
    errorDiv.style.display = 'none';
    setTimeout(() => {
        successDiv.style.display = 'none';
    }, 5000);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Login form
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        await handleLogin(email, password);
    });
    
    // Register form
    document.getElementById('registerForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const nome = document.getElementById('registerNome').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('registerConfirmPassword').value;
        await handleRegister(nome, email, password, confirmPassword);
    });
    
    // Verificar se usuário já está logado
    const savedUser = localStorage.getItem('burgerShotUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('mainApp').style.display = 'flex';
        setupUserInterface(currentUser);
    }
});