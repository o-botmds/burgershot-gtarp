async function loadVendas() {
    const vendasContent = document.getElementById('vendasContent');
    
    vendasContent.innerHTML = `
        <div class="card">
            <h3>Registrar Venda</h3>
            <form id="vendaForm">
                <div class="form-group">
                    <label>Cliente</label>
                    <input type="text" id="vendaCliente" placeholder="Nome do Cliente" required>
                </div>
                <div class="form-group">
                    <label>Item</label>
                    <select id="vendaItem" required>
                        <option value="">Selecione o item</option>
                        <option value="burger">🍔 Burger Clássico</option>
                        <option value="burger_duplo">🍔 Burger Duplo</option>
                        <option value="combo">🍟 Combo Completo</option>
                        <option value="batata">🍟 Batata Frita</option>
                        <option value="refri">🥤 Refrigerante</option>
                        <option value="suco">🧃 Suco Natural</option>
                        <option value="milkshake">🥤 Milkshake</option>
                        <option value="sobremesa">🍨 Sobremesa</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Quantidade</label>
                    <input type="number" id="vendaQuantidade" placeholder="Quantidade" required>
                </div>
                <div class="form-group">
                    <label>Valor Total</label>
                    <input type="number" id="vendaValor" placeholder="R$ 0.00" step="0.01" required>
                </div>
                <button type="submit" class="btn btn-primary">Registrar Venda</button>
            </form>
        </div>
        
        <div class="card">
            <h3>Vendas Recentes</h3>
            <div id="vendasRecentes"></div>
        </div>
    `;
    
    await loadVendasRecentes();
    
    document.getElementById('vendaForm').addEventListener('submit', handleVendaSubmit);
}

async function loadVendasRecentes() {
    const { data: vendas } = await supabase
        .from('vendas')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
    
    if (vendas && vendas.length > 0) {
        document.getElementById('vendasRecentes').innerHTML = vendas.map(venda => `
            <div class="list-item">
                <strong>${venda.cliente}</strong>
                <p>${venda.item} x${venda.quantidade}</p>
                <p>Valor: ${formatCurrency(venda.valor_total)}</p>
                <small>Vendido por: ${venda.vendedor}</small>
                <small>${formatDateTime(venda.created_at)}</small>
            </div>
        `).join('');
    } else {
        document.getElementById('vendasRecentes').innerHTML = '<p>Nenhuma venda registrada.</p>';
    }
}

async function handleVendaSubmit(e) {
    e.preventDefault();
    
    const cliente = document.getElementById('vendaCliente').value;
    const item = document.getElementById('vendaItem').value;
    const quantidade = document.getElementById('vendaQuantidade').value;
    const valor = document.getElementById('vendaValor').value;
    
    const { error } = await supabase
        .from('vendas')
        .insert([{
            cliente,
            item,
            quantidade,
            valor_total: valor,
            vendedor: currentUser.nome,
            vendedor_id: currentUser.id
        }]);
    
    if (error) {
        alert('Erro ao registrar venda');
        return;
    }
    
    await supabase.from('atividades').insert([{
        usuario: currentUser.nome,
        acao: `Registrou venda para ${cliente}`
    }]);
    
    alert('Venda registrada!');
    e.target.reset();
    loadVendasRecentes();
}