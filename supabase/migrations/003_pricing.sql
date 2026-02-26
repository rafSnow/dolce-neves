-- =============================================
-- Migration 003: Ficha Técnica & Precificação
-- Módulo interno de custos da Dolce Neves
-- =============================================
-- ============================================
-- Tabela: ingredients
-- ============================================
CREATE TABLE IF NOT EXISTS ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  unit TEXT NOT NULL CHECK (
    unit IN ('g', 'kg', 'ml', 'l', 'un', 'cx', 'pacote')
  ),
  cost_per_unit NUMERIC(10, 4) NOT NULL CHECK (cost_per_unit > 0),
  supplier TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_ingredients_name ON ingredients (name);
-- ============================================
-- Tabela: product_ingredients
-- ============================================
CREATE TABLE IF NOT EXISTS product_ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  ingredient_id UUID NOT NULL REFERENCES ingredients(id) ON DELETE CASCADE,
  quantity NUMERIC(10, 4) NOT NULL CHECK (quantity > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (product_id, ingredient_id)
);
CREATE INDEX idx_product_ingredients_product ON product_ingredients (product_id);
CREATE INDEX idx_product_ingredients_ingredient ON product_ingredients (ingredient_id);
-- ============================================
-- Tabela: cost_configs
-- ============================================
CREATE TABLE IF NOT EXISTS cost_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  labor_hours NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (labor_hours >= 0),
  labor_rate_per_hour NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (labor_rate_per_hour >= 0),
  packaging_cost NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (packaging_cost >= 0),
  desired_margin_percent NUMERIC(5, 2) NOT NULL DEFAULT 30 CHECK (
    desired_margin_percent >= 0
    AND desired_margin_percent <= 100
  ),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (product_id)
);
-- ============================================
-- RLS: ingredients
-- ============================================
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin_select_ingredients" ON ingredients FOR
SELECT TO authenticated USING (true);
CREATE POLICY "admin_insert_ingredients" ON ingredients FOR
INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "admin_update_ingredients" ON ingredients FOR
UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_delete_ingredients" ON ingredients FOR DELETE TO authenticated USING (true);
-- ============================================
-- RLS: product_ingredients
-- ============================================
ALTER TABLE product_ingredients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin_select_product_ingredients" ON product_ingredients FOR
SELECT TO authenticated USING (true);
CREATE POLICY "admin_insert_product_ingredients" ON product_ingredients FOR
INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "admin_update_product_ingredients" ON product_ingredients FOR
UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_delete_product_ingredients" ON product_ingredients FOR DELETE TO authenticated USING (true);
-- ============================================
-- RLS: cost_configs
-- ============================================
ALTER TABLE cost_configs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin_select_cost_configs" ON cost_configs FOR
SELECT TO authenticated USING (true);
CREATE POLICY "admin_insert_cost_configs" ON cost_configs FOR
INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "admin_update_cost_configs" ON cost_configs FOR
UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_delete_cost_configs" ON cost_configs FOR DELETE TO authenticated USING (true);
-- ============================================
-- Triggers: updated_at automático
-- ============================================
CREATE OR REPLACE FUNCTION update_ingredients_updated_at() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER trigger_ingredients_updated_at BEFORE
UPDATE ON ingredients FOR EACH ROW EXECUTE FUNCTION update_ingredients_updated_at();
CREATE OR REPLACE FUNCTION update_cost_configs_updated_at() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER trigger_cost_configs_updated_at BEFORE
UPDATE ON cost_configs FOR EACH ROW EXECUTE FUNCTION update_cost_configs_updated_at();
-- ============================================
-- VIEW: product_cost_summary
-- ============================================
CREATE OR REPLACE VIEW product_cost_summary AS
SELECT p.id AS product_id,
  p.name AS product_name,
  p.category AS product_category,
  COALESCE(ing_cost.ingredient_cost, 0) AS ingredient_cost,
  COALESCE(cc.labor_hours * cc.labor_rate_per_hour, 0) AS labor_cost,
  COALESCE(cc.packaging_cost, 0) AS packaging_cost,
  (
    COALESCE(ing_cost.ingredient_cost, 0) + COALESCE(cc.labor_hours * cc.labor_rate_per_hour, 0) + COALESCE(cc.packaging_cost, 0)
  ) AS total_cost,
  COALESCE(cc.desired_margin_percent, 30) AS desired_margin_percent,
  CASE
    WHEN COALESCE(cc.desired_margin_percent, 30) >= 100 THEN 0
    WHEN (
      COALESCE(ing_cost.ingredient_cost, 0) + COALESCE(cc.labor_hours * cc.labor_rate_per_hour, 0) + COALESCE(cc.packaging_cost, 0)
    ) = 0 THEN 0
    ELSE ROUND(
      (
        COALESCE(ing_cost.ingredient_cost, 0) + COALESCE(cc.labor_hours * cc.labor_rate_per_hour, 0) + COALESCE(cc.packaging_cost, 0)
      ) / (
        1 - COALESCE(cc.desired_margin_percent, 30) / 100
      ),
      2
    )
  END AS suggested_price,
  p.price AS current_price,
  p.price - CASE
    WHEN COALESCE(cc.desired_margin_percent, 30) >= 100 THEN 0
    WHEN (
      COALESCE(ing_cost.ingredient_cost, 0) + COALESCE(cc.labor_hours * cc.labor_rate_per_hour, 0) + COALESCE(cc.packaging_cost, 0)
    ) = 0 THEN 0
    ELSE ROUND(
      (
        COALESCE(ing_cost.ingredient_cost, 0) + COALESCE(cc.labor_hours * cc.labor_rate_per_hour, 0) + COALESCE(cc.packaging_cost, 0)
      ) / (
        1 - COALESCE(cc.desired_margin_percent, 30) / 100
      ),
      2
    )
  END AS price_difference,
  p.price >= (
    COALESCE(ing_cost.ingredient_cost, 0) + COALESCE(cc.labor_hours * cc.labor_rate_per_hour, 0) + COALESCE(cc.packaging_cost, 0)
  ) AS is_profitable
FROM products p
  LEFT JOIN (
    SELECT pi.product_id,
      SUM(pi.quantity * i.cost_per_unit) AS ingredient_cost
    FROM product_ingredients pi
      JOIN ingredients i ON i.id = pi.ingredient_id
    GROUP BY pi.product_id
  ) ing_cost ON ing_cost.product_id = p.id
  LEFT JOIN cost_configs cc ON cc.product_id = p.id
WHERE p.active = true;
