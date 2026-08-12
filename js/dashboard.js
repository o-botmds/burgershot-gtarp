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

// Funções de carregamento
async function loadMinhasVendasHoje() {
    const { data: vendas } = await supabase
        .from('vendas')
        .select('valor_total')
        .eq('vendedor_id', currentUser.id)
        .gte('created_at', getToday());
    
    if (vendas) {
        const total = vendas.reduce((sum, v) => sum + parseFloat(v.valor_total), 0);
        document.getElementById('minhasVendasHoje').textContent = formatCurrency(total);
    }
}

async function loadTotalVendasHoje() {
    const { data: vendas } = await supabase
        .from('vendas')
        .select('valor_total')
        .gte('created_at', getToday());
    
    if (vendas) {
        const total = vendas.reduce((sum, v) => sum + parseFloat(v.valor_total), 0);
        document.getElementById('totalVendasHoje').textContent = formatCurrency(total);
    }
}

async function loadVendasHoje() {
    const { data: vendas } = await supabase
        .from('vendas')
        .select('valor_total')
        .gte('created_at', getToday());
    
    if (vendas) {
        const total = vendas.reduce((sum, v) => sum + parseFloat(v.valor_total), 0);
        document.getElementById('vendasHoje').textContent = formatCurrency(total);
    }
}

async function loadMetaDia() {
    const { data: meta } = await supabase
        .from('metas')
        .select('*')
        .eq('data', getToday())
        .single();
    
    if (meta) {
        document.getElementById('metaDia').textContent = `${meta.quantidade} ${meta.tipo}`;
    }
}

async function loadFuncionariosAtivos() {
    const { data: funcionarios } = await supabase
        .from('funcionarios')
        .select('id')
        .eq('status', 'ativo');
    
    if (funcionarios) {
        document.getElementById('funcionariosAtivos').textContent = funcionarios.length;
    }
}

async function loadItensEstoque() {
    const { data: itens } = await supabase
        .from('estoque')
        .select('quantidade');
    
    if (itens) {
        const total = itens.reduce((sum, i) => sum + i.quantidade, 0);
        document.getElementById('itensEstoque').textContent = total;
    }
}

async function loadUsuariosPendentes() {
    const { data: pendentes } = await supabase
        .from('funcionarios')
        .select('id')
        .eq('status', 'pendente');
    
    if (pendentes) {
        document.getElementById('usuariosPendentes').textContent = pendentes.length;
    }
}

async function loadTotalFuncionarios() {
    const { data: funcionarios } = await supabase
        .from('funcionarios')
        .select('id');
    
    if (funcionarios) {
        document.getElementById('totalFuncionarios').textContent = funcionarios.length;
    }
}

async function loadAcessosHoje() {
    const { data: acessos } = await supabase
        .from('atividades')
        .select('id')
        .gte('created_at', getToday());
    
    if (acessos) {
        document.getElementById('acessosHoje').textContent = acessos.length;
    }
}

async function loadVendasPorFuncionario() {
    const { data: vendas } = await supabase
        .from('vendas')
        .select('vendedor, valor_total')
        .gte('created_at', getToday());
    
    if (vendas) {
        const porFuncionario = {};
        vendas.forEach(venda => {
            if (!porFuncionario[venda.vendedor]) {
                porFuncionario[venda.vendedor] = 0;
            }
            porFuncionario[venda.vendedor] += parseFloat(venda.valor_total);
        });
        
        document.getElementById('vendasPorFuncionario').innerHTML = Object.entries(porFuncionario)
            .map(([func, total]) => `
                <div class="list-item">
                    <strong>${func}</strong>: ${formatCurrency(total)}
                </div>
            `).join('');
    }
}

async function loadStatusEstoque() {
    const { data: estoque } = await supabase
        .from('estoque')
        .select('*');
    
    if (estoque) {
        document.getElementById('statusEstoque').innerHTML = estoque.map(item => `
            <div class="list-item">
                <strong>${item.item}</strong>: ${item.quantidade} unidades
                ${item.quantidade < 20 ? '<span class="badge badge-danger">Baixo!</span>' : ''}
            </div>
        `).join('');
    }
}

async function loadMetasAndamento() {
    const { data: metas } = await supabase
        .from('metas')
        .select('*')
        .eq('status', 'pendente');
    
    if (metas) {
        document.getElementById('metasAndamento').innerHTML = metas.map(meta => `
            <div class="list-item">
                <strong>${meta.tipo}</strong>: ${meta.quantidade} unidades
                <small>${formatDate(meta.data)}</small>
            </div>
        `).join('');
    }
}

async function loadExpedienteResumo() {
    const { data: expediente } = await supabase
        .from('expediente')
        .select('*')
        .order('aberto_em', { ascending: false })
        .limit(5);
    
    if (expediente) {
        document.getElementById('expedienteResumo').innerHTML = expediente.map(exp => `
            <div class="list-item">
                <strong>${exp.aberto_por}</strong>
                <small>${formatDateTime(exp.aberto_em)}</small>
            </div>
        `).join('');
    }
}

async function loadAvisosRecentes() {
    const { data: avisos } = await supabase
        .from('avisos')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
    
    if (avisos) {
        document.getElementById('avisosRecentes').innerHTML = avisos.map(aviso => `
            <div class="list-item">
                <strong>${aviso.titulo}</strong>
                <p>${aviso.mensagem}</p>
            </div>
        `).join('');
    }
}

async function loadResumoVendas() {
    const { data: vendas } = await supabase
        .from('vendas')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
    
    if (vendas) {
        document.getElementById('resumoVendas').innerHTML = `
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Cliente</th>
                            <th>Item</th>
                            <th>Valor</th>
                            <th>Vendedor</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${vendas.map(venda => `
                            <tr>
                                <td>${venda.cliente}</td>
                                <td>${venda.item}</td>
                                <td>${formatCurrency(venda.valor_total)}</td>
                                <td>${venda.vendedor}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }
}

async function loadDistribuicaoCargos() {
    const { data: funcionarios } = await supabase
        .from('funcionarios')
        .select('cargo');
    
    if (funcionarios) {
        const porCargo = {};
        funcionarios.forEach(func => {
            porCargo[func.cargo] = (porCargo[func.cargo] || 0) + 1;
        });
        
        document.getElementById('distribuicaoCargos').innerHTML = Object.entries(porCargo)
            .map(([cargo, qtd]) => `
                <div class="list-item">
                    <strong>${cargo}</strong>: ${qtd} funcionário(s)
                </div>
            `).join('');
    }
}

async function loadAtividadesSistema() {
    const { data: atividades } = await supabase
        .from('atividades')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
    
    if (atividades) {
        document.getElementById('atividadesSistema').innerHTML = atividades.map(ativ => `
            <div class="list-item">
                <strong>${ativ.usuario}</strong>: ${ativ.acao}
                <small>${formatDateTime(ativ.created_at)}</small>
            </div>
        `).join('');
    }
}

async function loadStatusSistema() {
    document.getElementById('statusSistema').innerHTML = `
        <div class="list-item">
            <strong>Versão do Sistema:</strong> ${CONFIG.version}
        </div>
        <div class="list-item">
            <strong>Status do Banco:</strong> <span class="badge badge-success">Online</span>
        </div>
        <div class="list-item">
            <strong>Conexão:</strong> <span class="badge badge-success">Estável</span>
        </div>
    `;
}

async function loadEstatisticasGerais() {
    const [vendas, estoque, funcionarios, metas] = await Promise.all([
        supabase.from('vendas').select('id'),
        supabase.from('estoque').select('id'),
        supabase.from('funcionarios').select('id'),
        supabase.from('metas').select('id')
    ]);
    
    document.getElementById('estatisticasGerais').innerHTML = `
        <div class="stats-grid">
            <div class="stat-card">
                <h3>Total de Vendas</h3>
                <p>${vendas.data?.length || 0}</p>
            </div>
            <div class="stat-card">
                <h3>Itens Diferentes</h3>
                <p>${estoque.data?.length || 0}</p>
            </div>
            <div class="stat-card">
                <h3>Funcionários</h3>
                <p>${funcionarios.data?.length || 0}</p>
            </div>
            <div class="stat-card">
                <h3>Metas Criadas</h3>
                <p>${metas.data?.length || 0}</p>
            </div>
        </div>
    `;
}