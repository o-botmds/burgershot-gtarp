// Sistema de Autenticação
let currentUser = null;

// Função para verificar se Supabase está pronto
function checkSupabase() {
    if (!supabase) {
        console.error('Supabase não inicializado!');
        return false;
    }
    return true;
}

// Função de Login
async function handleLogin(email, password) {
    console.log('Tentando login:', email);
    
    if (!checkSupabase()) {
        alert('Erro: Sistema não inicializado!');
        return false;
    }
    
    try {
        const { data: user, error } = await supabase
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