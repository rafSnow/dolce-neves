-- =============================================
-- Migration 002: Corporate Orders
-- Tabela para pedidos corporativos / atacado
-- =============================================
CREATE TABLE IF NOT EXISTS corporate_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  company TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  estimated_quantity INTEGER NOT NULL CHECK (estimated_quantity >= 50),
  event_date DATE NOT NULL,
  event_type TEXT NOT NULL CHECK (
    event_type IN (
      'casamento',
      'aniversario',
      'corporativo',
      'formatura',
      'outro'
    )
  ),
  message TEXT,
  marketing_consent BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'novo' CHECK (
    status IN (
      'novo',
      'em_analise',
      'orcamento_enviado',
      'fechado',
      'cancelado'
    )
  ),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
-- Indexes para painel admin
CREATE INDEX idx_corporate_orders_status ON corporate_orders (status);
CREATE INDEX idx_corporate_orders_created_at ON corporate_orders (created_at DESC);
CREATE INDEX idx_corporate_orders_event_date ON corporate_orders (event_date);
-- RLS
ALTER TABLE corporate_orders ENABLE ROW LEVEL SECURITY;
-- Qualquer visitante pode enviar (INSERT público)
CREATE POLICY "public_insert_corporate_orders" ON corporate_orders FOR
INSERT TO anon,
  authenticated WITH CHECK (true);
-- Somente admin autenticado pode ler
CREATE POLICY "admin_select_corporate_orders" ON corporate_orders FOR
SELECT TO authenticated USING (true);
-- Somente admin autenticado pode atualizar (status, etc)
CREATE POLICY "admin_update_corporate_orders" ON corporate_orders FOR
UPDATE TO authenticated USING (true) WITH CHECK (true);
-- Trigger para updated_at automático
CREATE OR REPLACE FUNCTION update_corporate_orders_updated_at() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER trigger_corporate_orders_updated_at BEFORE
UPDATE ON corporate_orders FOR EACH ROW EXECUTE FUNCTION update_corporate_orders_updated_at();
