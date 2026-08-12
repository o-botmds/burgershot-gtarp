-- Tabela de Funcionários
CREATE TABLE funcionarios (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    cargo VARCHAR(50) NOT NULL DEFAULT 'estagiario' 
        CHECK (cargo IN ('estagiario', 'membro', 'supervisor', 'gerente', 'dono', 'admin')),
    status VARCHAR(20) NOT NULL DEFAULT 'pendente' 
        CHECK (status IN ('pendente', 'ativo', 'rejeitado', 'inativo')),
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
    item VARCHAR(255) NOT NULL UNIQUE,
    quantidade INTEGER NOT NULL DEFAULT 0,
    unidade VARCHAR(20) DEFAULT 'un',
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de Movimentações de Estoque
CREATE TABLE movimentacoes_estoque (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('entrada', 'saida')),
    item VARCHAR(255) NOT NULL,
    quantidade INTEGER NOT NULL,
    observacao TEXT,
    usuario VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de Vendas
CREATE TABLE vendas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    cliente VARCHAR(255) NOT NULL,
    item VARCHAR(255) NOT NULL,
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
    prioridade VARCHAR(20) DEFAULT 'normal' 
        CHECK (prioridade IN ('normal', 'importante', 'urgente')),
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

-- Índices
CREATE INDEX idx_funcionarios_email ON funcionarios(email);
CREATE INDEX idx_funcionarios_status ON funcionarios(status);
CREATE INDEX idx_metas_data ON metas(data);
CREATE INDEX idx_vendas_created ON vendas(created_at);
CREATE INDEX idx_movimentacoes_created ON movimentacoes_estoque(created_at);
CREATE INDEX idx_avisos_created ON avisos(created_at);

-- Inserir dados iniciais
INSERT INTO funcionarios (nome, email, cargo, status) VALUES
('Administrador', 'admin@burgershot.com', 'admin', 'ativo'),
('Gerente', 'gerente@burgershot.com', 'gerente', 'ativo'),
('Dono', 'dono@burgershot.com', 'dono', 'ativo');

-- Inserir itens iniciais
INSERT INTO estoque (item, quantidade) VALUES
('🥩 Carne', 100),
('🥬 Alface', 50),
('🍅 Tomate', 75),
('🍌 Banana', 60),
('🍔 Pão', 80),
('🧀 Queijo', 40),
('🥤 Refrigerante', 120),
('💧 Água', 100);

-- Habilitar RLS (Row Level Security)
ALTER TABLE funcionarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE metas ENABLE ROW LEVEL SECURITY;
ALTER TABLE estoque ENABLE ROW LEVEL SECURITY;
ALTER TABLE movimentacoes_estoque ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendas ENABLE ROW LEVEL SECURITY;
ALTER TABLE avisos ENABLE ROW LEVEL SECURITY;
ALTER TABLE atividades ENABLE ROW LEVEL SECURITY;
ALTER TABLE expediente ENABLE ROW LEVEL SECURITY;

-- Políticas para permitir acesso ao site
CREATE POLICY "Permitir leitura de funcionarios" ON funcionarios
    FOR SELECT USING (true);

CREATE POLICY "Permitir inserção de funcionarios" ON funcionarios
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir atualização de funcionarios" ON funcionarios
    FOR UPDATE USING (true);

-- Políticas para outras tabelas
CREATE POLICY "Permitir todas operações em metas" ON metas
    FOR ALL USING (true);

CREATE POLICY "Permitir todas operações em estoque" ON estoque
    FOR ALL USING (true);

CREATE POLICY "Permitir todas operações em movimentacoes" ON movimentacoes_estoque
    FOR ALL USING (true);

CREATE POLICY "Permitir todas operações em vendas" ON vendas
    FOR ALL USING (true);

CREATE POLICY "Permitir todas operações em avisos" ON avisos
    FOR ALL USING (true);

CREATE POLICY "Permitir todas operações em atividades" ON atividades
    FOR ALL USING (true);

CREATE POLICY "Permitir todas operações em expediente" ON expediente
    FOR ALL USING (true);