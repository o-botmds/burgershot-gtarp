// Configuração do Supabase
const SUPABASE_URL = 'https://xjxofnruajzoououzyeo.supabase.co';
const SUPABASE_KEY = 'sb_publishable_fac88LXDfbr3CFcyvSHlpA_7BVmCkyc';

// Criar cliente Supabase
let supabase;

// Função para inicializar Supabase
function initSupabase() {
    if (window.supabase && window.supabase.createClient) {
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        console.log('✅ Supabase inicializado com sucesso!');
        return true;
    } else {
        console.error('❌ Supabase não carregado!');
        return false;
    }
}

// Inicializar
if (initSupabase()) {
    // Testar conexão
    async function testConnection() {
        try {
            const { data, error } = await supabase
                .from('funcionarios')
                .select('*')
                .limit(5);
            
            if (error) {
                console.error('Erro na consulta:', error);
            } else {
                console.log('✅ Conexão funcionando!');
                console.log('Dados:', data);
            }
        } catch (err) {
            console.error('Erro:', err);
        }
    }
    
    testConnection();
}