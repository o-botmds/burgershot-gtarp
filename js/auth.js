// Sistema de Autenticação Simplificado
let currentUser = null;

// Função de Login
async function handleLogin(email, password) {
    console.log('Tentando login:', email);
    
    try {
        // Buscar usuário
        const { data: user, error } = await supabase
            .from('funcionarios')
            .select('*')
            .eq('email', email.trim().toLowerCase())
            .single();

        console.log('Usuário encontrado:', user);
        console.log('Erro:', error);

        if (error || !user) {
            alert('Email não encontrado!');
            return false;
        }

        // Verificar senha
        console.log('Senha digitada:', password);
        console.log('Senha no banco:', user.senha);
        
        if (user.senha !== password) {
            alert('Senha incorreta!');
            return false;
        }

        // Login ok
        currentUser = user;
        localStorage.setItem('burgerShotUser', JSON.stringify(user));
        
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('mainApp').style.display = 'flex';
        
        if (typeof setupUserInterface === 'function') {
            setupUserInterface(user);
        }
        
        alert('Login bem-sucedido!');
        return true;
        
    } catch (err) {
        console.error('Erro no login:', err);
        alert('Erro: ' + err.message);
        return false;
    }
}

// Função de Registro
async function handleRegister(nome, email, password) {
    console.log('Tentando registrar:', nome, email);
    
    try {
        // Verificar se email existe
        const { data: existing } = await supabase
            .from('funcionarios')
            .select('id')
            .eq('email', email.trim().toLowerCase())
            .single();

        if (existing) {
            alert('Email já cadastrado!');
            return false;
        }

        // Criar usuário
        const { data, error } = await supabase
            .from('funcionarios')
            .insert([{
                nome: nome,
                email: email.trim().toLowerCase(),
                senha: password,
                cargo: 'estagiario',
                status: 'pendente'
            }])
            .select();

        console.log('Registro:', data, error);

        if (error) {
            alert('Erro ao registrar: ' + error.message);
            return false;
        }

        alert('Cadastro enviado! Aguarde aprovação.');
        return true;
        
    } catch (err) {
        console.error('Erro:', err);
        alert('Erro: ' + err.message);
        return false;
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('burgerShotUser');
    location.reload();
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    console.log('Página carregada');
    
    // Login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Form de login submetido');
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            handleLogin(email, password);
        });
    }
    
    // Registro
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Form de registro submetido');
            
            const nome = document.getElementById('registerNome').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            
            handleRegister(nome, email, password);
        });
    }
});

// Mostrar/esconder formulários
function showAuthTab(tab) {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (tab === 'login') {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
    } else {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
    }
}