import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">🎲 Bingo Game</h1>
          <ThemeToggle />
        </header>

        {/* Introdução */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Bem-vindo ao Bingo!</h2>
          <p className="text-lg mb-4">
            Jogue Bingo online com duas modalidades: <strong>75 bolas (Americano)</strong> e{" "}
            <strong>90 bolas (Britânico)</strong>. Esta aplicação oferece ferramentas separadas
            para sorteio e cartelas, perfeita para jogar com amigos!
          </p>
        </section>

        {/* Modalidades */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Modalidades</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Bingo 75 */}
            <div className="border border-gray-300 dark:border-gray-700 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">🇺🇸 Bingo 75 Bolas</h3>
              <ul className="space-y-2 text-sm">
                <li>• Cartela: 5×5 (24 números + FREE)</li>
                <li>• Colunas: B-I-N-G-O</li>
                <li>• Números: 1-75</li>
                <li>• Padrões: linha, diagonal, X, etc</li>
              </ul>
            </div>

            {/* Bingo 90 */}
            <div className="border border-gray-300 dark:border-gray-700 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">🇬🇧 Bingo 90 Bolas</h3>
              <ul className="space-y-2 text-sm">
                <li>• Cartela: 9×3 (15 números)</li>
                <li>• 9 colunas por dezenas</li>
                <li>• Números: 1-90</li>
                <li>• Padrões: 1 linha, 2 linhas, full house</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Como Usar */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Como Usar</h2>

          <div className="space-y-6">
            {/* Passo 1: Sorteio */}
            <div>
              <h3 className="text-lg font-semibold mb-2">1️⃣ Sortear Números</h3>
              <p className="mb-3">
                Acesse a página de <strong>sorteio</strong> para começar a sortear números.
                Escolha a modalidade (75 ou 90 bolas) e clique em &quot;Sortear&quot; para cada número.
              </p>
              <Link
                href="/sort"
                className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition"
              >
                🎰 Ir para Sorteio
              </Link>
            </div>

            {/* Passo 2: Cartelas */}
            <div>
              <h3 className="text-lg font-semibold mb-2">2️⃣ Usar Cartelas</h3>
              <p className="mb-3">
                Cada jogador acessa sua cartela usando um <strong>código único</strong>.
                A cartela sincroniza automaticamente com os números sorteados.
              </p>
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                <p className="font-mono text-sm mb-2">
                  <strong>Formato 90 bolas:</strong> /card/123+45+6+78+0+12+345+67+89
                </p>
                <p className="font-mono text-sm">
                  <strong>Formato 75 bolas:</strong> /card/1359B248AC78DE135AD39BEF
                </p>
              </div>
            </div>

            {/* Passo 3: Jogar */}
            <div>
              <h3 className="text-lg font-semibold mb-2">3️⃣ Jogar</h3>
              <p>
                Marque os números sorteados manualmente em sua cartela. O sistema detecta
                automaticamente quando você completa um padrão e exibe o botão <strong>BINGO!</strong>
              </p>
            </div>
          </div>
        </section>

        {/* Sistema de Códigos */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Sistema de Códigos</h2>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Bingo 90 Bolas (Britânico)</h3>
              <p className="text-sm mb-2">
                9 grupos decimais separados por &quot;+&quot;. Cada grupo representa uma dezena.
              </p>
              <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded font-mono text-xs">
                Exemplo: 123+45+6+78+0+12+345+67+89
                <br />
                • Grupo 1: &quot;123&quot; → 1, 2, 3
                <br />
                • Grupo 2: &quot;45&quot; → 14, 15
                <br />
                • Grupo 5: &quot;0&quot; → 50
                <br />• Total: 15 números
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Bingo 75 Bolas (Americano)</h3>
              <p className="text-sm mb-2">
                24 caracteres hexadecimais contínuos (1-F). Representa as 5 colunas B-I-N-G-O.
              </p>
              <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded font-mono text-xs">
                Exemplo: 1359B248AC78DE135AD39BEF
                <br />
                • B [0-4]: &quot;1359B&quot; → 1, 3, 5, 9, 11
                <br />
                • I [5-9]: &quot;248AC&quot; → 17, 19, 23, 25, 27
                <br />
                • N [10-13]: &quot;78DE&quot; → 37, 38, 43, 44 + FREE
                <br />• Total: 24 números + FREE
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center text-sm text-gray-500 dark:text-gray-400 pt-8 border-t border-gray-300 dark:border-gray-700">
          <p>Desenvolvido com Next.js 15 e Tailwind CSS</p>
        </footer>
      </div>
    </main>
  );
}
