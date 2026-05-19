/*
  # Add nutritional columns to produtos and seed initial data

  - Adds calorias, proteinas, carboidratos, gorduras to produtos table
  - Seeds mercados with sample data
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'produtos' AND column_name = 'calorias'
  ) THEN
    ALTER TABLE produtos ADD COLUMN calorias numeric(8,2) DEFAULT 0;
    ALTER TABLE produtos ADD COLUMN proteinas numeric(8,2) DEFAULT 0;
    ALTER TABLE produtos ADD COLUMN carboidratos numeric(8,2) DEFAULT 0;
    ALTER TABLE produtos ADD COLUMN gorduras numeric(8,2) DEFAULT 0;
  END IF;
END $$;

INSERT INTO mercados (nome, distancia, tags, imagem_url, avaliacao)
SELECT * FROM (VALUES
  ('Mercado Central KYA', '1.2 km de distância', ARRAY['geral','limpeza','bebidas','frios'], 'https://images.pexels.com/photos/1005638/pexels-photo-1005638.jpeg?auto=compress&cs=tinysrgb&w=600', 4.8),
  ('Hortifruti KYA', '2.5 km de distância', ARRAY['frutas','verduras','orgânico'], 'https://images.pexels.com/photos/2255935/pexels-photo-2255935.jpeg?auto=compress&cs=tinysrgb&w=600', 4.9),
  ('SuperMercado Vizinho', '0.8 km de distância', ARRAY['geral','carnes','padaria'], 'https://images.pexels.com/photos/3962294/pexels-photo-3962294.jpeg?auto=compress&cs=tinysrgb&w=600', 4.5),
  ('Empório Orgânico', '3.1 km de distância', ARRAY['orgânico','vegano','natural'], 'https://images.pexels.com/photos/1414651/pexels-photo-1414651.jpeg?auto=compress&cs=tinysrgb&w=600', 4.7)
) AS v(nome, distancia, tags, imagem_url, avaliacao)
WHERE NOT EXISTS (SELECT 1 FROM mercados WHERE mercados.nome = v.nome);
