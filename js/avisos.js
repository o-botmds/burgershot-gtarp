async function loadAvisos() {
    const { data: avisos, error } = await supabase
        .from('avisos')
        .select('*')
        .order('created_at', { ascending: false });
    
    if (avisos) {
        const container = document.getElementById('avisosLista');
        container.innerHTML = avisos.map(aviso => `
            <div class="list-item ${aviso.prioridade === 'urgente' ? 'urgente' : ''}">
                <strong>${aviso.titulo}</strong>
                <span class="prioridade">${aviso.prioridade}</span>
                <p>${aviso.mensagem}</p>
                <small>Por: ${aviso.usuario} em ${new Date(aviso.created_at).toLocaleString()}</small>
            </div>
        `).join('');
    }
}

document.getElementById('avisoForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const titulo = document.getElementById('avisoTitulo').value;
    const mensagem = document.getElementById('avisoMensagem').value;
    const prioridade = document.getElementById('avisoPrioridade').value;
    
    try {
        const { error } = await supabase
            .from('avisos')
            .insert([
                {
                    titulo,
                    mensagem,
                    prioridade,
                    usuario: currentUser.nome
                }
            ]);
        
        if (error) throw error;
        
        alert('Aviso publicado!');
        e.target.reset();
        loadAvisos();
        
    } catch (err) {
        alert('Erro ao publicar aviso');
        console.error(err);
    }
});

if (currentUser) {
    loadAvisos();
}