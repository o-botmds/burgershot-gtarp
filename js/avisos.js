async function loadAvisos() {
    const avisosContent = document.getElementById('avisosContent');
    const canCreate = ['supervisor', 'gerente', 'dono', 'admin'].includes(currentUser.cargo);
    
    avisosContent.innerHTML = `
        ${canCreate ? `
        <div class="card">
            <h3>Novo Aviso</h3>
            <form id="avisoForm">
                <div class="form-group">
                    <label>Título</label>
                    <input type="text" id="avisoTitulo" placeholder="Título do aviso" required>
                </div>
                <div class="form-group">
                    <label>Mensagem</label>
                    <textarea id="avisoMensagem" placeholder="Mensagem" required></textarea>
                </div>
                <div class="form-group">
                    <label>Prioridade</label>
                    <select id="avisoPrioridade">
                        <option value="normal">Normal</option>
                        <option value="importante">Importante</option>
                        <option value="urgente">Urgente</option>
                    </select>
                </div>
                <button type="submit" class="btn btn-primary">Publicar Aviso</button>
            </form>
        </div>
        ` : ''}
        
        <div class="card">
            <h3>Avisos</h3>
            <div id="avisosLista"></div>
        </div>
    `;
    
    await loadAvisosLista();
    
    if (canCreate) {
        document.getElementById('avisoForm').addEventListener('submit', handleAvisoSubmit);
    }
}

async function loadAvisosLista() {
    const { data: avisos } = await supabase
        .from('avisos')
        .select('*')
        .order('created_at', { ascending: false });
    
    if (avisos && avisos.length > 0) {
        document.getElementById('avisosLista').innerHTML = avisos.map(aviso => `
            <div class="list-item ${aviso.prioridade === 'urgente' ? 'border-left: 4px solid #dc3545;' : ''}">
                <strong>${aviso.titulo}</strong>
                <span class="badge badge-${aviso.prioridade === 'urgente' ? 'danger' : aviso.prioridade === 'importante' ? 'warning' : 'info'}">
                    ${aviso.prioridade}
                </span>
                <p>${aviso.mensagem}</p>
                <small>Por: ${aviso.usuario}</small>
                <small>${formatDateTime(aviso.created_at)}</small>
            </div>
        `).join('');
    } else {
        document.getElementById('avisosLista').innerHTML = '<p>Nenhum aviso publicado.</p>';
    }
}

async function handleAvisoSubmit(e) {
    e.preventDefault();
    
    const titulo = document.getElementById('avisoTitulo').value;
    const mensagem = document.getElementById('avisoMensagem').value;
    const prioridade = document.getElementById('avisoPrioridade').value;
    
    const { error } = await supabase
        .from('avisos')
        .insert([{
            titulo,
            mensagem,
            prioridade,
            usuario: currentUser.nome
        }]);
    
    if (error) {
        alert('Erro ao publicar aviso');
        return;
    }
    
    alert('Aviso publicado!');
    e.target.reset();
    loadAvisosLista();
}