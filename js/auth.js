// Sistema de Autenticação - BurgerShot
let currentUser = null;

// Função para obter o cliente Supabase
function getSupabase() {
    return window.supabaseClient || window.db;
}

// Função de Login
async function handleLogin(email, password) {
    console.log('🔐 Tentando login:', email);
    
    const db = getSupabase();
    
    if (!db) {
        console.error('❌ Supabase não configurado!');
        alert('Erro: Sistema não configurado!');
        return false;
    }
    
    try {
        console.log('📡 Buscando usuário...');
        
        const { data: user, error } = await db
            .from('funcionarios')
            .select('*')
            .eq('email', email.trim().toLowerCase())
            .single();

        console.log('👤 Usuário encontrado:', user);
        console.log('❌ Erro:', error);

        if (error || !user) {
            alert('Email não encontrado!');
            return false;
        }

        console.log('🔑 Verificando senha...');
        
        if (user.senha !== password) {
            alert('Senha incorreta!');
            return false;
        }

        console.log('✅ Senha correta!');
        
        if (user.status !== 'ativo') {
            alert('Conta não ativa! Status: ' + user.status);
            return false;
        }

        // Login bem-sucedido
        currentUser = user;
        localStorage.setItem('burgerShotUser', JSON.stringify(user));
        
        console.log('🎉 Login bem-sucedido!');
        
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('mainApp').style.display = 'flex';
        
        if (typeof setupUserInterface === 'function') {
            setupUserInterface(user);
        }
        
        return true;
        
    } catch (err) {
        console.error('❌ Erro no login:', err);
        alert('Erro: ' + err.message);
        return false;
    }
}

// Função de Registro
async function handleRegister(nome, email, password) {
    console.log('📝 Tentando registrar:', nome);
    
    const db = getSupabase();
    
    if (!db) {
        alert('Erro: Sistema não configurado!');
        return false;
    }
    
    try {
        // Verificar se email existe
        const { data: existing } = await db
            .from('funcionarios')
            .select('id')
            .eq('email', email.trim().toLowerCase())
            .single();

        if (existing) {
            alert('Email já cadastrado!');
            return false;
        }

        // Criar usuário
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

        alert('✅ Cadastro enviado! Aguarde aprovação.');
        return true;
        
    } catch (err) {
        console.error('❌ Erro:', err);
        alert('Erro: ' + err.message);
        return false;
    }
}

// Logout
function logout() {
    currentUser = null;
    localStorage.removeItem('burgerShotUser');
    location.reload();
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 Página carregada');
    
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('📨 Form de login submetido');
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            handleLogin(email, password);
        });
    }
    
    // Register form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('📨 Form de registro submetido');
            
            const nome = document.getElementById('registerNome').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            
            handleRegister(nome, email, password);
        });
    }
});

// Navegação entre login/registro
function showAuthTab(tab) {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const loginTab = document.getElementById('loginTab');
    const registerTab = document.getElementById('registerTab');
    
    if (loginForm && registerForm) {
        if (tab === 'login') {
            loginForm.style.display = 'block';
            registerForm.style.display = 'none';
            if (loginTab) loginTab.classList.add('active');
            if (registerTab) registerTab.classList.remove('active');
        } else {
            loginForm.style.display = 'none';
            registerForm.style.display = 'block';
            if (loginTab) loginTab.classList.remove('active');
            if (registerTab) registerTab.classList.add('active');
        }
    }
}