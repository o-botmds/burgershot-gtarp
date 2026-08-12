async function loadMetas() {
    const { data: metas, error } = await supabase
        .from('metas')
        .select('*')
        .order('created_at', { ascending: false });
    
    if (metas) {
        const container = document.getElementById('metasLista');
        container.innerHTML = metas.map(meta => `
            <div class="list-item">
                <div>
                    <strong>${meta.tipo}</strong> - ${meta.quantidade} unidades
                    <p>Data: ${meta.data}</p>
                    <p>Enviado por: ${meta.usuario_nome}</p>
                    ${meta.print_url ? `<img src="${meta.print_url}" alt="Print da meta" style="max-width: 200px; margin-top: 10px;">` : ''}
                </div>
            </div>
        `).join('');
    }
}

document.getElementById('metaForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const tipo = document.getElementById('metaTipo').value;
    const quantidade = document.getElementById('metaQuantidade').value;
    const data = document.getElementById('metaData').value;
    const printFile = document.getElementById('metaPrint').files[0];
    
    if (!printFile) {
        alert('Por favor, anexe um print da meta');
        return;
    }
    
    try {
        // Upload do print
        const fileName = `metas/${Date.now()}_${printFile.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('prints')
            .upload(fileName, printFile);
        
        if (uploadError) throw uploadError;
        
        const printUrl = `${SUPABASE_URL}/storage/v1/object/public/prints/${fileName}`;
        
        // Salvar meta
        const { error } = await supabase
            .from('metas')
            .insert([
                {
                    tipo,
                    quantidade,
                    data,
                    print_url: printUrl,
                    usuario_id: currentUser.id,
                    usuario_nome: currentUser.nome
                }
            ]);
        
        if (error) throw error;
        
        alert('Meta enviada com sucesso!');
        e.target.reset();
        loadMetas();
        
        // Registrar atividade
        await supabase.from('atividades').insert([
            {
                usuario: currentUser.nome,
                acao: `Enviou meta: ${quantidade} ${tipo}`
            }
        ]);
        
    } catch (err) {
        alert('Erro ao enviar meta');
        console.error(err);
    }
});

// Carregar metas ao iniciar
if (currentUser) {
    loadMetas();
}