async function loadEstoque() {
    // Carregar estoque atual
    const { data: estoque, error } = await supabase
        .from('estoque')
        .select('*');
    
    if (estoque) {
        const container = document.getElementById('estoqueAtual');
        container.innerHTML = estoque.map(item => `
            <div class="list-item">
                <strong>${item.item}</strong>: ${item.quantidade} unidades
            </div>
        `).join('');
    }
    
    // Carregar histórico
    const { data: historico, error: histError } = await supabase
        .from('movimentacoes_estoque')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
    
    if (historico) {
        const container = document.getElementById('estoqueHistorico');
        container.innerHTML = historico.map(mov => `
            <div class="list-item">
                <strong>${mov.tipo === 'entrada' ? '📥 Entrada' : '📤 Saída'}</strong> - ${mov.item}: ${mov.quantidade}
                <p>${mov.observacao || ''}</p>
                <small>${new Date(mov.created_at).toLocaleString()}</small>
            </div>
        `).join('');
    }
}

document.getElementById('estoqueForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const tipo = document.getElementById('estoqueTipo').value;
    const item = document.getElementById('estoqueItem').value;
    const quantidade = parseInt(document.getElementById('estoqueQuantidade').value);
    const observacao = document.getElementById('estoqueObservacao').value;
    
    try {
        // Buscar quantidade atual
        const { data: itemAtual } = await supabase
            .from('estoque')
            .select('quantidade')
            .eq('item', item)
            .single();
        
        let novaQuantidade = quantidade;
        if (itemAtual) {
            novaQuantidade = tipo === 'entrada' 
                ? itemAtual.quantidade + quantidade 
                : itemAtual.quantidade - quantidade;
            
            if (novaQuantidade < 0) {
                alert('Quantidade insuficiente em estoque!');
                return;
            }
            
            // Atualizar estoque
            await supabase
                .from('estoque')
                .update({ quantidade: novaQuantidade })
                .eq('item', item);
        } else {
            // Criar novo item no estoque
            await supabase
                .from('estoque')
                .insert([{ item, quantidade: novaQuantidade }]);
        }
        
        // Registrar movimentação
        await supabase
            .from('movimentacoes_estoque')
            .insert([
                {
                    tipo,
                    item,
                    quantidade,
                    observacao,
                    usuario: currentUser.nome
                }
            ]);
        
        alert('Movimentação registrada!');
        e.target.reset();
        loadEstoque();
        
    } catch (err) {
        alert('Erro ao registrar movimentação');
        console.error(err);
    }
});

if (currentUser) {
    loadEstoque();
}