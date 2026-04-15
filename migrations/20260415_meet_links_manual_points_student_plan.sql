-- 2026-04-15
-- Ajustes para encontros via Google Meet e padronizacao dos usuarios no Plano Meu Aluno.

ALTER TABLE scheduled_rooms
  ADD COLUMN IF NOT EXISTS meeting_url text;

WITH student_plan AS (
  SELECT id_plan, duraction, COALESCE(value, 0) AS value
  FROM plan_expanded
  WHERE title ILIKE 'Plano Meu Aluno'
    AND is_active = true
  ORDER BY id_plan DESC
  LIMIT 1
),
latest_buy AS (
  SELECT DISTINCT ON (id_user) id_user, id_plan
  FROM buy
  WHERE status = 'concluido'
  ORDER BY id_user, created_at DESC, id_buy DESC
)
INSERT INTO buy (
  id_plan,
  method_payment,
  price_paid,
  status,
  id_user,
  created_at,
  maturity
)
SELECT
  student_plan.id_plan,
  'pix',
  student_plan.value,
  'concluido',
  users.id_user,
  CURRENT_DATE,
  CURRENT_DATE + student_plan.duraction
FROM users
CROSS JOIN student_plan
LEFT JOIN latest_buy ON latest_buy.id_user = users.id_user
WHERE COALESCE(latest_buy.id_plan, 0) <> student_plan.id_plan;
