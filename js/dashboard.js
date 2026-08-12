// Dashboard para Funcionários
async function loadFuncionarioDashboard() {
    const dashboardContent = document.getElementById('dashboardContent');
    
    dashboardContent.innerHTML = `
        <div class="stats-grid">
            <div class="stat-card">
                <h3>Minhas Vendas Hoje</h3>
                <p id="minhasVendasHoje">R$ 0,00</p>
            </div>
            <div class="stat-card">
                <h3>Total de Vendas Hoje</h3>
                <p id="totalVendasHoje">R$ 0,00</p>
            </div>
            <div class="stat-card">
                <h3>Meu Turno</h3>
                <p id="meuTurno">Não iniciado</p>
            </div>
        </div>
        
        <div class="card">
            <h3>Meus Últimos Registros</h3>
            <div id="meusRegistros"></div>
        </div>
        
        <div class="card">
            <h3>Avisos Importantes</h3>
            <div id="avisosImportantes"></div>
        </div>
    `;
    
    await Promise.all([
        loadMinhasVendasHoje(),
        loadTotalVendasHoje(),
        loadMeuTurno(),
        loadMeusRegistros(),
        loadAvisosImportantes()
    ]);
}

// Dashboard para Gerentes e Donos
async function loadGerenteDashboard() {
    const dashboardContent = document.getElementById('dashboardContent');
    
    dashboardContent.innerHTML = `
        <div class="stats-grid">
            <div class="stat-card">
                <h3>Vendas Hoje</h3>
                <p id="vendasHoje">R$ 0,00</p>
            </div>
            <div class="stat-card">
                <h3>Meta do Dia</h3>
                <p id="metaDia">Não definida</p>
            </div>
            <div class="stat-card">
                <h3>Funcionários Ativos</h3>
                <p id="funcionariosAtivos">0</p>
            </div>
            <div class="stat-card">
                <h3>Itens no Estoque</h3>
                <p id="itensEstoque">0</p>
            </div>
        </div>
        
        <div class="grid-2">
            <div class="card">
                <h3>Vendas por Funcionário</h3>
                <div id="vendasPorFuncionario"></div>
            </div>
            
            <div class="card">
                <h3>Status do Estoque</h3>
                <div id="statusEstoque"></div>
            </div>
        </div>
        
        <div class="card">
            <h3>Metas em Andamento</h3>
            <div id="metasAndamento"></div>
        </div>
        
        <div class="card">
            <h3>Expediente</h3>
            <div id="expedienteResumo"></div>
        </div>
        
        <div class="card">
            <h3>Avisos Recentes</h3>
            <div id="avisosRecentes"></div>
        </div>
    `;
    
    await Promise.all([
        loadVendasHoje(),
        loadMetaDia(),
        loadFuncionariosAtivos(),
        loadItensEstoque(),
        loadVendasPorFuncionario(),
        loadStatusEstoque(),
        loadMetasAndamento(),
        loadExpedienteResumo(),
        loadAvisosRecentes()
    ]);
}

// Dashboard para Admin
async function loadAdminDashboard() {
    const dashboardContent = document.getElementById('dashboardContent');
    
    dashboardContent.innerHTML = `
        <div class="stats-grid">
            <div class="stat-card">
                <h3>Vendas Hoje</h3>
                <p id="vendasHoje">R$ 0,00</p>
            </div>
            <div class="stat-card">
                <h3>Usuários Pendentes</h3>
                <p id="usuariosPendentes">0</p>
            </div>
            <div class="stat-card">
                <h3>Total de Funcionários</h3>
                <p id="totalFuncionarios">0</p>
            </div>
            <div class="stat-card">
                <h3>Acessos Hoje</h3>
                <p id="acessosHoje">0</p>
            </div>
        </div>
        
        <div class="grid-2">
            <div class="card">
                <h3>Resumo de Vendas</h3>
                <div id="resumoVendas"></div>
            </div>
            
            <div class="card">
                <h3>Distribuição de Cargos</h3>
                <div id="distribuicaoCargos"></div>
            </div>
        </div>
        
        <div class="card">
            <h3>Atividades Recentes do Sistema</h3>
            <div id="atividadesSistema"></div>
        </div>
        
        <div class="card">
            <h3>Status do Sistema</h3>
            <div id="statusSistema"></div>
        </div>
        
        <div class="card">
            <h3>Estatísticas Gerais</h3>
            <div id="estatisticasGerais"></div>
        </div>
    `;
    
    await Promise.all([
        loadVendasHoje(),
        loadUsuariosPendentes(),
        loadTotalFuncionarios(),
        loadAcessosHoje(),
        loadResumoVendas(),
        loadDistribuicaoCargos(),
        loadAtividadesSistema(),
        loadStatusSistema(),
        loadEstatisticasGerais()
    ]);
}

// Funções de car