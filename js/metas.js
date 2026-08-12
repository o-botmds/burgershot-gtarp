async function loadMetas() {
    const metasContent = document.getElementById('metasContent');
    const canCreate = ['gerente', 'dono', 'admin'].includes(currentUser.cargo);
    
    metasContent.innerHTML = `
        ${canCreate ? `
        <div class="card">
            <h3>Definir Nova Meta</h3>
            <form id="metaForm">
                <div class="form-group">
                    <label>Tipo de Item</label>
                    <select id="metaTipo" required>
                        <option value="">Selecione o item</option>
                        <option value="carne">🥩 Carne</option>
                        <option value="alface">🥬 Alface</option>
                        <option value="tomate">🍅 Tomate</option>
                        <option value="banana">🍌 Banana</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Quantidade da Meta</label>
                    <input type="number" id="metaQuantidade" placeholder="Ex: 100" required>
                </div>
                <div class="form-group">
                    <label>Data</label>
                    <input type="date" id="metaData" required>
                </div>
                <div class="form-group">
                    <label>Print da Meta</label>
                    <input type="file" id="metaPrint" accept="image/*">
                </div>
                <button type="submit" class="btn btn-primary">Enviar Meta</button>
            </form>
        </div>
        ` : ''}
        
        <div class="card">
            <h3>Metas Registradas</h3>
            <div id="metasLista"></div>
        </div>
    `;
    
    await loadMetasLista();
    
    if (canCreate) {
        document.getElementById('metaForm').addEventListener('submit', handleMetaSubmit);
    }
}

async function loadMetasLista() {
    const { data: metas } = await db
        .from('metas')
        .select('*')
        .order('created_at', { ascending: false });
    
    if (metas && metas.length > 0) {
        document.getElementById('metasLista').innerHTML = metas.map(meta => `
            <div class="list-item">
                <strong>${meta.tipo}</strong> - ${meta.quantidade} unidades
                <p>Data: ${formatDate(meta.data)}</p>
                <p>Enviado por: ${meta.usuario_nome}</p>
                ${meta.print_url ? `<img src="${meta.print_url}" alt="Print da meta" style="max-width: 200px; margin-top: 10px;">` : ''}
            </div>
        `).join('');
    } else {
        document.getElementById('metasLista').innerHTML = '<p>Nenhuma meta registrada.</p>';
    }
}

async function handleMetaSubmit(e) {
    e.preventDefault();
    
    const tipo = document.getElementById('metaTipo').value;
    const quantidade = document.getElementById('metaQuantidade').value;
    const data = document.getElementById('metaData').value;
    const printFile = document.getElementById('metaPrint').files[0];
    
    let printUrl = null;
    
    if (printFile) {
        const fileName = `metas/${Date.now()}_${printFile.name}`;
        const { data: uploadData, error: uploadError } = await db.storage
            .from('prints')
            .upload(fileName, printFile);
        
        if (uploadError) throw uploadError;
        printUrl = `${db_URL}/storage/v1/object/public/prints/${fileName}`;
    }
    
    const { error } = await db
        .from('metas')
        .insert([{
            tipo,
            quantidade,
            data,
            print_url: printUrl,
            usuario_id: currentUser.id,
            usuario_nome: currentUser.nome
        }]);
    
    if (error) {
        alert('Erro ao enviar meta');
        return;
    }
    
    await db.from('atividades').insert([{
        usuario: currentUser.nome,
        acao: `Enviou meta: ${quantidade} ${tipo}`
    }]);
    
    alert('Meta enviada com sucesso!');
    e.target.reset();
    loadMetasLista();
}