// Configuração do db
const db_CONFIG = {
    url: 'https://xjxofnruajzoououzyeo.db.co',
    key: 'sb_publishable_fac88LXDfbr3CFcyvSHlpA_7BVmCkyc'
};

// Criar cliente db (sem declarar novamente)
window.dbClient = window.db.createClient(
    db_CONFIG.url,
    db_CONFIG.key
);

// Atalho para usar nos outros arquivos
const db = window.dbClient;

// Testar conexão
async function testConnection() {
    try {
        const { data, error } = await db
            .from('funcionarios')
            .select('*')
            .limit(5);
        
        if (error) {
            console.error('Erro na conexão:', error);
        } else {
            console.log('✅ Conexão OK!');
            console.log('Dados:', data);
        }
    } catch (err) {
        console.error('Erro:', err);
    }
}

// Testar ao carregar
testConnection();