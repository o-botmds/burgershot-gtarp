async function initializeDashboard() {
    await Promise.all([
        loadVendasHoje(),
        loadMetaDia(),
        loadEstoqueResumo(),
        loadFuncionariosAtivos(),
        loadRecentActivity()
    ]);
}

async function loadVendasHoje() {
    const today = new Date().toISOString().split('T')[0];
    const { data: vendas, error } = await supabase
        .from('vendas')
        .select('valor_total')
        .gte('created_at', today);
    
    if (vendas) {
        const total = vendas.reduce((sum, venda) => sum + parseFloat(venda.valor_total), 0);
        document.getElementById('vendasHoje').textContent = `R$ ${total.toFixed(2)}`;
    }
}

async function loadMetaDia() {
    const today = new Date().toISOString().split('T')[0];
    const { data: meta, error } = await supabase
        .from('metas')
        .select('*')
        .eq('data', today)
        .single();
    
    if (meta) {
        document.getElementById('metaDia').textContent = `${meta.quantidade} ${meta.tipo}`;
    } else {
        document.getElementById('metaDia').textContent = 'Nenhuma meta definida';
    }
}

async function loadEstoqueResumo() {
    const { data: items, error } = await supabase
        .from('estoque')
        .select('quantidade');
    
    if (items) {
        const total = items.reduce((sum, item) => sum + item.quantidade, 0);
        document.getElementById('itensEstoque').textContent = total;
    }
}

async function loadFuncionariosAtivos() {
    const { data: funcionarios, error } = await supabase
        .from('funcionarios')
        .select('id')
        .eq('status', 'ativo');
    
    if (funcionarios) {
        document.getElementById('funcionariosAtivos').textContent = funcionarios.length;
    }
}

async function loadRecentActivity() {
    const { data: recentes, error } = await supabase
        .from('atividades')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
    
    if (recentes) {
        const container = document.getElementById('recentActivity');
        container.innerHTML = recentes.map(activity => `
            <div class="list-item">
                <strong>${activity.usuario}</strong> - ${activity.acao}
                <small>${new Date(activity.created_at).toLocaleString()}</small>
            </div>
        `).join('');
    }
}