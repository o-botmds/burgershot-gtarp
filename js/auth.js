let currentUser = null;

// Funções de navegação do formulário
function showRegisterForm() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
    document.getElementById('errorMessage').style.display = 'none';
    document.getElementById('successMessage').style.display = 'none';
}

function hideRegisterForm() {
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('errorMessage').style.display = 'none';
    document.getElementById('successMessage').style.display = 'none';
}

// Função de Login
async function handleLogin(email) {
    try {
        const { data: user, error } = await supabase
            .from('funcionarios')
            .select('*')
            .eq('email', email)
            .single();

        if (error || !user) {
            showError('Email não encontrado. Solicite acesso ou contate um administrador.');
            return;
        }

        if (user.status === 'pendente') {
            showError('Seu cadastro está pendente de aprovação.');
            return;
        }

        if (user.status === 'rejeitado') {
            showError('Seu cadastro foi rejeitado.');
            return;
        }

        if (user.status !== 'ativo') {
            showError('Sua conta não está ativa.');
            return;
        }

        currentUser = user;
        localStorage.setItem('burgerShotUser', JSON.stringify(user));
        
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('mainApp').style.display = 'flex';
        
        setupUserInterface(user);
        
    } catch (err) {
        showError('Erro ao fazer login.');
        console.error(err);
    }
}

// Função de Registro
async function handleRegister(nome, email) {
    try {
        const { data: existingUser } = await supabase
            .from('funcionarios')
            .select('id')
            .eq('email', email)
            .single();

        if (existingUser) {
            showError('Este email já está cadastrado.');
            return;
        }

        const { error } = await supabase
            .from('funcionarios')
            .insert([
                {
                    nome: nome,
                    email: email,
                    cargo: CONFIG.defaultCargo,
                    status: 'pendente'
                }
            ]);

        if (error) throw error;

        showSuccess('Cadastro solicitado! Aguarde aprovação.');
        
        document.getElementById('registerNome').value = '';
        document.getElementById('registerEmail').value = '';
        
        setTimeout(() => {
            hideRegisterForm();
        }, 2000);

    } catch (err) {
        showError('Erro ao solicitar cadastro.');
        console.error(err);
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('burgerShotUser');
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('mainApp').style.display = 'none';
}

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
document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    handleLogin(email);
});

document.getElementById('registerForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const nome = document.getElementById('registerNome').value;
    const email = document.getElementById('registerEmail').value;
    handleRegister(nome, email);
});

// Verificar se usuário já está logado
const savedUser = localStorage.getItem('burgerShotUser');
if (savedUser) {
    currentUser = JSON.parse(savedUser);
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('mainApp').style.display = 'flex';
    setupUserInterface(currentUser);
}