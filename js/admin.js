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
            <h3>Gerenciar Itens</h