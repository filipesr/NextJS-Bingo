import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Collapsible } from "@/components/ui/Collapsible";

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

        {/* Atalhos Rápidos */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Acesso Rápido</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link
              href="/sort"
              className="flex items-center gap-4 bg-card hover:bg-accent/10 border-2 border-border hover:border-accent p-6 rounded-lg transition-colors group"
            >
              <div className="text-5xl">🎰</div>
              <div>
                <h3 className="font-bold text-xl mb-1 group-hover:text-accent transition-colors">Sorteio</h3>
                <p className="text-sm text-muted-foreground">
                  Sortear números para o jogo
                </p>
              </div>
            </Link>
            <Link
              href="/card"
              className="flex items-center gap-4 bg-card hover:bg-accent/10 border-2 border-border hover:border-accent p-6 rounded-lg transition-colors group"
            >
              <div className="text-5xl">🎲</div>
              <div>
                <h3 className="font-bold text-xl mb-1 group-hover:text-accent transition-colors">Cartela</h3>
                <p className="text-sm text-muted-foreground">
                  Gerar cartela aleatória
                </p>
              </div>
            </Link>
          </div>
        </section>

        {/* Regras do Jogo */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">📜 Regras do Jogo</h2>

          <div className="space-y-8">
            {/* Bingo 75 Bolas */}
            <div className="bg-card border-2 border-border rounded-lg p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="text-4xl">🇺🇸</div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Bingo 75 Bolas (Americano)</h3>
                  <p className="text-sm text-muted-foreground">
                    Modalidade clássica americana com cartelas B-I-N-G-O
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">🎯 Cartela</h4>
                  <ul className="space-y-1 text-sm ml-4">
                    <li>• Grade 5×5 com 25 espaços</li>
                    <li>• 24 números aleatórios + 1 espaço FREE no centro</li>
                    <li>• Colunas organizadas por B-I-N-G-O</li>
                    <li>• B (1-15), I (16-30), N (31-45), G (46-60), O (61-75)</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">🏆 Como Ganhar</h4>
                  <ul className="space-y-1 text-sm ml-4">
                    <li>• Complete qualquer linha horizontal</li>
                    <li>• Complete qualquer linha vertical</li>
                    <li>• Complete qualquer diagonal</li>
                    <li>• Complete padrões especiais (X, 4 cantos, etc.)</li>
                    <li>• <strong>Blackout:</strong> preencha toda a cartela (25 espaços)</li>
                  </ul>
                </div>

                <div className="bg-info/10 border-2 border-info rounded p-3">
                  <p className="text-sm">
                    <strong>💡 Dica:</strong> O espaço FREE no centro já conta como marcado!
                  </p>
                </div>
              </div>
            </div>

            {/* Bingo 90 Bolas */}
            <div className="bg-card border-2 border-border rounded-lg p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="text-4xl">🇬🇧</div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Bingo 90 Bolas (Britânico)</h3>
                  <p className="text-sm text-muted-foreground">
                    Modalidade tradicional britânica com cartelas compactas
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">🎯 Cartela</h4>
                  <ul className="space-y-1 text-sm ml-4">
                    <li>• Grade 9×3 (9 colunas, 3 linhas)</li>
                    <li>• 15 números distribuídos pela grade</li>
                    <li>• 5 números por linha, 4 espaços vazios</li>
                    <li>• Colunas organizadas por dezenas (1-9, 10-19, ..., 80-90)</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">🏆 Como Ganhar</h4>
                  <ul className="space-y-1 text-sm ml-4">
                    <li>• <strong>1 Linha:</strong> complete qualquer linha horizontal (5 números)</li>
                    <li>• <strong>2 Linhas:</strong> complete duas linhas horizontais (10 números)</li>
                    <li>• <strong>Full House:</strong> complete as 3 linhas (15 números) - VITÓRIA!</li>
                  </ul>
                </div>

                <div className="bg-warning/10 border-2 border-warning rounded p-3">
                  <p className="text-sm">
                    <strong>⚠️ Importante:</strong> Apenas o Full House (3 linhas completas) conta como vitória oficial!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Como Jogar */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">🎮 Como Jogar</h2>

          <Collapsible title="Instruções passo a passo" defaultOpen={true}>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Inicie o Sorteio</h3>
                  <p className="text-sm text-muted-foreground">
                    Acesse a <Link href="/sort" className="text-primary underline hover:no-underline">página de sorteio</Link> e
                    escolha a modalidade (75 ou 90 bolas). Clique em &quot;Sortear Próximo&quot; para cada número.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Gere ou Use uma Cartela</h3>
                  <p className="text-sm text-muted-foreground">
                    Acesse a <Link href="/card" className="text-primary underline hover:no-underline">página de geração</Link> para
                    criar uma cartela aleatória. Cada cartela terá um código único na URL que pode ser compartilhado.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Marque os Números</h3>
                  <p className="text-sm text-muted-foreground">
                    Quando um número for sorteado, clique nele em sua cartela para marcá-lo.
                    Números sorteados mas não marcados aparecem com borda vermelha.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-success text-success-foreground rounded-full flex items-center justify-center font-bold">
                  ✓
                </div>
                <div>
                  <h3 className="font-semibold mb-1">BINGO!</h3>
                  <p className="text-sm text-muted-foreground">
                    Complete o padrão vencedor e o botão &quot;BINGO!&quot; aparecerá automaticamente.
                    Suas marcações são salvas automaticamente no navegador.
                  </p>
                </div>
              </div>
            </div>
          </Collapsible>
        </section>

        {/* Footer */}
        <footer className="text-center text-sm text-muted-foreground pt-8 border-t border-border">
          <p>Desenvolvido com Next.js 15 e Tailwind CSS</p>
        </footer>
      </div>
    </main>
  );
}
