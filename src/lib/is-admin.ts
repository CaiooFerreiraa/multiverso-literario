import { neonClient } from "@/infrastructure/database/neon";

/**
 * Verifica se um usuário é administrador.
 *
 * A verificação é feita em duas etapas (OR):
 * 1. Verificação via variável de ambiente ADMIN_EMAIL (master admin)
 * 2. Verificação via tabela `admin` no banco de dados (admins cadastrados)
 *
 * @param params.email - Email do usuário (para a verificação via env)
 * @param params.userId - ID do usuário no banco (para a verificação via tabela admin)
 */
export async function isAdmin({
  email,
  userId,
}: {
  email: string | null | undefined;
  userId: number | string | null | undefined;
}): Promise<boolean> {
  // 1. Verificação via env (master admin)
  if (email && process.env.ADMIN_EMAIL && email === process.env.ADMIN_EMAIL) {
    return true;
  }

  // 2. Verificação via banco de dados
  if (!userId) return false;

  try {
    const result = await neonClient.query<{ id_user: number }>(
      `SELECT id_user FROM admin WHERE id_user = $1 LIMIT 1`,
      [Number(userId)]
    );
    return result.length > 0;
  } catch (error) {
    console.error("[isAdmin] Erro ao verificar admin no banco:", error);
    return false;
  }
}
