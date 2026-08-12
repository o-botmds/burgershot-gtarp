async function loadVendas() {
    const { data: vendas, error } = await supabase
        .from('vendas')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
    
    if (vendas) {
        const container = document.getElementById('vendasRecentes');
        container.innerHTML = vendas.map(venda => `
            <div class="list-item">
                <strong>${venda.cliente}</strong> - ${venda.item} x${venda.quantidade}
                <p>Valor: R$ ${venda.valor_total}</p>
                <small>Vendido por: ${venda.vendedor} em ${new Date(venda.created_at).toLocaleString()}</small>
            </div>
        `).join('');
    }
}

document.getElementById('vendaForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const cliente = document.getElementById('vendaCliente').value;
    const item = document.getElementById('vendaItem').value;
    const quantidade = document.getElementById('vendaQuantidade').value;
    const valor = document.getElementById('vendaValor').value;
    
    try {
        const { error } = await supabase
            .from('vendas')
            .insert([
                {
                    cliente,
                    item,
                    quantidade,
                    valor_total: valor,
                    vendedor: currentUser.nome,
                    vendedor_id: currentUser.id
                }
            ]);
        
        if (error) throw error;
        
        alert('Venda registrada!');
        e.target.reset();
        loadVendas();
        
    } catch (err) {
        alert('Erro ao registrar venda');
        console.error(err);
    }
});

if (currentUser) {
    loadVendas();
}