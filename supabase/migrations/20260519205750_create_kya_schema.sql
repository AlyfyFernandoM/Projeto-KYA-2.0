/*
  # KYA Platform - Initial Schema

  ## New Tables
  - profiles: user profile extending auth.users
  - mercados: partner markets
  - produtos: products per market with nutritional info
  - pedidos: purchase orders per user
  - itens_pedido: line items per order

  ## Security
  - RLS enabled on all tables
  - Users access only their own data; markets/products readable by all authenticated users
*/

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome text DEFAULT '',
  morada text DEFAULT '',
  preferencias_alimentares text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE TABLE IF NOT EXISTS mercados (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  distancia text DEFAULT '',
  tags text DEFAULT '',
  imagem_url text DEFAULT '',
  avaliacao numeric(3,1) DEFAULT 4.0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE mercados ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read markets"
  ON mercados FOR SELECT TO authenticated
  USING (true);

CREATE TABLE IF NOT EXISTS produtos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mercado_id uuid REFERENCES mercados(id) ON DELETE CASCADE,
  nome text NOT NULL,
  categoria text DEFAULT '',
  preco numeric(10,2) DEFAULT 0,
  unidade text DEFAULT 'un',
  imagem_url text DEFAULT '',
  calorias numeric(8,2) DEFAULT 0,
  proteinas numeric(8,2) DEFAULT 0,
  carboidratos numeric(8,2) DEFAULT 0,
  gorduras numeric(8,2) DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE produtos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read products"
  ON produtos FOR SELECT TO authenticated
  USING (true);

CREATE TABLE IF NOT EXISTS pedidos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  utilizador_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  mercado_id uuid REFERENCES mercados(id),
  mercado_nome text DEFAULT '',
  total numeric(10,2) DEFAULT 0,
  status text DEFAULT 'entregue',
  tempo_entrega text DEFAULT '',
  avaliacao text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own orders"
  ON pedidos FOR SELECT TO authenticated
  USING (auth.uid() = utilizador_id);

CREATE POLICY "Users can insert own orders"
  ON pedidos FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = utilizador_id);

CREATE TABLE IF NOT EXISTS itens_pedido (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pedido_id uuid REFERENCES pedidos(id) ON DELETE CASCADE NOT NULL,
  produto_nome text NOT NULL,
  quantidade integer DEFAULT 1,
  preco_unitario numeric(10,2) DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE itens_pedido ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own order items"
  ON itens_pedido FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM pedidos
      WHERE pedidos.id = itens_pedido.pedido_id
      AND pedidos.utilizador_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own order items"
  ON itens_pedido FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM pedidos
      WHERE pedidos.id = itens_pedido.pedido_id
      AND pedidos.utilizador_id = auth.uid()
    )
  );
