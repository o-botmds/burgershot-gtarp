// Configuração do Supabase - BurgerShot
(function() {
    // SUAS CREDENCIAIS AQUI
    const SUPABASE_URL = 'https://xjxofnruajzoououzyeo.db.co';
    const SUPABASE_KEY = 'sb_publishable_fac88LXDfbr3CFcyvSHlpA_7BVmCkyc';
    
    // Criar cliente Supabase
    const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    
    // Tornar disponível globalmente
    window.supabaseClient = supabaseClient;
    window.db = supabaseClient;
    
    console.log('✅ Supabase configurado com sucesso!');
    
    // Testar conexão
    async function testConnection() {
        try {
            const { data, error } = await supabaseClient
                .from('funcionarios')
                .select('*')
                .limit(5);
            
            if (error) {
                console.error('❌ Erro na conexão:', error.message);
            } else {
                console.log('✅ Conexão funcionando!');
                console.log('Dados:', data);
            }
        } catch (err) {
            console.error('❌ Erro:', err.message);
        }
    }
    
    // Testar após carregar
    setTimeout(testConnection, 1000);
})();