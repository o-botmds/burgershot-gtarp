let expedienteAberto = false;

async function loadExpediente() {
    const expedienteContent = document.getElementById('expedienteContent');
    
    expedienteContent.innerHTML = `
        <div class="card">
            <h3>Status do Restaurante</h3>
            <div id="expedienteStatus">
                <p>Restaurante: <span id="restauranteStatus">Fechado</span></p>
                <p>Tempo aberto: <span id="tempoAberto">0h 0min</span></p>
            </div>
            <button id="toggleExpediente" onclick="toggleExpediente()" class="btn btn-success">
                🔓 Abrir Restaurante
            </button>
        </div>
        
        <div class="card">
            <h3>Histórico de Expediente</h3>
            <div id="expedienteHistorico"></div>
        </div>
    `;
    
    await loadExpedienteHistorico();
}

async function toggleExpediente() {
    if (expedienteAberto) {
        // Fechar
        const { data: expediente } = await db
            .from('expediente')
            .select('*')
            .is('fechado_em', null)
            .single();
        
        if (expediente) {
            const fechadoEm = new Date();
            const abertoEm = new Date(expediente.aberto_em);
            const duracao = Math.floor((fechadoEm - abertoEm) / 1000 / 60);
            
            await db
                .from('expediente')
                .update({
                    fechado_por: currentUser.nome,
                    fechado_em: fechadoEm.toISOString(),
                    duracao: `${Math.floor(duracao / 60)}h ${duracao % 60}min`
                })
                .eq('id', expediente.id);
        }
        
        expedienteAberto = false;
    } else {
        // Abrir
        await db
            .from('expediente')
            .insert([{
                aberto_por: currentUser.nome,
                aberto_em: new Date().toISOString()
            }]);
        
        expedienteAberto = true;
    }
    
    loadExpediente();
}

async function loadExpedienteHistorico() {
    const { data: historico } = await db
        .from('expediente')
        .select('*')
        .order('aberto_em', { ascending: false })
        .limit(20);
    
    if (historico && historico.length > 0) {
        document.getElementById('expedienteHistorico').innerHTML = historico.map(exp => `
            <div class="list-item">
                <strong>${exp.aberto_por}</strong>
                <p>Aberto em: ${formatDateTime(exp.aberto_em)}</p>
                ${exp.fechado_em ? `
                    <p>Fechado por: ${exp.fechado_por}</p>
                    <p>Fechado em: ${formatDateTime(exp.fechado_em)}</p>
                    <p>Duração: ${exp.duracao}</p>
                ` : '<span class="badge badge-success">Em andamento</span>'}
            </div>
        `).join('');
    }
}