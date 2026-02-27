import Image from "next/image";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dolce-marrom text-white py-16" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Logo e tagline */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Image
                src="/icon.png"
                alt="Logo Dolce Neves"
                width={40}
                height={40}
                className="rounded-full"
              />
              <h2 className="font-display text-2xl font-bold">Dolce Neves</h2>
            </div>
            <p className="text-white/50 text-sm font-body tracking-widest uppercase mb-4">
              Gourmet Sweets
            </p>
            <p className="font-body text-white/70 leading-relaxed max-w-xs">
              Doces artesanais gourmet feitos com paixao e ingredientes
              selecionados. Cada mordida, uma experiencia unica.
            </p>
          </div>

          {/* Links rapidos */}
          <div>
            <h3 className="font-display text-lg font-semibold mb-4">Links</h3>
            <ul className="space-y-3 font-body">
              <li>
                <a
                  href="/cardapio"
                  className="text-white/70 hover:text-dolce-rosa transition-colors duration-200"
                >
                  Cardapio
                </a>
              </li>
              <li>
                <a
                  href="/monte-sua-caixa"
                  className="text-white/70 hover:text-dolce-rosa transition-colors duration-200"
                >
                  Monte sua Caixa
                </a>
              </li>
              <li>
                <a
                  href="/calculadora"
                  className="text-white/70 hover:text-dolce-rosa transition-colors duration-200"
                >
                  Calculadora de Festas
                </a>
              </li>
              <li>
                <a
                  href="#produtos"
                  className="text-white/70 hover:text-dolce-rosa transition-colors duration-200"
                >
                  Nossos Doces
                </a>
              </li>
              <li>
                <a
                  href="#como-funciona"
                  className="text-white/70 hover:text-dolce-rosa transition-colors duration-200"
                >
                  Como Funciona
                </a>
              </li>
              <li>
                <a
                  href="#sobre"
                  className="text-white/70 hover:text-dolce-rosa transition-colors duration-200"
                >
                  Sobre Nos
                </a>
              </li>
              <li>
                <a
                  href="#depoimentos"
                  className="text-white/70 hover:text-dolce-rosa transition-colors duration-200"
                >
                  Depoimentos
                </a>
              </li>
              <li>
                <a
                  href="/corporativo"
                  className="text-white/70 hover:text-dolce-rosa transition-colors duration-200"
                >
                  Corporativo
                </a>
              </li>
            </ul>
          </div>

          {/* Contato e redes sociais */}
          <div>
            <h3 className="font-display text-lg font-semibold mb-4">Contato</h3>
            <address className="not-italic font-body text-white/70 space-y-3">
              <p className="flex items-start gap-3">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  className="mt-0.5 shrink-0"
                  aria-hidden="true"
                >
                  <path
                    d="M10 1.5C6.69 1.5 4 4.19 4 7.5C4 12.25 10 18.5 10 18.5C10 18.5 16 12.25 16 7.5C16 4.19 13.31 1.5 10 1.5ZM10 9.75C8.76 9.75 7.75 8.74 7.75 7.5C7.75 6.26 8.76 5.25 10 5.25C11.24 5.25 12.25 6.26 12.25 7.5C12.25 8.74 11.24 9.75 10 9.75Z"
                    fill="#C96B7A"
                  />
                </svg>
                Rua RB-18, Residencial Buriti
                <br />
                Senador Canedo, GO - CEP 75260459
              </p>
              <p className="flex items-center gap-3">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  className="shrink-0"
                  aria-hidden="true"
                >
                  <path
                    d="M16.6 13.13L14.26 12.87C13.76 12.81 13.27 12.97 12.91 13.33L11.37 14.87C9.19 13.76 7.44 12.02 6.33 9.83L7.87 8.29C8.23 7.93 8.39 7.44 8.33 6.94L8.07 4.61C7.96 3.7 7.19 3 6.27 3H5.12C4.09 3 3.22 3.87 3.29 4.9C3.77 12.26 9.74 18.22 17.1 18.71C18.13 18.78 19 17.91 19 16.88V15.73C19 14.82 18.31 14.05 17.4 13.94L16.6 13.13Z"
                    fill="#C96B7A"
                  />
                </svg>
                (62) 98146-0127
              </p>
            </address>

            {/* Redes sociais */}
            <div className="flex gap-4 mt-6">
              <a
                href="https://instagram.com/dolceneves"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Siga a Dolce Neves no Instagram"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-dolce-rosa transition-colors duration-200"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="white"
                  aria-hidden="true"
                >
                  <path d="M12 2C14.717 2 15.056 2.01 16.122 2.06C17.187 2.11 17.912 2.277 18.55 2.525C19.21 2.779 19.766 3.123 20.322 3.678C20.8305 4.1779 21.224 4.78259 21.475 5.45C21.722 6.087 21.89 6.813 21.94 7.878C21.987 8.944 22 9.283 22 12C22 14.717 21.99 15.056 21.94 16.122C21.89 17.187 21.722 17.912 21.475 18.55C21.2247 19.2178 20.8311 19.8226 20.322 20.322C19.822 20.8303 19.2173 21.2238 18.55 21.475C17.913 21.722 17.187 21.89 16.122 21.94C15.056 21.987 14.717 22 12 22C9.283 22 8.944 21.99 7.878 21.94C6.813 21.89 6.088 21.722 5.45 21.475C4.78233 21.2245 4.17753 20.8309 3.678 20.322C3.16941 19.8222 2.77593 19.2175 2.525 18.55C2.277 17.913 2.11 17.187 2.06 16.122C2.013 15.056 2 14.717 2 12C2 9.283 2.01 8.944 2.06 7.878C2.11 6.812 2.277 6.088 2.525 5.45C2.77524 4.78218 3.1688 4.17732 3.678 3.678C4.17767 3.16923 4.78243 2.77573 5.45 2.525C6.088 2.277 6.812 2.11 7.878 2.06C8.944 2.013 9.283 2 12 2ZM12 7C10.6739 7 9.40215 7.52678 8.46447 8.46447C7.52678 9.40215 7 10.6739 7 12C7 13.3261 7.52678 14.5979 8.46447 15.5355C9.40215 16.4732 10.6739 17 12 17C13.3261 17 14.5979 16.4732 15.5355 15.5355C16.4732 14.5979 17 13.3261 17 12C17 10.6739 16.4732 9.40215 15.5355 8.46447C14.5979 7.52678 13.3261 7 12 7ZM18.5 6.75C18.5 6.41848 18.3683 6.10054 18.1339 5.86612C17.8995 5.6317 17.5815 5.5 17.25 5.5C16.9185 5.5 16.6005 5.6317 16.3661 5.86612C16.1317 6.10054 16 6.41848 16 6.75C16 7.08152 16.1317 7.39946 16.3661 7.63388C16.6005 7.8683 16.9185 8 17.25 8C17.5815 8 17.8995 7.8683 18.1339 7.63388C18.3683 7.39946 18.5 7.08152 18.5 6.75ZM12 9C12.7956 9 13.5587 9.31607 14.1213 9.87868C14.6839 10.4413 15 11.2044 15 12C15 12.7956 14.6839 13.5587 14.1213 14.1213C13.5587 14.6839 12.7956 15 12 15C11.2044 15 10.4413 14.6839 9.87868 14.1213C9.31607 13.5587 9 12.7956 9 12C9 11.2044 9.31607 10.4413 9.87868 9.87868C10.4413 9.31607 11.2044 9 12 9Z" />
                </svg>
              </a>
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5511999999999"}?text=${encodeURIComponent("Ola! Vi o site da Dolce Neves e gostaria de fazer um pedido.")}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Entre em contato pelo WhatsApp"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-dolce-rosa transition-colors duration-200"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="white"
                  aria-hidden="true"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Divisor */}
        <div className="border-t border-white/10 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-body text-white/50 text-sm">
              &copy; {currentYear} Dolce Neves — Gourmet Sweets. Todos os
              direitos reservados.
            </p>
            <p className="font-body text-white/50 text-sm">
              Senador Canedo, GO — Brasil
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
