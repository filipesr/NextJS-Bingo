# 🎲 NextJS Bingo

Aplicação web completa de Bingo desenvolvida com Next.js 15, TypeScript e Tailwind CSS. Suporta duas modalidades: **Bingo 75 bolas (Americano)** e **Bingo 90 bolas (Britânico)**.

## ✨ Características

### 🎯 Funcionalidades Principais

- **Duas Modalidades Completas**
  - Bingo 75 bolas (grade 5×5 com FREE space)
  - Bingo 90 bolas (grade 9×3)

- **Gerador de Cartelas Aleatórias** 🆕
  - Geração automática de cartelas válidas
  - Códigos únicos e compartilháveis
  - Redirecionamento automático

- **Sorteio de Números**
  - Interface intuitiva de sorteio
  - Histórico completo de números
  - Progresso visual em tempo real
  - Auto-save no localStorage

- **Cartelas Individuais**
  - Sistema de códigos únicos e compactos
  - Marcação manual por clique
  - Sincronização automática com sorteio
  - Detecção automática de vitória
  - Estatísticas em tempo real
  - Banner BINGO! dismissível

- **Design Moderno**
  - Mobile-first e totalmente responsivo
  - Temas claro e escuro com contraste WCAG AA
  - Animações suaves
  - Acessível

### 🔧 Tecnologias

- **Framework**: Next.js 15 (App Router)
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS
- **Temas**: next-themes
- **Persistência**: LocalStorage API

## 🚀 Como Usar

### Instalação

\`\`\`bash
# Clone o repositório
git clone <repository-url>
cd NextJS-Bingo

# Instale as dependências
npm install

# Rode em desenvolvimento
npm run dev

# Build para produção
npm run build
npm start
\`\`\`

### Jogar Bingo

1. **Inicie um Sorteio**
   - Acesse `/sort`
   - Escolha a modalidade (75 ou 90 bolas)
   - Clique em "Sortear Próximo" para cada número

2. **Gere ou Use Cartelas**

   **Opção A - Gerar Cartela Aleatória** (Recomendado):
   - Acesse `/card`
   - Escolha a modalidade (75 ou 90 bolas)
   - Clique em "Gerar Cartela"
   - Você será redirecionado automaticamente para sua cartela única

   **Opção B - Usar Código Existente**:
   - Acesse diretamente a URL com o código:
     - **90 bolas**: \`/card/123+45+6+78+0+12+345+67+89\`
     - **75 bolas**: \`/card/1359B248AC78DE135AD39BEF\`

3. **Jogue**
   - Cada jogador acessa sua cartela pelo código único
   - Marque os números sorteados clicando neles
   - Acompanhe estatísticas em tempo real
   - O sistema detecta vitória automaticamente e exibe "BINGO!"
   - Feche o banner de vitória clicando no X

## 📝 Sistema de Códigos

### Bingo 90 Bolas (Britânico)

**Formato**: 9 grupos decimais separados por \`+\`

\`\`\`
/card/123+45+6+78+0+12+345+67+89
\`\`\`

- Cada grupo representa uma dezena (0-9, 10-19, ..., 80-89)
- Cada dígito no grupo é relativo à base do grupo
- Dígito "0" representa o múltiplo de 10 (10, 20, 30, etc)
- Total: 15 números distribuídos pelos 9 grupos

**Exemplo de decodificação**:
- Grupo 1: "123" → 1, 2, 3
- Grupo 2: "45" → 14, 15
- Grupo 5: "0" → 50

### Bingo 75 Bolas (Americano)

**Formato**: 24 caracteres hexadecimais contínuos

\`\`\`
/card/1359B248AC78DE135AD39BEF
\`\`\`

- Posições fixas: [0-4]=B, [5-9]=I, [10-13]=N, [14-18]=G, [19-23]=O
- Range hex: 1-F (não usa 0)
- Base incrementa +15 por grupo
- Total: 24 números + FREE space no centro

**Exemplo de decodificação**:
- B [0-4]: "1359B" → 1, 3, 5, 9, 11
- I [5-9]: "248AC" → 17, 19, 23, 25, 27
- N [10-13]: "78DE" → 37, 38, 43, 44 + FREE

## 📁 Estrutura do Projeto

\`\`\`
NextJS-Bingo/
├── src/
│   ├── app/                      # Rotas Next.js (App Router)
│   │   ├── page.tsx              # Home com explicações
│   │   ├── sort/                 # Página de sorteio
│   │   └── card/
│   │       ├── page.tsx          # Gerador de cartelas 🆕
│   │       └── [cod]/page.tsx    # Página de cartela dinâmica
│   ├── components/               # Componentes React
│   │   ├── BingoCard/            # Componentes de cartela
│   │   ├── StatsPanel/           # Painel de estatísticas
│   │   ├── ThemeToggle.tsx       # Toggle tema claro/escuro
│   │   └── ThemeProvider.tsx
│   ├── lib/                      # Lógica de negócio
│   │   ├── bingo/                # Core do jogo
│   │   │   ├── types.ts          # Tipos TypeScript
│   │   │   ├── encoder.ts        # Codificação de cartelas
│   │   │   ├── decoder.ts        # Decodificação de cartelas
│   │   │   ├── validator.ts      # Validação
│   │   │   ├── generator.ts      # Geração de números de sorteio
│   │   │   ├── generator-cards.ts # Geração de cartelas 🆕
│   │   │   └── patterns.ts       # Detecção de vitória
│   │   ├── storage/              # LocalStorage utilities
│   │   └── utils.ts              # Funções auxiliares
│   ├── hooks/                    # Hooks customizados
│   │   ├── useBingoSort.ts       # Hook de sorteio
│   │   ├── useBingoCard.ts       # Hook de cartela
│   │   └── useLocalStorage.ts    # Hook genérico
│   └── styles/
│       └── globals.css           # Estilos globais
├── RESEARCH.md                   # Pesquisa sobre Bingo
├── PROJECT_PLAN.md               # Plano de desenvolvimento
└── README.md                     # Este arquivo
\`\`\`

## 🎮 Padrões de Vitória

### Bingo 75 Bolas
- Linha horizontal
- Linha vertical
- Diagonais
- Quatro cantos
- Padrão X
- Blackout (cartela cheia)

### Bingo 90 Bolas
- 1 linha completa
- 2 linhas completas
- Full House (cartela cheia)

## ♿ Acessibilidade

- Contraste WCAG AA em todos os elementos
- Aria labels apropriados
- Navegação por teclado
- Suporte a leitores de tela
- Touch targets adequados (≥44px)

## 🔮 Roadmap Futuro

- [x] Gerador de cartelas aleatórias ✅
- [ ] Múltiplas cartelas simultâneas
- [ ] Padrões de vitória avançados e customizáveis
- [ ] Melhorias de UX (animações, sons, voz)
- [ ] PWA (Progressive Web App)
- [ ] Multiplayer online com WebSockets
- [ ] Sistema de autenticação e ranking
- [ ] Chat entre jogadores

## 📄 Licença

Este projeto foi desenvolvido como demonstração educacional.

## 🤖 Desenvolvimento

Desenvolvido com Next.js 15 e TypeScript.

---

**🎲 Divirta-se jogando Bingo!**
