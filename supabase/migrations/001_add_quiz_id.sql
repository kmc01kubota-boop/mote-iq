-- ============================================
-- Migration: quiz_id カラム追加
-- 複数の診断コンテンツを識別するためのカラム
-- 既存データはすべて 'mote-iq' で初期化
-- ============================================

-- attempts テーブルに quiz_id を追加
ALTER TABLE attempts
  ADD COLUMN IF NOT EXISTS quiz_id text NOT NULL DEFAULT 'mote-iq';

-- purchases テーブルに quiz_id を追加
ALTER TABLE purchases
  ADD COLUMN IF NOT EXISTS quiz_id text NOT NULL DEFAULT 'mote-iq';

-- パフォーマンス用インデックス (quiz_id でのフィルタリングを高速化)
CREATE INDEX IF NOT EXISTS idx_attempts_quiz_id ON attempts(quiz_id);
CREATE INDEX IF NOT EXISTS idx_purchases_quiz_id ON purchases(quiz_id);

-- 複合インデックス (ダッシュボード集計用: quiz_id + 期間)
CREATE INDEX IF NOT EXISTS idx_attempts_quiz_created
  ON attempts(quiz_id, created_at);
CREATE INDEX IF NOT EXISTS idx_purchases_quiz_status_created
  ON purchases(quiz_id, status, created_at);
