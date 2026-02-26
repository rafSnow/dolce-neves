-- ============================================
-- Dolce Neves — Migration 004: Agenda de Encomendas
-- ============================================
-- ============================================
-- 1. Tabela: orders
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  client_email TEXT,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  total_price NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (total_price >= 0),
  delivery_date DATE NOT NULL,
  delivery_time TEXT,
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (
    status IN (
      'pendente',
      'em_producao',
      'pronto',
      'entregue',
      'cancelado'
    )
  ),
  source TEXT NOT NULL DEFAULT 'manual' CHECK (
    source IN ('manual', 'whatsapp', 'corporativo', 'site')
  ),
  notes TEXT,
  force_accepted BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
-- Índices para queries frequentes
CREATE INDEX IF NOT EXISTS idx_orders_delivery_date ON orders (delivery_date);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders (status);
CREATE INDEX IF NOT EXISTS idx_orders_delivery_date_status ON orders (delivery_date, status);
-- Trigger: updated_at automático
CREATE OR REPLACE FUNCTION update_orders_updated_at() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER trg_orders_updated_at BEFORE
UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_orders_updated_at();
-- RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "orders_select_admin" ON orders FOR
SELECT TO authenticated USING (true);
CREATE POLICY "orders_insert_admin" ON orders FOR
INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "orders_update_admin" ON orders FOR
UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "orders_delete_admin" ON orders FOR DELETE TO authenticated USING (true);
-- ============================================
-- 2. Tabela: daily_capacity
-- ============================================
CREATE TABLE IF NOT EXISTS daily_capacity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL UNIQUE,
  max_units INT NOT NULL DEFAULT 100 CHECK (max_units > 0),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
-- Trigger: updated_at automático
CREATE OR REPLACE FUNCTION update_daily_capacity_updated_at() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER trg_daily_capacity_updated_at BEFORE
UPDATE ON daily_capacity FOR EACH ROW EXECUTE FUNCTION update_daily_capacity_updated_at();
-- RLS
ALTER TABLE daily_capacity ENABLE ROW LEVEL SECURITY;
CREATE POLICY "daily_capacity_select_admin" ON daily_capacity FOR
SELECT TO authenticated USING (true);
CREATE POLICY "daily_capacity_insert_admin" ON daily_capacity FOR
INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "daily_capacity_update_admin" ON daily_capacity FOR
UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "daily_capacity_delete_admin" ON daily_capacity FOR DELETE TO authenticated USING (true);
-- ============================================
-- 3. View: daily_order_summary
-- ============================================
CREATE OR REPLACE VIEW daily_order_summary AS
SELECT o.delivery_date,
  COUNT(o.id)::int AS total_orders,
  COALESCE(
    SUM(
      (
        SELECT COALESCE(SUM((item->>'quantity')::int), 0)
        FROM jsonb_array_elements(o.items) AS item
      )
    ),
    0
  )::int AS total_units,
  COALESCE(dc.max_units, 100) AS max_units,
  COALESCE(dc.max_units, 100) - COALESCE(
    SUM(
      (
        SELECT COALESCE(SUM((item->>'quantity')::int), 0)
        FROM jsonb_array_elements(o.items) AS item
      )
    ),
    0
  )::int AS available_units,
  ROUND(
    (
      COALESCE(
        SUM(
          (
            SELECT COALESCE(SUM((item->>'quantity')::int), 0)
            FROM jsonb_array_elements(o.items) AS item
          )
        ),
        0
      )::numeric / COALESCE(dc.max_units, 100)
    ) * 100,
    1
  ) AS occupation_percent,
  COALESCE(
    SUM(
      (
        SELECT COALESCE(SUM((item->>'quantity')::int), 0)
        FROM jsonb_array_elements(o.items) AS item
      )
    ),
    0
  )::int > COALESCE(dc.max_units, 100) AS is_overbooked,
  jsonb_build_object(
    'pendente',
    COUNT(*) FILTER (
      WHERE o.status = 'pendente'
    ),
    'em_producao',
    COUNT(*) FILTER (
      WHERE o.status = 'em_producao'
    ),
    'pronto',
    COUNT(*) FILTER (
      WHERE o.status = 'pronto'
    ),
    'entregue',
    COUNT(*) FILTER (
      WHERE o.status = 'entregue'
    ),
    'cancelado',
    COUNT(*) FILTER (
      WHERE o.status = 'cancelado'
    )
  ) AS status_breakdown
FROM orders o
  LEFT JOIN daily_capacity dc ON dc.date = o.delivery_date
WHERE o.status != 'cancelado'
GROUP BY o.delivery_date,
  dc.max_units;
-- ============================================
-- 4. Function: check_capacity
-- ============================================
CREATE OR REPLACE FUNCTION check_capacity(
    p_date DATE,
    p_units INT DEFAULT 0,
    p_exclude_order_id UUID DEFAULT NULL
  ) RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE v_max_units INT;
v_current_units INT;
v_available INT;
v_occupation NUMERIC;
BEGIN -- Buscar capacidade configurada ou padrão
SELECT COALESCE(dc.max_units, 100) INTO v_max_units
FROM daily_capacity dc
WHERE dc.date = p_date;
IF v_max_units IS NULL THEN v_max_units := 100;
END IF;
-- Calcular unidades atuais (excluindo cancelados e o pedido em edição)
SELECT COALESCE(
    SUM(
      (
        SELECT COALESCE(SUM((item->>'quantity')::int), 0)
        FROM jsonb_array_elements(o.items) AS item
      )
    ),
    0
  )::int INTO v_current_units
FROM orders o
WHERE o.delivery_date = p_date
  AND o.status != 'cancelado'
  AND (
    p_exclude_order_id IS NULL
    OR o.id != p_exclude_order_id
  );
v_available := v_max_units - v_current_units;
v_occupation := CASE
  WHEN v_max_units > 0 THEN ROUND(
    (v_current_units::numeric / v_max_units) * 100,
    1
  )
  ELSE 0
END;
RETURN jsonb_build_object(
  'has_capacity',
  (v_current_units + p_units) <= v_max_units,
  'current_units',
  v_current_units,
  'max_units',
  v_max_units,
  'available_units',
  v_available,
  'occupation_percent',
  v_occupation
);
END;
$$;
