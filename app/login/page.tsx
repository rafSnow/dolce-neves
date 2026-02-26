"use client";

import { supabase } from "@/lib/supabase";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError("E-mail ou senha incorretos. Tente novamente.");
      setLoading(false);
      return;
    }

    router.push(redirect);
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-dolce-creme flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <Image
            src="/icon.png"
            alt="Logo Dolce Neves"
            width={72}
            height={72}
            className="mx-auto mb-3 rounded-full"
            priority
          />
          <h1 className="font-display text-3xl text-dolce-marrom font-bold">
            Dolce Neves
          </h1>
          <p className="font-body text-sm text-dolce-marrom/50 tracking-widest uppercase mt-1">
            Painel Administrativo
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-dolce-marrom/5 p-8">
          <h2 className="font-display text-xl text-dolce-marrom mb-6 text-center">
            Entrar
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-body font-medium text-dolce-marrom mb-1.5"
              >
                E-mail
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="admin@dolceneves.com.br"
                className="w-full px-4 py-3 rounded-xl border border-dolce-marrom/20 bg-white font-body text-sm text-dolce-marrom placeholder:text-dolce-marrom/40 focus:outline-none focus:ring-2 focus:ring-dolce-rosa/40 focus:border-dolce-rosa transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-body font-medium text-dolce-marrom mb-1.5"
              >
                Senha
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-dolce-marrom/20 bg-white font-body text-sm text-dolce-marrom placeholder:text-dolce-marrom/40 focus:outline-none focus:ring-2 focus:ring-dolce-rosa/40 focus:border-dolce-rosa transition-colors"
              />
            </div>

            {error && (
              <div
                role="alert"
                className="bg-red-50 border border-red-200 text-red-700 text-sm font-body rounded-xl px-4 py-3"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-dolce-rosa text-white font-body font-semibold py-3 rounded-xl hover:bg-dolce-rosa/90 transition-colors duration-300 disabled:opacity-60 disabled:cursor-wait flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Entrando...
                </>
              ) : (
                "Entrar"
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-dolce-marrom/30 font-body mt-6">
          Acesso restrito à administração.
        </p>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-dolce-creme flex items-center justify-center">
          <div className="animate-pulse w-full max-w-sm px-4">
            <div className="h-10 bg-dolce-marrom/10 rounded w-40 mx-auto mb-8" />
            <div className="bg-white rounded-2xl p-8 h-72" />
          </div>
        </main>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
