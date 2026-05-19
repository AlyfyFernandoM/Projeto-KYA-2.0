/*
  # Seed KYA produtos table with sample products

  1. Sample Data
    - Insert 20 products across multiple markets
    - Include nutritional information (calories, proteins, carbs, fats)
    - Assign to existing markets
    - Cover fresh produce, proteins, dairy, grains

  2. Categories
    - Vegetais (vegetables)
    - Frutas (fruits)
    - Proteínas (proteins)
    - Laticínios (dairy)
    - Grãos (grains)
    - Outros (other)
*/

INSERT INTO produtos (
  mercado_id, nome, categoria, preco,
  calorias, proteinas, carboidratos, gorduras,
  unidade, created_at
) VALUES
-- Market 1: Mercado Natural (Organic focus)
(
  (SELECT id FROM mercados WHERE nome = 'Mercado Natural' LIMIT 1),
  'Cenoura Biológica 500g',
  'Vegetais',
  3.50, 41, 0.9, 10, 0.2, 'un', now()
),
(
  (SELECT id FROM mercados WHERE nome = 'Mercado Natural' LIMIT 1),
  'Alface Romana Orgânica',
  'Vegetais',
  2.99, 15, 1.2, 3, 0.2, 'un', now()
),
(
  (SELECT id FROM mercados WHERE nome = 'Mercado Natural' LIMIT 1),
  'Peito de Frango Biológico 400g',
  'Proteínas',
  8.99, 165, 31, 0, 3.6, 'un', now()
),
(
  (SELECT id FROM mercados WHERE nome = 'Mercado Natural' LIMIT 1),
  'Ovos Biológicos Dúzia',
  'Proteínas',
  5.50, 78, 6.3, 0.6, 5.3, 'un', now()
),
(
  (SELECT id FROM mercados WHERE nome = 'Mercado Natural' LIMIT 1),
  'Arroz Integral Biológico 1kg',
  'Grãos',
  4.99, 111, 2.6, 24, 0.9, 'kg', now()
),
(
  (SELECT id FROM mercados WHERE nome = 'Mercado Natural' LIMIT 1),
  'Azeite Extra Virgem 500ml',
  'Óleos',
  9.99, 884, 0, 0, 100, 'ml', now()
),
-- Market 2: Superfresco
(
  (SELECT id FROM mercados WHERE nome = 'Superfresco' LIMIT 1),
  'Maçã Fuji 1kg',
  'Frutas',
  4.50, 52, 0.3, 14, 0.2, 'kg', now()
),
(
  (SELECT id FROM mercados WHERE nome = 'Superfresco' LIMIT 1),
  'Tomate Caqui 500g',
  'Vegetais',
  2.50, 18, 0.9, 3.9, 0.2, 'un', now()
),
(
  (SELECT id FROM mercados WHERE nome = 'Superfresco' LIMIT 1),
  'Iogurte Grego 400g',
  'Laticínios',
  3.99, 59, 10, 3.5, 0.4, 'un', now()
),
(
  (SELECT id FROM mercados WHERE nome = 'Superfresco' LIMIT 1),
  'Pão Integral 500g',
  'Grãos',
  2.99, 265, 9, 49, 3.3, 'un', now()
),
(
  (SELECT id FROM mercados WHERE nome = 'Superfresco' LIMIT 1),
  'Leite Semi-Desnatado 1L',
  'Laticínios',
  1.50, 49, 3.2, 4.8, 1.6, 'l', now()
),
(
  (SELECT id FROM mercados WHERE nome = 'Superfresco' LIMIT 1),
  'Salmão Fresco 250g',
  'Proteínas',
  12.99, 206, 22, 0, 13, 'un', now()
),
-- Market 3: Horta do Campo
(
  (SELECT id FROM mercados WHERE nome = 'Horta do Campo' LIMIT 1),
  'Abóbora Cabotian 1kg',
  'Vegetais',
  3.99, 26, 1, 6, 0.1, 'kg', now()
),
(
  (SELECT id FROM mercados WHERE nome = 'Horta do Campo' LIMIT 1),
  'Espinafre Fresco 200g',
  'Vegetais',
  2.50, 23, 2.7, 3.6, 0.4, 'un', now()
),
(
  (SELECT id FROM mercados WHERE nome = 'Horta do Campo' LIMIT 1),
  'Batata Doce 500g',
  'Vegetais',
  2.99, 86, 1.6, 20, 0.1, 'kg', now()
),
(
  (SELECT id FROM mercados WHERE nome = 'Horta do Campo' LIMIT 1),
  'Cogumelos Frescos 250g',
  'Vegetais',
  4.50, 22, 3.1, 3.3, 0.3, 'un', now()
),
(
  (SELECT id FROM mercados WHERE nome = 'Horta do Campo' LIMIT 1),
  'Banana Orgânica 1kg',
  'Frutas',
  3.50, 89, 1.1, 23, 0.3, 'kg', now()
),
(
  (SELECT id FROM mercados WHERE nome = 'Horta do Campo' LIMIT 1),
  'Mel Puro 500ml',
  'Outros',
  8.99, 304, 0.3, 82, 0, 'ml', now()
),
-- Market 4: MercadoGo
(
  (SELECT id FROM mercados WHERE nome = 'MercadoGo' LIMIT 1),
  'Frango em Ponta 500g',
  'Proteínas',
  6.99, 165, 31, 0, 3.6, 'un', now()
),
(
  (SELECT id FROM mercados WHERE nome = 'MercadoGo' LIMIT 1),
  'Queijo Meia Cura 200g',
  'Laticínios',
  5.99, 402, 25, 1.3, 33, 'un', now()
)
ON CONFLICT DO NOTHING;
