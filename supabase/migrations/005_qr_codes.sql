-- ============================================
-- Dolce Neves — QR Codes & Feedbacks
-- Migration 005
-- ============================================
-- QR Codes (um por pedido)
CREATE TABLE IF NOT EXISTS qr_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL UNIQUE REFERENCES orders(id) ON DELETE CASCADE,
  slug TEXT NOT NULL UNIQUE,
  discount_code TEXT,
  discount_percent SMALLINT DEFAULT 0 CHECK (
    discount_percent >= 0
    AND discount_percent <= 100
  ),
  discount_expires_at TIMESTAMPTZ,
  scanned_at TIMESTAMPTZ,
  feedback_submitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_qr_codes_slug ON qr_codes(slug);
CREATE INDEX IF NOT EXISTS idx_qr_codes_order_id ON qr_codes(order_id);
-- Auto updated_at
CREATE TRIGGER qr_codes_updated_at BEFORE
UPDATE ON qr_codes FOR EACH ROW EXECUTE FUNCTION update_updated_at();
-- RLS
ALTER TABLE qr_codes ENABLE ROW LEVEL SECURITY;
-- Admin autenticado: acesso total
CREATE POLICY "Admin pode gerenciar qr_codes" ON qr_codes FOR ALL TO authenticated USING (true) WITH CHECK (true);
-- Público pode ler por slug (para a página de feedback)
CREATE POLICY "Público pode ler qr_code por slug" ON qr_codes FOR
SELECT TO anon USING (true);
-- ============================================
-- Feedbacks
-- ============================================
CREATE TABLE IF NOT EXISTS feedbacks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  qr_code_id UUID NOT NULL UNIQUE REFERENCES qr_codes(id) ON DELETE CASCADE,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  client_name TEXT NOT NULL,
  nps_score SMALLINT NOT NULL CHECK (
    nps_score >= 1
    AND nps_score <= 5
  ),
  comment TEXT,
  would_recommend BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_feedbacks_qr_code_id ON feedbacks(qr_code_id);
CREATE INDEX IF NOT EXISTS idx_feedbacks_order_id ON feedbacks(order_id);
CREATE INDEX IF NOT EXISTS idx_feedbacks_nps_score ON feedbacks(nps_score);
-- RLS
ALTER TABLE feedbacks ENABLE ROW LEVEL SECURITY;
-- Público pode inserir feedback (cliente envia)
CREATE POLICY "Público pode inserir feedback" ON feedbacks FOR
INSERT TO anon WITH CHECK (true);
-- Admin: leitura total
CREATE POLICY "Admin pode ler feedbacks" ON feedbacks FOR ALL TO authenticated USING (true) WITH CHECK (true);
-- ============================================
-- View: qr_code_summary (para painel admin)
-- ============================================
CREATE OR REPLACE VIEW qr_code_summary AS
SELECT qr.id AS qr_code_id,
  qr.slug,
  qr.order_id,
  o.client_name,
  o.delivery_date,
  qr.scanned_at IS NOT NULL AS scanned,
  qr.feedback_submitted_at IS NOT NULL AS feedback_submitted,
  f.nps_score,
  f.comment,
  f.would_recommend,
  qr.discount_code,
  qr.discount_percent,
  qr.discount_expires_at,
  CASE
    WHEN qr.discount_expires_at IS NOT NULL
    AND qr.discount_expires_at < NOW() THEN true
    ELSE false
  END AS discount_expired,
  qr.created_at
FROM qr_codes qr
  LEFT JOIN orders o ON o.id = qr.order_id
  LEFT JOIN feedbacks f ON f.qr_code_id = qr.id
ORDER BY qr.created_at DESC;
