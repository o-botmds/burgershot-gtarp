async function loadFuncionarios() {
    const funcionariosContent = document.getElementById('funcionariosContent');
    const canManage = ['gerente', 'dono', 'admin'].includes(currentUser.cargo);
    
    funcionariosContent.innerHTML = `
        ${canManage ? `
        <div class="card">
            <h3>Adicionar Funcionário</h3>
            <form id="funcionarioForm">
                <div class="form-group">
                    <label>Nome</label>
                    <input type="text" id="funcionarioNome" placeholder="Nome no RP" required>
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" id="funcionarioEmail" placeholder="Email" required>
                </div>
                <div class="form-group">
                    <label>Cargo</label>
                    <select id="funcionarioCargo" required>
                        <option value="">Selecione o cargo</option>
                        <option value="estagiario">Estagiário</option>
                        <option value="membro">Membro</option>
                        <option value="supervisor">Supervisor</option>
                        <option value="gerente">Gerente</option>
                        ${currentUser.cargo === 'admin' ? '<option value="dono">Dono</option><option value="admin">Administrador</option>' : ''}
                    </select>
                </div>
                <button type="submit" class="btn btn-primary">Adicionar</button>
            </form>
        </div>
        ` : ''}
        
        <div class="card">
            <h3>Funcionários</h3>
            <div id="funcionariosLista"></div>
        </div>
    `;
    
    await loadFuncionariosLista();
    
    if (canManage) {
        document.getElementById('funcionarioForm').addEventListener('submit', handleFuncionarioSubmit);
    }
}

async function loadFuncionariosLista() {
    const { data: funcionarios } = await supabase
        .from('funcionarios')
        .select('*')
        .order('created_at', { ascending: false });
    
    if (funcionarios && funcionarios.length > 0) {
        document.getElementById('funcionariosLista').innerHTML = funcionarios.map(func => `
            <div class="list-item">
                <strong>${func.nome}</strong>
                <span class="badge badge-info">${func.cargo}</span>
                <span class="badge badge-${func.status === 'ativo' ? 'success' : func.status === 'pendente' ? 'warning' : 'danger'}">
                    ${func.status}
                </span>
                <p>${func.email}</p>
            </div>
        `).join('');
    } else {
        document.getElementById('funcionariosLista').innerHTML = '<p>Nenhum funcionário cadastrado.</p>';
    }
}

async function handleFuncionarioSubmit(e) {
    e.preventDefault();
    
    const nome = document.getElementById('funcionarioNome').value;
    const email = document.getElementById('funcionarioEmail').value;
    const cargo = document.getElementById('funcionarioCargo').value;
    
    const { error } = await supabase
        .from('funcionarios')
        .insert([{
            nome,
            email,
            cargo,
            status: 'ativo'
        }]);
    
    if (error) {
        alert('Erro ao adicionar funcionário');
        return;
    }
    
    alert('Funcionário adicionado!');
    e.target.reset();
    loadFuncionariosLista();
}