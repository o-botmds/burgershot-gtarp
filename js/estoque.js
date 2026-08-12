async function loadEstoque() {
    const estoqueContent = document.getElementById('estoqueContent');
    const canManage = ['membro', 'supervisor', 'gerente', 'dono', 'admin'].includes(currentUser.cargo);
    
    estoqueContent.innerHTML = `
        ${canManage ? `
        <div class="card">
            <h3>Entrada/Saída de Itens</h3>
            <form id="estoqueForm">
                <div class="form-group">
                    <label>Tipo de Movimentação</label>
                    <select id="estoqueTipo" required>
                        <option value="entrada">📥 Entrada</option>
                        <option value="saida">📤 Saída</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Item</label>
                    <select id="estoqueItem" required>
                        <option value="">Selecione o item</option>
                        <option value="carne">🥩 Carne</option>
                        <option value="alface">🥬 Alface</option>
                        <option value="tomate">🍅 Tomate</option>
                        <option value="banana">🍌 Banana</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Quantidade</label>
                    <input type="number" id="estoqueQuantidade" placeholder="Quantidade" required>
                </div>
                <div class="form-group">
                    <label>Observação</label>
                    <textarea id="estoqueObservacao" placeholder="Observação (opcional)"></textarea>
                </div>
                <button type="submit" class="btn btn-primary">Registrar Movimentação</button>
            </form>
        </div>
        ` : ''}
        
        <div class="grid-2">
            <div class="card">
                <h3>Estoque Atual</h3>
                <div id="estoqueAtual"></div>
            </div>
            
            <div class="card">
                <h3>Histórico de Movimentações</h3>
                <div id="estoqueHistorico"></div>
            </div>
        </div>
    `;
    
    await Promise.all([
        loadEstoqueAtual(),
        loadEstoqueHistorico()
    ]);
    
    if (canManage) {
        document.getElementById('estoqueForm').addEventListener('submit', handleEstoqueSubmit);
    }
}

async function loadEstoqueAtual() {
    const { data: estoque } = await db
        .from('estoque')
        .select('*');
    
    if (estoque && estoque.length > 0) {
        document.getElementById('estoqueAtual').innerHTML = estoque.map(item => `
            <div class="list-item">
                <strong>${item.item}</strong>: ${item.quantidade} unidades
                <div class="progress" style="background: #ddd; height: 5px; border-radius: 5px; margin-top: 5px;">
                    <div style="width: ${Math.min(item.quantidade * 2, 100)}%; height: 100%; background: ${item.quantidade < 20 ? '#dc3545' : '#28a745'}; border-radius: 5px;"></div>
                </div>
            </div>
        `).join('');
    } else {
        document.getElementById('estoqueAtual').innerHTML = '<p>Nenhum item no estoque.</p>';
    }
}

async function loadEstoqueHistorico() {
    const { data: historico } = await db
        .from('movimentacoes_estoque')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
    
    if (historico && historico.length > 0) {
        document.getElementById('estoqueHistorico').innerHTML = historico.map(mov => `
            <div class="list-item">
                <strong>${mov.tipo === 'entrada' ? '📥 Entrada' : '📤 Saída'}</strong>
                <p>${mov.item}: ${mov.quantidade} unidades</p>
                ${mov.observacao ? `<p>${mov.observacao}</p>` : ''}
                <small>${formatDateTime(mov.created_at)}</small>
            </div>
        `).join('');
    } else {
        document.getElementById('estoqueHistorico').innerHTML = '<p>Nenhuma movimentação registrada.</p>';
    }
}

async function handleEstoqueSubmit(e) {
    e.preventDefault();
    
    const tipo = document.getElementById('estoqueTipo').value;
    const item = document.getElementById('estoqueItem').value;
    const quantidade = parseInt(document.getElementById('estoqueQuantidade').value);
    const observacao = document.getElementById('estoqueObservacao').value;
    
    const { data: itemAtual } = await db
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
        
        await db
            .from('estoque')
            .update({ quantidade: novaQuantidade })
            .eq('item', item);
    } else {
        await db
            .from('estoque')
            .insert([{ item, quantidade: novaQuantidade }]);
    }
    
    await db
        .from('movimentacoes_estoque')
        .insert([{
            tipo,
            item,
            quantidade,
            observacao,
            usuario: currentUser.nome
        }]);
    
    alert('Movimentação registrada!');
    e.target.reset();
    loadEstoqueAtual();
    loadEstoqueHistorico();
}