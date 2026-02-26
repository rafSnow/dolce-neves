-- ============================================
-- Dolce Neves — Migration 001: Products
-- ============================================
-- Tabela de produtos
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL CHECK (price > 0),
  image_url TEXT NOT NULL,
  active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
-- Index para performance no filtro por categoria
CREATE INDEX idx_products_category ON products (category);
-- Index para filtrar produtos ativos
CREATE INDEX idx_products_active ON products (active)
WHERE active = true;
-- ============================================
-- Row Level Security
-- ============================================
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
-- Policy publica de leitura: qualquer visitante le produtos ativos
CREATE POLICY "Produtos ativos sao publicos" ON products FOR
SELECT USING (active = true);
-- Policy de escrita: somente usuarios autenticados (admin)
CREATE POLICY "Admin pode inserir produtos" ON products FOR
INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin pode atualizar produtos" ON products FOR
UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin pode deletar produtos" ON products FOR DELETE TO authenticated USING (true);
-- ============================================
-- Seed: 16 produtos em 4 categorias
-- ============================================
INSERT INTO products (
    name,
    category,
    description,
    price,
    image_url,
    active
  )
VALUES -- TRUFAS (4)
  (
    'Trufa de Chocolate Belga 70%',
    'Trufas',
    'Ganache aveludado de chocolate belga 70% cacau, envolvido em uma fina camada crocante de cacau em po premium. Derrete na boca revelando notas intensas e sofisticadas.',
    8.90,
    'https://picsum.photos/seed/dolce-trufa-belga/400/400',
    true
  ),
  (
    'Trufa de Pistache Siciliano',
    'Trufas',
    'Recheio cremoso de pasta artesanal de pistache siciliano, coberto com chocolate branco e lascas de pistache torrado. Uma experiencia gourmet unica.',
    12.50,
    'https://picsum.photos/seed/dolce-trufa-pistache/400/400',
    true
  ),
  (
    'Trufa de Maracuja com Chocolate ao Leite',
    'Trufas',
    'A acidez tropical do maracuja fresco harmonizada com a doçura do chocolate ao leite belga. Cobertura finalizada com raspas de chocolate.',
    9.50,
    'https://picsum.photos/seed/dolce-trufa-maracuja/400/400',
    true
  ),
  (
    'Trufa de Limao Siciliano e Manjericao',
    'Trufas',
    'Combinacao surpreendente de limao siciliano com toque sutil de manjericao fresco. Cobertura de chocolate branco com zest de limao.',
    10.00,
    'https://picsum.photos/seed/dolce-trufa-limao/400/400',
    true
  ),
  -- BOMBONS (4)
  (
    'Bombom de Caramelo Salgado',
    'Bombons',
    'Casquinha crocante de chocolate meio amargo recheada com caramelo salgado artesanal feito com flor de sal. Equilibrio perfeito entre doce e salgado.',
    7.50,
    'https://picsum.photos/seed/dolce-bombom-caramelo/400/400',
    true
  ),
  (
    'Bombom de Frutas Vermelhas',
    'Bombons',
    'Recheio sedoso de ganache de frutas vermelhas — framboesa, morango e mirtilo — envolvido em chocolate ao leite premium.',
    7.90,
    'https://picsum.photos/seed/dolce-bombom-frutas/400/400',
    true
  ),
  (
    'Bombom de Avelã Crocante',
    'Bombons',
    'Avela torrada inteira envolvida em praline crocante e coberta com chocolate ao leite. Inspirado nos melhores bombons europeus.',
    8.50,
    'https://picsum.photos/seed/dolce-bombom-avela/400/400',
    true
  ),
  (
    'Bombom de Cafe Espresso',
    'Bombons',
    'Ganache intenso de cafe espresso artesanal com um toque de licor de cafe, coberto em chocolate amargo 60%. Para os amantes de cafe.',
    8.00,
    'https://picsum.photos/seed/dolce-bombom-cafe/400/400',
    true
  ),
  -- KITS PRESENTEAVEIS (4)
  (
    'Caixa Classica 9 unidades',
    'Kits Presenteáveis',
    'Selecao curada com 9 doces sortidos das nossas especialidades, em caixa artesanal com laco de cetim. Ideal para presentear com elegancia.',
    68.90,
    'https://picsum.photos/seed/dolce-kit-classica/400/400',
    true
  ),
  (
    'Caixa Premium 16 unidades',
    'Kits Presenteáveis',
    'Nossa selecao premium com 16 unidades das melhores trufas e bombons, em embalagem luxo com acabamento dourado. O presente perfeito.',
    119.90,
    'https://picsum.photos/seed/dolce-kit-premium/400/400',
    true
  ),
  (
    'Caixa Degustacao 25 unidades',
    'Kits Presenteáveis',
    'A experiencia completa Dolce Neves: 25 unidades com todos os sabores do nosso cardapio. Embalagem especial com divisorias individuais.',
    179.90,
    'https://picsum.photos/seed/dolce-kit-degustacao/400/400',
    true
  ),
  (
    'Mini Caixa Surpresa 4 unidades',
    'Kits Presenteáveis',
    'Caixinha charmosa com 4 doces sortidos — perfeita para uma lembrancinha especial ou para se presentear em um momento doce.',
    32.90,
    'https://picsum.photos/seed/dolce-kit-mini/400/400',
    true
  ),
  -- DOCINHOS FINOS (4)
  (
    'Brigadeiro Gourmet de Chocolate Belga',
    'Docinhos Finos',
    'Brigadeiro artesanal feito com chocolate belga 54% e creme de leite fresco, finalizado com granulado belga crocante. O classico elevado ao gourmet.',
    5.50,
    'https://picsum.photos/seed/dolce-brigadeiro/400/400',
    true
  ),
  (
    'Beijinho de Coco Queimado',
    'Docinhos Finos',
    'Beijinho premium com coco ralado fresco e toque de coco queimado, finalizado com perola de açucar. Delicadeza em cada mordida.',
    4.50,
    'https://picsum.photos/seed/dolce-beijinho/400/400',
    true
  ),
  (
    'Camafeu de Nozes',
    'Docinhos Finos',
    'Doce fino tradicional com massa de nozes moidas, leite condensado artesanal e cobertura de fondant branco. Elegancia classica.',
    6.50,
    'https://picsum.photos/seed/dolce-camafeu/400/400',
    true
  ),
  (
    'Palha Italiana Premium',
    'Docinhos Finos',
    'Palha italiana com biscoito amanteigado importado e chocolate meio amargo, cortada em cubos perfeitos e embalada individualmente.',
    5.00,
    'https://picsum.photos/seed/dolce-palha/400/400',
    true
  );
