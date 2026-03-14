import { neonClient } from "@/infrastructure/database/neon";

/**
 * Verifica se um usuário é administrador.
 *
 * A verificação é feita exclusivamente via tabela `admin` no banco de dados.
 *
 * @param params.userId - ID do usuário no banco (verificação via tabela admin)
 */
export async function isAdmin({
  userId,
}: {
  userId: number | string | null | undefined;
}): Promise<boolean> {
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
