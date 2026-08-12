async function loadAdminPanel() {
    const adminContent = document.getElementById('adminContent');
    
    adminContent.innerHTML = `
        <div class="card">
            <h3>Solicitações de Acesso Pendentes</h3>
            <div id="solicitacoesPendentes"></div>
        </div>
        
        <div class="card">
            <h3>Gerenciar Usuários</h3>
            <div id="adminUsersList"></div>
        </div>
        
        <div class="card">
            <h3>Gerenciar Itens</h3>
            <form id="itemForm">
                <div class="form-group">
                    <label>Nome do Item</label>
                    <input type="text" id="itemNome" placeholder="Nome do Item" required>
                </div>
                <div class="form-group">
                    <label>Emoji</label>
                    <input type="text" id="itemEmoji" placeholder="Ex: 🍕">
                </div>
                <button type="submit" class="btn btn-primary">Adicionar Item</button>
            </form>
            <div id="adminItemsList"></div>
        </div>
        
        <div class="card">
            <h3>Estatísticas do Sistema</h3>
            <div id="adminStats"></div>
        </div>
    `;
    
    await Promise.all([
        loadSolicitacoesPendentes(),
        loadAdminUsers(),
        loadAdminItems(),
        loadAdminStats()
    ]);
    
    document.getElementById('itemForm').addEventListener('submit', handleItemSubmit);
}

async function loadSolicitacoesPendentes() {
    const { data: pendentes } = await db
        .from('funcionarios')
        .select('*')
        .eq('status', 'pendente')
        .order('created_at', { ascending: false });
    
    if (pendentes && pendentes.length > 0) {
        document.getElementById('solicitacoesPendentes').innerHTML = pendentes.map(user => `
            <div class="list-item">
                <strong>${user.nome}</strong>
                <p>${user.email}</p>
                <small>Solicitado em: ${formatDateTime(user.created_at)}</small>
                <div style="margin-top: 10px;">
                    <select id="cargo_${user.id}" class="form-group">
                        <option value="estagiario">Estagiário</option>
                        <option value="membro">Membro</option>
                        <option value="supervisor">Supervisor</option>
                        <option value="gerente">Gerente</option>
                        <option value="dono">Dono</option>
                        <option value="admin">Admin</option>
                    </select>
                    <button onclick="aprovarUsuario('${user.id}')" class="btn btn-success btn-sm">✅ Aprovar</button>
                    <button onclick="rejeitarUsuario('${user.id}')" class="btn btn-danger btn-sm">❌ Rejeitar</button>
                </div>
            </div>
        `).join('');
    } else {
        document.getElementById('solicitacoesPendentes').innerHTML = '<p>Nenhuma solicitação pendente.</p>';
    }
}

async function loadAdminUsers() {
    const { data: users } = await db
        .from('funcionarios')
        .select('*')
        .order('created_at', { ascending: false });
    
    if (users && users.length > 0) {
        document.getElementById('adminUsersList').innerHTML = `
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Email</th>
                            <th>Cargo</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${users.map(user => `
                            <tr>
                                <td>${user.nome}</td>
                                <td>${user.email}</td>
                                <td>${user.cargo}</td>
                                <td>
                                    <span class="badge badge-${user.status === 'ativo' ? 'success' : user.status === 'pendente' ? 'warning' : 'danger'}">
                                        ${user.status}
                                    </span>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }
}

async function loadAdminItems() {
    const { data: items } = await db
        .from('estoque')
        .select('*');
    
    if (items && items.length > 0) {
        document.getElementById('adminItemsList').innerHTML = items.map(item => `
            <div class="list-item">
                <strong>${item.item}</strong>: ${item.quantidade}
            </div>
        `).join('');
    }
}

async function loadAdminStats() {
    const [funcionarios, vendas, estoque, metas] = await Promise.all([
        db.from('funcionarios').select('id'),
        db.from('vendas').select('id'),
        db.from('estoque').select('id'),
        db.from('metas').select('id')
    ]);
    
    document.getElementById('adminStats').innerHTML = `
        <div class="stats-grid">
            <div class="stat-card">
                <h3>Funcionários</h3>
                <p>${funcionarios.data?.length || 0}</p>
            </div>
            <div class="stat-card">
                <h3>Vendas</h3>
                <p>${vendas.data?.length || 0}</p>
            </div>
            <div class="stat-card">
                <h3>Itens</h3>
                <p>${estoque.data?.length || 0}</p>
            </div>
            <div class="stat-card">
                <h3>Metas</h3>
                <p>${metas.data?.length || 0}</p>
            </div>
        </div>
    `;
}

async function aprovarUsuario(userId) {
    const cargo = document.getElementById(`cargo_${userId}`).value;
    
    await db
        .from('funcionarios')
        .update({ status: 'ativo', cargo })
        .eq('id', userId);
    
    await db.from('atividades').insert([{
        usuario: currentUser.nome,
        acao: `Aprovou usuário como ${cargo}`
    }]);
    
    alert('Usuário aprovado!');
    loadSolicitacoesPendentes();
    loadAdminUsers();
}

async function rejeitarUsuario(userId) {
    if (!confirm('Tem certeza que deseja rejeitar este usuário?')) return;
    
    await db
        .from('funcionarios')
        .update({ status: 'rejeitado' })
        .eq('id', userId);
    
    alert('Usuário rejeitado.');
    loadSolicitacoesPendentes();
    loadAdminUsers();
}

async function handleItemSubmit(e) {
    e.preventDefault();
    
    const nome = document.getElementById('itemNome').value;
    const emoji = document.getElementById('itemEmoji').value;
    const itemCompleto = emoji ? `${emoji} ${nome}` : nome;
    
    await db
        .from('estoque')
        .insert([{ item: itemCompleto, quantidade: 0 }]);
    
    alert('Item adicionado!');
    e.target.reset();
    loadAdminItems();
}

// Inicializar
if (currentUser) {
    if (currentUser.cargo === 'admin') {
        loadAdminPanel();
    }
}