import { createServerClient as createSSRClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Cria um Supabase client server-side com cookies de auth.
 * Usa @supabase/ssr para manter a sessão autenticada.
 */
export function createAdminClient() {
  const cookieStore = cookies();

  return createSSRClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Cookie set pode falhar em Server Components (read-only).
            // Isso é seguro — a sessão já foi validada no middleware.
          }
        },
      },
    },
  );
}

/**
 * Verifica se o usuário está autenticado.
 * Retorna o user ou lança erro.
 */
export async function requireAuth() {
  const supabase = createAdminClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("Não autorizado");
  }

  return { supabase, user };
}
