// Configuração do Supabase
const SUPABASE_URL = 'https://xjxofnruajzoououzyeo.supabase.co';
const SUPABASE_KEY = 'sb_publishable_fac88LXDfbr3CFcyvSHlpA_7BVmCkyc';

// Criar cliente Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Configurações globais
const CONFIG = {
    appName: 'BurgerShot',
    version: '1.0.0',
    defaultCargo: 'estagiario',
    hierarquia: {
        'estagiario': 1,
        'membro': 2,
        'supervisor': 3,
        'gerente': 4,
        'dono': 5,
        'admin': 6
    }
};

// Funções utilitárias
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('pt-BR');
}

function formatDateTime(dateString) {
    return new Date(dateString).toLocaleString('pt-BR');
}

function getToday() {
    return new Date().toISOString().split('T')[0];
}

function getCurrentDateTime() {
    return new Date().toISOString();
}