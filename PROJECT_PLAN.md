# Plano de Desenvolvimento - NextJS Bingo

## 🎯 Visão Geral do Projeto

Aplicação NextJS para jogo de Bingo com duas variações (75 e 90 bolas), focada inicialmente em funcionalidade básica com ferramentas separadas para sorteio e cartelas.

## 📋 Escopo Definido

### Fase 1 - MVP (Mínimo Produto Viável)

#### Características Principais
- **Modalidades**: Bingo 75 bolas (Americano) e 90 bolas (Britânico)
- **Arquitetura**: Ferramentas separadas sem backend
- **Persistência**: LocalStorage para armazenamento local
- **Design**: Mobile first, temas claro/escuro, visual tradicional
- **Rotas**:
  - `/` - Página home com explicações e instruções
  - `/sort` - Página de sorteio
  - `/card/[cod]` - Página da cartela individual

#### Sistema de Códigos para Cartelas

**Bingo 90 Bolas (Britânico)**:
- Formato: 9 grupos decimais separados por `+`
- Cada grupo representa uma dezena (0-9, 10-19, 20-29, ..., 80-89)
- Dígito "0" em um grupo representa o múltiplo de 10 (10, 20, 30, etc)
- Exemplo: `/card/123+45+6+78+0+12+345+67+89`
  - Grupo 1: "123" → 1, 2, 3
  - Grupo 2: "45" → 14, 15 (4+10, 5+10)
  - Grupo 3: "6" → 26
  - Grupo 5: "0" → 50
- Total: 15 números por cartela
- Distribuição: mín 1, máx 3 por grupo (até 2 grupos podem estar vazios)

**Bingo 75 Bolas (Americano)**:
- Formato: 24 caracteres hexadecimais contínuos (SEM separador "+")
- Cada grupo representa uma coluna (B-I-N-G-O)
- Range hexadecimal: 1-F (não usa 0)
- Exemplo: `/card/1359B248AC78DE135AD39BEF`
  - Chars [0-4] (B): "1359B" → 1, 3, 5, 9, 11
  - Chars [5-9] (I): "248AC" → 17, 19, 23, 25, 27 (+15)
  - Chars [10-13] (N): "78DE" → 37, 38, 43, 44 (+30) | centro = FREE
  - Chars [14-18] (G): "135AD" → 46, 48, 50, 55, 58 (+45)
  - Chars [19-23] (O): "39BEF" → 63, 69, 71, 74, 75 (+60)
- Total: 24 números + FREE space no centro

#### Funcionalidades

**Página de Sorteio (`/sort`)**:
- Seleção da modalidade (75 ou 90 bolas)
- Botão para sortear próximo número
- Display do número atual sorteado
- Histórico de números já sorteados
- Armazenamento em localStorage
- Reset do jogo
- Responsivo (mobile first)
- Tema claro/escuro

**Página da Cartela (`/card/[cod]`)**:
- Decodificação do código da URL
- Renderização da cartela baseada na modalidade
- Marcação manual pelo usuário (clique/toque)
- Sincronização com números sorteados (localStorage)
- Indicação visual de números marcados
- **Estatísticas em tempo real**:
  - Contador de acertos (X/total + %)
  - Barra de progresso visual
  - Histórico completo de números sorteados
  - Último número sorteado em destaque
  - Diferenciação visual: números acertados vs não sorteados
- Detecção de vitória (padrões básicos)
- Botão "BINGO!" quando completar padrão
- Responsivo (mobile first)
- Tema claro/escuro

#### Stack Tecnológico - Fase 1
- **Framework**: Next.js 14+ (App Router)
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS
- **Persistência**: LocalStorage API
- **State Management**: React hooks (useState, useEffect)
- **Tema**: next-themes ou context API

---

## 🚀 Roadmap de Desenvolvimento

### Fase 1: MVP - Ferramentas Básicas
**Status**: Planejado

**Tarefas**:
1. Setup inicial do projeto Next.js
2. Configuração do Tailwind CSS e tema claro/escuro (next-themes)
3. Estrutura de pastas e arquitetura
4. Tipos TypeScript para as modalidades
5. Implementação do sistema de códigos
   - Encoder/decoder para 90 bolas (9 grupos decimais com "+")
   - Encoder/decoder hexadecimal para 75 bolas (24 chars sem "+")
6. Página Home (`/`)
   - Explicação do jogo e modalidades
   - Como usar o app (instruções)
   - Links para /sort
7. Página de Sorteio (`/sort`)
   - UI/componentes
   - Lógica de sorteio
   - LocalStorage para histórico
8. Página de Cartela (`/card/[cod]`)
   - UI/componentes para ambas modalidades
   - Decodificação de parâmetros
   - Marcação manual
   - Componente de estatísticas (acertos, %, histórico)
   - Detecção de vitória
9. Sistema de temas (claro/escuro)
10. Responsividade mobile-first
11. Testes básicos de funcionalidade

**Entregáveis**:
- Aplicação funcional com sorteio e cartelas
- Sistema de códigos operacional
- Interface responsiva com temas

---

### Fase 2: Gerador de Cartelas (Futuro)
**Status**: Planejado

**Funcionalidades**:
- Página `/generate` para gerar cartelas aleatórias
- Opção de escolher modalidade (75 ou 90 bolas)
- Geração do código automaticamente
- Opção de gerar múltiplas cartelas
- Copiar/compartilhar códigos gerados
- Imprimir cartelas (formato PDF/impressão)
- Validação de cartelas (números únicos, distribuição correta)

**Melhorias**:
- QR Code para compartilhar cartelas
- Salvar cartelas favoritas no localStorage
- Histórico de cartelas geradas

---

### Fase 3: Múltiplas Cartelas (Futuro)
**Status**: Planejado

**Funcionalidades**:
- Suporte a múltiplas cartelas na mesma sessão
- Formato: `/card/[cod1]+[cod2]+[cod3]` ou similar
- Visualização de todas as cartelas
- Marcação sincronizada em todas
- Indicador de qual cartela está mais próxima da vitória
- Navegação entre cartelas (tabs ou swipe)

---

### Fase 4: Padrões de Vitória Avançados (Futuro)
**Status**: Planejado

**Funcionalidades**:
- Configuração de padrões de vitória para 75 bolas:
  - Linha horizontal
  - Linha vertical
  - Diagonais
  - Quatro cantos
  - X, T, L, U
  - Moldura (frame)
  - Blackout (cartela cheia)
  - Padrões customizados
- Seletor de padrão na página de sorteio
- Sincronização do padrão via localStorage
- Visualização do padrão objetivo na cartela
- Validação específica por padrão

---

### Fase 5: Melhorias de UX (Futuro)
**Status**: Planejado

**Funcionalidades**:
- Animações suaves (Framer Motion)
- Sons/efeitos sonoros opcionais
- Anúncio de voz dos números (Web Speech API)
- Marcação automática (opcional)
- Modo tela cheia
- Atalhos de teclado
- Confetes/celebração ao ganhar
- Tutorial/onboarding
- Estatísticas locais (jogos ganhos, etc.)

---

### Fase 6: Modo Offline PWA (Futuro)
**Status**: Planejado

**Funcionalidades**:
- Configuração como Progressive Web App
- Service Workers
- Cache de assets
- Funcionar completamente offline
- Instalável em dispositivos móveis
- Ícones e splash screens
- Notificações (quando suportado)

---

### Fase 7: Social Local (Futuro)
**Status**: Planejado

**Funcionalidades**:
- Compartilhamento de sessão via QR Code
- Todos acessam mesmo sorteio (localStorage compartilhado via URL)
- Opção de sincronizar via broadcast channel API
- Sala local sem servidor (P2P via WebRTC ou similares)
- Lista de participantes
- Chat local

---

### Fase 8: Backend e Multiplayer (Futuro)
**Status**: Planejado

**Funcionalidades**:
- Backend com Next.js API Routes ou servidor separado
- WebSockets para tempo real
- Autenticação (NextAuth.js)
- Banco de dados (PostgreSQL/MongoDB)
- Salas de jogo online
- Matchmaking
- Chat global/por sala
- Sistema de ranking
- Histórico de jogos
- Premiações/moedas virtuais
- Sistema de amigos
- Notificações em tempo real

**Stack Adicional**:
- Prisma/Drizzle ORM
- Socket.io ou Pusher
- Redis para cache
- NextAuth.js
- Banco de dados (Vercel Postgres/Supabase)

---

### Fase 9: Monetização (Futuro)
**Status**: Planejado

**Funcionalidades**:
- Sistema de moedas virtuais
- Compra de cartelas
- Jackpots progressivos
- Torneios pagos
- Assinaturas premium
- Integração com gateways de pagamento (Stripe)
- Sistema de recompensas diárias
- Programa de afiliados

---

### Fase 10: Recursos Avançados (Futuro)
**Status**: Planejado

**Funcionalidades**:
- Transmissão ao vivo do caller (streaming)
- Moderação de salas
- Sistema anti-fraude
- Analytics e métricas
- Admin dashboard
- Customização de salas (regras, padrões)
- Bingo temático (eventos especiais)
- Integração com redes sociais
- Conquistas/badges
- Leaderboards globais

---

## 📁 Estrutura de Arquivos Planejada (Fase 1)

```
NextJS-Bingo/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Layout raiz com providers
│   │   ├── page.tsx                # Home/landing page
│   │   ├── sort/
│   │   │   └── page.tsx            # Página de sorteio
│   │   └── card/
│   │       └── [cod]/
│   │           └── page.tsx        # Página da cartela
│   ├── components/
│   │   ├── ui/                     # Componentes base (button, etc)
│   │   ├── BingoCard/
│   │   │   ├── BingoCard75.tsx    # Cartela 75 bolas
│   │   │   ├── BingoCard90.tsx    # Cartela 90 bolas
│   │   │   └── BingoCell.tsx      # Célula individual
│   │   ├── SortPanel/
│   │   │   ├── SortPanel.tsx      # Painel de sorteio
│   │   │   ├── NumberDisplay.tsx  # Display número atual
│   │   │   └── NumberHistory.tsx  # Histórico
│   │   ├── StatsPanel/
│   │   │   ├── StatsPanel.tsx     # Painel de estatísticas
│   │   │   ├── ProgressBar.tsx    # Barra de progresso
│   │   │   └── NumbersGrid.tsx    # Grid de números sorteados
│   │   └── ThemeToggle.tsx        # Toggle tema claro/escuro
│   ├── lib/
│   │   ├── bingo/
│   │   │   ├── types.ts           # Tipos TypeScript
│   │   │   ├── encoder.ts         # Codificação de cartelas
│   │   │   ├── decoder.ts         # Decodificação de cartelas
│   │   │   ├── validator.ts       # Validação de cartelas
│   │   │   ├── generator.ts       # Geração de números aleatórios
│   │   │   └── patterns.ts        # Padrões de vitória
│   │   └── storage/
│   │       └── localStorage.ts    # Utils para localStorage
│   ├── hooks/
│   │   ├── useBingoCard.ts        # Hook para cartela
│   │   ├── useBingoSort.ts        # Hook para sorteio
│   │   └── useLocalStorage.ts     # Hook para localStorage
│   └── styles/
│       └── globals.css            # Estilos globais
├── public/                        # Assets estáticos
├── RESEARCH.md                    # Este arquivo
├── PROJECT_PLAN.md                # Plano do projeto
├── README.md                      # Documentação do projeto
└── package.json

```

---

## 🎨 Guia de Design (Fase 1)

### Cores (Tema Tradicional)

**Tema Claro**:
- Background: Branco/Cinza muito claro
- Cartela: Branco com borda preta
- Números: Preto
- Números marcados: Vermelho/Azul
- Botões: Verde (sortear), Vermelho (BINGO!)
- Números sorteados: Amarelo/Dourado

**Tema Escuro**:
- Background: Preto/Cinza escuro
- Cartela: Cinza escuro com borda clara
- Números: Branco
- Números marcados: Vermelho claro/Azul claro
- Botões: Verde claro, Vermelho claro
- Números sorteados: Amarelo/Dourado

### Tipografia
- Números: Fonte grande, bold, clara (Arial, Roboto)
- Textos: Fonte sans-serif legível
- Tamanhos responsivos

### Layout
- Mobile first (320px+)
- Touch targets ≥ 44px
- Espaçamento adequado
- Orientação portrait e landscape

---

## ✅ Critérios de Aceitação - Fase 1

### Página de Sorteio
- [x] Selecionar modalidade 75 ou 90 bolas
- [x] Sortear números aleatórios sem repetição
- [x] Exibir número atual em destaque
- [x] Mostrar histórico completo
- [x] Persistir no localStorage
- [x] Reset funcional
- [x] Responsivo mobile/desktop
- [x] Tema claro/escuro funcional

### Página de Cartela
- [x] Decodificar código da URL corretamente
- [x] Renderizar cartela 75 bolas (5×5)
- [x] Renderizar cartela 90 bolas (9×3)
- [x] Marcar/desmarcar números ao clicar
- [x] Ler números sorteados do localStorage
- [x] Destacar números já sorteados
- [x] Detectar vitória (padrão básico)
- [x] Botão BINGO! aparece ao vencer
- [x] Responsivo mobile/desktop
- [x] Tema claro/escuro funcional

### Sistema de Códigos
- [x] Encoder 90 bolas funcionando
- [x] Decoder 90 bolas funcionando
- [x] Encoder 75 bolas (hex) funcionando
- [x] Decoder 75 bolas (hex) funcionando
- [x] Validação de códigos inválidos
- [x] URLs amigáveis e compartilháveis

### Qualidade
- [x] TypeScript sem erros
- [x] Sem warnings no console
- [x] Performance adequada
- [x] Acessibilidade básica (ARIA labels)
- [x] Compatibilidade cross-browser

**Status da Fase 1**: ✅ **CONCLUÍDA** (2025-12-25)

### Melhorias Adicionais Implementadas

#### Sistema de Design Tokens Semânticos (2025-12-25)
- [x] Implementado sistema completo de design tokens em HSL
- [x] 15+ tokens semânticos (primary, secondary, success, warning, destructive, info, accent)
- [x] Tokens específicos do Bingo (bingo-75-header, bingo-90-header, bingo-free)
- [x] Todos os componentes atualizados com tokens semânticos
- [x] WCAG AA/AAA compliance em todos os contrastes
- [x] Ambos temas (claro/escuro) igualmente polidos

#### Redesign da Home Page (2025-12-25)
- [x] Removidas explicações técnicas de encoding/decoding
- [x] Adicionadas regras completas para ambas modalidades
- [x] Cards de acesso rápido para /sort e /card
- [x] Guia passo-a-passo "Como Jogar"
- [x] Layout limpo e focado no usuário

#### Otimizações para Modo Offline (2025-12-25)
- [x] Removido campo "Último Sorteado" (não faz sentido offline)
- [x] Removida mensagem "Faltam X números para o próximo padrão" (enganosa)
- [x] StatsPanel otimizado com apenas informações relevantes
- [x] Mantido aviso importante de números não marcados
- [x] Código preparado para futura feature online

#### UX Improvements - Sort Page (2025-12-25)
- [x] Botão toggle para alternar ordenação dos números sorteados
- [x] Opção "Ordem de chamada" (cronológica - padrão)
- [x] Opção "Ordem crescente" (numérica)
- [x] UI responsiva com ícones + texto (desktop) e apenas ícones (mobile)
- [x] Performance otimizada com useMemo
- [x] Destaque do número atual mantido em ambos modos

---

## 📝 Notas de Implementação

### Sistema de Códigos - Detalhamento

**90 Bolas (Britânico)**:
- Formato: 9 grupos decimais separados por `+`
- Cada dígito representa um número relativo ao grupo
- Base incrementa +10 a cada grupo
- Dígito "0" representa o múltiplo de 10 do grupo
- Exemplo completo: `/card/123+45+6+78+0+12+345+67+89`
  - Grupo 1 (base 0): "123" = 1, 2, 3
  - Grupo 2 (base 10): "45" = 14, 15
  - Grupo 3 (base 20): "6" = 26
  - Grupo 4 (base 30): "78" = 37, 38
  - Grupo 5 (base 40): "0" = 50
  - Grupo 6 (base 50): "12" = 51, 52
  - Grupo 7 (base 60): "345" = 63, 64, 65
  - Grupo 8 (base 70): "67" = 76, 77
  - Grupo 9 (base 80): "89" = 88, 89
- Validação: exatamente 15 números únicos entre 1-90
- Distribuição: mín 1, máx 3 números por grupo (até 2 grupos vazios)

**75 Bolas (Americano)**:
- Formato: 24 caracteres hexadecimais contínuos (SEM separador)
- Posições fixas por coluna: [0-4]=B, [5-9]=I, [10-13]=N, [14-18]=G, [19-23]=O
- Range hex: 1-F (não usa 0, pois números vão de 1-75)
- Base incrementa +15 a cada grupo (exceto primeiro)
- Exemplo completo: `/card/1359B248AC78DE135AD39BEF`
  - B [0-4] (base 0): "1359B" = 1, 3, 5, 9, 11
  - I [5-9] (base 15): "248AC" = 17, 19, 23, 25, 27
  - N [10-13] (base 30): "78DE" = 37, 38, 43, 44 | centro FREE
  - G [14-18] (base 45): "135AD" = 46, 48, 50, 55, 58
  - O [19-23] (base 60): "39BEF" = 63, 69, 71, 74, 75
- Validação: exatamente 24 caracteres hex válidos (1-F)
- Total: 24 números + FREE space no centro (posição [2,2])

### LocalStorage Schema

```typescript
// Sorteio
{
  "bingo_sort": {
    "mode": "75" | "90",
    "drawnNumbers": number[],
    "currentNumber": number | null,
    "timestamp": number
  }
}

// Cartela
{
  "bingo_card_[cod]": {
    "markedNumbers": number[],
    "timestamp": number
  }
}
```

### Padrões de Vitória Iniciais

**75 Bolas** (Fase 1):
- Linha horizontal
- Linha vertical
- Diagonais
- Blackout (cartela cheia)

**90 Bolas**:
- 1 linha completa
- 2 linhas completas
- Cartela cheia (Full House)

---

*Última atualização: 2025-12-25*
