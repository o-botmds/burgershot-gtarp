// Sistema de Autenticação
let currentUser = null;

// Função de Login
async function handleLogin(email, password) {
    console.log('Tentando login:', email);
    
    try {
        // Usar db em vez de supabase
        const { data: user, error } = await db
            .from('funcionarios')
            .select('*')
            .eq('email', email.trim().toLowerCase())
            .single();

        if (error || !user) {
            alert('Email não encontrado!');
            return false;
        }

        if (user.senha !== password) {
            alert('Senha incorreta!');
            return false;
        }

        if (user.status === 'pendente') {
            alert('Conta pendente de aprovação!');
            return false;
        }

        if (user.status !== 'ativo') {
            alert('Conta inativa!');
            return false;
        }

        currentUser = user;
        localStorage.setItem('burgerShotUser', JSON.stringify(user));
        
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('mainApp').style.display = 'flex';
        
        if (typeof setupUserInterface === 'function') {
            setupUserInterface(user);
        }
        
        console.log('✅ Login bem-sucedido!');
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
        const { data: existing } = await db
            .from('funcionarios')
            .select('id')
            .eq('email', email.trim().toLowerCase())
            .single();

        if (existing) {
            alert('Email já cadastrado!');
            return false;
        }

        const { error } = await db
            .from('funcionarios')
            .insert([{
                nome: nome,
                email: email.trim().toLowerCase(),
                senha: password,
                cargo: 'estagiario',
                status: 'pendente'
            }]);

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
    
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            handleLogin(email, password);
        });
    }
    
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const nome = document.getElementById('registerNome').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            handleRegister(nome, email, password);
        });
    }
});

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