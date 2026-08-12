-- Tabela de Funcionários
CREATE TABLE funcionarios (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    cargo VARCHAR(50) NOT NULL CHECK (cargo IN ('estagiario', 'membro', 'supervisor', 'gerente', 'dono', 'admin')),
    status VARCHAR(20) DEFAULT 'ativo',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de Metas
CREATE TABLE metas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tipo VARCHAR(100) NOT NULL,
    quantidade INTEGER NOT NULL,
    data DATE NOT NULL,
    print_url TEXT,
    usuario_id UUID REFERENCES funcionarios(id),
    usuario_nome VARCHAR(255),
    status VARCHAR(20) DEFAULT 'pendente',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de Estoque
CREATE TABLE estoque (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    item VARCHAR(100) NOT NULL UNIQUE,
    quantidade INTEGER NOT NULL DEFAULT 0,
    unidade VARCHAR(20) DEFAULT 'un',
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de Movimentações de Estoque
CREATE TABLE movimentacoes_estoque (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('entrada', 'saida')),
    item VARCHAR(100) NOT NULL,
    quantidade INTEGER NOT NULL,
    observacao TEXT,
    usuario VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de Vendas
CREATE TABLE vendas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    cliente VARCHAR(255) NOT NULL,
    item VARCHAR(100) NOT NULL,
    quantidade INTEGER NOT NULL,
    valor_total DECIMAL(10,2) NOT NULL,
    vendedor VARCHAR(255),
    vendedor_id UUID REFERENCES funcionarios(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de Avisos
CREATE TABLE avisos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    mensagem TEXT NOT NULL,
    prioridade VARCHAR(20) DEFAULT 'normal',
    usuario VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de Atividades
CREATE TABLE atividades (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    usuario VARCHAR(255),
    acao TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de Expediente
CREATE TABLE expediente (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    aberto_por VARCHAR(255),
    aberto_em TIMESTAMP,
    fechado_por VARCHAR(255),
    fechado_em TIMESTAMP,
    duracao VARCHAR(50)
);

-- Índices para melhor performance
CREATE INDEX idx_funcionarios_email ON funcionarios(email);
CREATE INDEX idx_metas_data ON metas(data);
CREATE INDEX idx_vendas_created ON vendas(created_at);
CREATE INDEX idx_movimentacoes_created ON movimentacoes_estoque(created_at);

-- Inserir dados iniciais
INSERT INTO funcionarios (nome, email, cargo) VALUES
('Administrador', 'admin@burgershot.com', 'admin'),
('Gerente', 'gerente@burgershot.com', 'gerente'),
('Supervisor', 'supervisor@burgershot.com', 'supervisor');

INSERT INTO estoque (item, quantidade) VALUES
('carne', 100),
('alface', 50),
('tomate', 75),
('banana', 60);

-- Políticas de segurança (RLS)
ALTER TABLE funcionarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE metas ENABLE ROW LEVEL SECURITY;
ALTER TABLE estoque ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendas ENABLE ROW LEVEL SECURITY;
ALTER TABLE avisos ENABLE ROW LEVEL SECURITY;

-- Políticas para funcionários
CREATE POLICY "Funcionários podem ver outros funcionários" ON funcionarios
    FOR SELECT USING (true);

CREATE POLICY "Admins podem gerenciar funcionários" ON funcionarios
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM funcionarios f 
            WHERE f.id = auth.uid() 
            AND f.cargo = 'admin'
        )
    );

-- Políticas para metas
CREATE POLICY "Todos podem ver metas" ON metas
    FOR SELECT USING (true);

CREATE POLICY "Gerentes e acima podem criar metas" ON metas
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM funcionarios f 
            WHERE f.id = auth.uid() 
            AND f.cargo IN ('gerente', 'dono', 'admin')
        )
    );

-- Políticas para estoque
CREATE POLICY "Todos podem ver estoque" ON estoque
    FOR SELECT USING (true);

CREATE POLICY "Membros e acima podem gerenciar estoque" ON estoque
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM funcionarios f 
            WHERE f.id = auth.uid() 
            AND f.cargo IN ('membro', 'supervisor', 'gerente', 'dono', 'admin')
        )
    );