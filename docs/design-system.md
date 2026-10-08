# Design System — Plataforma de Pequenos Animais

Referência visual central do projeto. Todos os valores abaixo foram escritos para serem convertidos diretamente em CSS variables (o nome na coluna "Token" é o nome da variável).

**Conceito:** *Natural, acolhedor, moderno e premium.*

---

## 1. Princípios da identidade visual

1. **Fotografia primeiro.** Os animais são o principal elemento visual. A interface é moldura, não protagonista.
2. **Espaço em branco generoso.** Menos elementos, mais respiro. Na dúvida, aumentar o espaçamento.
3. **Um verde, um calor.** Verde profundo como cor de marca; um tom terracota discreto como apoio. Nada além disso.
4. **Contraste alto no texto.** Leitura confortável vence decoração.
5. **Sofisticação contida.** Cantos arredondados, sombras discretas, tipografia com personalidade só nos títulos.
6. **Sem infantilização.** Proibido: emojis, patas, ilustrações lúdicas, gradientes vibrantes, mais de duas cores de destaque.

---

## 2. Paleta de cores

Contrastes calculados contra `--color-surface` (#FFFFFF), salvo indicação.

| Token | Hex | Finalidade | Contraste |
|---|---|---|---|
| `--color-background` | `#FAF8F4` | Fundo geral das páginas (off-white quente) | — |
| `--color-surface` | `#FFFFFF` | Cards, navbar, campos de formulário, modais | — |
| `--color-surface-alt` | `#F2EEE6` | Seções alternadas, áreas de destaque suave, placeholders de imagem | — |
| `--color-border` | `#E3DED3` | Divisórias e bordas decorativas (cards, separadores) | decorativo |
| `--color-border-strong` | `#8A918C` | Bordas de campos de formulário e controles interativos | 3,2:1 |
| `--color-text` | `#1C1F1D` | Títulos e texto principal | ~16:1 |
| `--color-text-muted` | `#5B635E` | Texto secundário, legendas, metadados | 6,2:1 |
| `--color-primary` | `#1F4D3A` | Cor da marca: botão principal, links, foco, ícones ativos | 9,6:1 |
| `--color-primary-hover` | `#163A2B` | Hover/active do elemento primário | ~13:1 |
| `--color-primary-soft` | `#E4EDE7` | Fundo do selo "Disponível" (texto em `--color-primary`), tags, hover de botão secundário | — |
| `--color-on-primary` | `#FFFFFF` | Texto e ícones sobre `--color-primary` | 9,6:1 |
| `--color-accent` | `#9A5A2B` | Apoio quente: destaques pontuais (espécie do animal, categoria do guia), selo "Reservado" | 5,4:1 |
| `--color-accent-soft` | `#F7EDE2` | Fundo do selo "Reservado" (texto em `--color-accent`, 4,7:1) e eyebrows sobre fundo verde | — |
| `--color-success` | `#2F7D4F` | Confirmação de formulário | 5,0:1 |
| `--color-danger` | `#B3261E` | Erros e ações destrutivas | 6,5:1 |

**Regras de uso**
- Proporção alvo por tela: ~85% neutros, ~12% verde, ~3% terracota.
- `--color-accent` nunca é fundo de botão principal; só aparece em texto/ícone sobre fundo claro ou em selos com `--color-accent-soft`.
- Não criar novas cores sem revisar este documento.

---

## 3. Tipografia

Duas famílias, ambas do Google Fonts, carregadas por `<link>` no `<head>` de cada página (Fraunces 500 e 600; Inter 400, 500 e 600; `display=swap`).

| Papel | Família | Pesos | Uso |
|---|---|---|---|
| Títulos | **Fraunces** (serifada, calorosa) | 500, 600 | `h1`–`h3`, números de destaque |
| Interface e corpo | **Inter** (sem serifa) | 400, 500, 600 | Texto corrido, botões, menus, formulários, `h4` e inferiores |

| Token | Valor |
|---|---|
| `--font-heading` | `"Fraunces", Georgia, serif` |
| `--font-body` | `"Inter", system-ui, -apple-system, "Segoe UI", sans-serif` |

Regras: no máximo 3 pesos de Inter e 2 de Fraunces carregados; `font-display: swap`; sem itálico decorativo; sem texto todo em maiúsculas exceto *eyebrows* curtos (≤ 3 palavras, com `letter-spacing` leve).

---

## 4. Hierarquia de títulos e textos

Tamanhos fluidos: o valor mínimo vale no mobile, o máximo no desktop (a fórmula `clamp()` será definida na etapa de CSS entre esses extremos).

| Token | Mobile → Desktop | Peso | Line-height | Família | Uso |
|---|---|---|---|---|---|
| `--text-display` | 40 px → 64 px | 600 | 1.1 | Fraunces | Hero da Home e nome do animal no perfil individual |
| `--text-h1` | 32 px → 48 px | 600 | 1.15 | Fraunces | Título de página |
| `--text-h2` | 26 px → 36 px | 600 | 1.2 | Fraunces | Título de seção |
| `--text-h3` | 20 px → 24 px | 500 | 1.3 | Fraunces | Título de card/subseção |
| `--text-h4` | 18 px | 600 | 1.4 | Inter | Títulos menores, rótulos de grupo |
| `--text-body-lg` | 18 px | 400 | 1.6 | Inter | Introduções e lead |
| `--text-body` | 16 px | 400 | 1.6 | Inter | Texto padrão (nunca menor) |
| `--text-small` | 14 px | 400/500 | 1.5 | Inter | Metadados, legendas, ajuda de formulário |
| `--text-eyebrow` | 13 px | 600 | 1.3 | Inter | Sobretítulo, `letter-spacing` 0.08em |

- Letter-spacing de títulos: levemente negativo (-0.01em) apenas em `display` e `h1`.
- Largura de leitura de parágrafos: 60–75 caracteres (~680 px).
- Uma única `h1` por página; níveis não são pulados.

---

## 5. Sistema de espaçamento

Base de **4 px**, escala enxuta. Usar somente estes valores para `margin`, `padding` e `gap`.

| Token | Valor | Uso típico |
|---|---|---|
| `--space-1` | 4 px | Ajustes finos entre ícone e texto |
| `--space-2` | 8 px | Espaço interno mínimo, gap de tags |
| `--space-3` | 12 px | Gap entre label e campo |
| `--space-4` | 16 px | Padding padrão, gutter mobile |
| `--space-5` | 24 px | Padding de card, gap de grid |
| `--space-6` | 32 px | Separação entre blocos |
| `--space-7` | 48 px | Espaço entre grupos de conteúdo |
| `--space-8` | 64 px | Padding vertical de seção (mobile) |
| `--space-9` | 96 px | Padding vertical de seção (tablet+) |
| `--space-10` | 128 px | Respiro de hero e seções de destaque (desktop) |

---

## 6. Border radius

| Token | Valor | Uso |
|---|---|---|
| `--radius-sm` | 8 px | Tags, badges, itens de menu |
| `--radius-md` | 12 px | Botões, campos de formulário |
| `--radius-lg` | 20 px | Cards, imagens, modais |
| `--radius-xl` | 28 px | Hero e blocos de destaque |
| `--radius-full` | 999 px | Chips, avatares, indicadores |

Imagens dentro de cards herdam o raio do card (`--radius-lg`).

---

## 7. Sombras

Sombras suaves, tintadas com o verde-escuro (`rgba(22, 40, 32, …)`), nunca pretas puras.

| Token | Valor | Uso |
|---|---|---|
| `--shadow-sm` | `0 1px 2px rgba(22,40,32,.06)` | Campos, navbar ao rolar |
| `--shadow-md` | `0 4px 16px rgba(22,40,32,.08)` | Cards em repouso |
| `--shadow-lg` | `0 12px 32px rgba(22,40,32,.12)` | Cards em hover, menus, modais |

Cards em repouso podem usar apenas `--color-border` em vez de sombra; nunca combinar borda forte com sombra grande.

---

## 8. Containers e largura máxima

| Token | Valor | Uso |
|---|---|---|
| `--container-max` | 1200 px | Conteúdo padrão |
| `--container-wide` | 1360 px | Definido, mas não usado na v1 (o hero usa `--container-max`) |
| `--container-narrow` | 720 px | Definido, mas não usado na v1 |
| `--gutter` | 16 px (mobile) · 24 px (tablet) · 32 px (desktop+) | Margem lateral do container |

- Container sempre centralizado, com `--gutter` como padding lateral.
- Grid: **4 colunas** (mobile), **8** (tablet), **12** (desktop e amplo); `gap` = `--space-5`.
- Fundos de seção podem ocupar a largura total; o conteúdo respeita o container.

---

## 9. Botões

| Variante | Fundo | Texto | Borda | Uso |
|---|---|---|---|---|
| **Primário** | `--color-primary` | `--color-on-primary` | — | Uma ação principal por região |
| **Secundário** | transparente | `--color-primary` | 1.5 px `--color-primary` | Ação alternativa |
| **Ghost** | transparente | `--color-primary` | — | Ações terciárias, "Ver mais" |

| Propriedade | Valor |
|---|---|
| Altura | 44 px (padrão) · 52 px (grande, hero/CTA) |
| Padding horizontal | `--space-5` (24 px) |
| Raio | `--radius-md` |
| Fonte | Inter 600, 16 px |
| Hover | Primário → `--color-primary-hover`; secundário → fundo `--color-primary-soft`; ghost → sublinhado |
| Active | Redução sutil de escala (0.98) |
| Disabled | Opacidade 50%, cursor `not-allowed`, sem hover |

Botões com ícone mantêm gap de `--space-2`. Largura total no mobile quando for a ação principal do bloco.

---

## 10. Cards

Card de animal/espécie é o componente central.

- Fundo `--color-surface`, raio `--radius-lg`, borda 1 px `--color-border`, sombra `--shadow-md` (ou só borda).
- Imagem no topo, proporção **4:3** (ou 1:1 em listas compactas), `object-fit: cover`, sem texto sobreposto sem proteção de contraste.
- Padding interno `--space-5`; gap interno `--space-2` a `--space-3`.
- Estrutura: imagem → *eyebrow* (categoria/espécie) → título (`--text-h3`) → descrição curta (máx. 2 linhas, `--color-text-muted`) → ação/metadado.
- Selo de status com **texto escrito** e um ponto, nunca só cor, sem aparência de botão: "Disponível" em `--color-primary-soft` + texto `--color-primary`; "Reservado" em `--color-accent-soft` + texto `--color-accent`.
- **Card navegável** (só existe quando há página publicada para o destino):
  - Um único link `<a>` nativo, estendido sobre o card inteiro por `::after`. A imagem fica fora do link (mantém o próprio `alt`), mas é coberta pelo `::after`, então a foto também clica.
  - Hover, só em `@media (hover: hover)`: `--shadow-lg`; com movimento reduzido liberado, também deslocamento vertical (-4 px) e zoom da imagem (1.03).
  - Foco: contorno de 3 px em `--color-primary`, offset 2 px, desenhado no **card inteiro**; sem suporte a `:has()`, vale o contorno padrão do próprio link.
- **Card estático** (sem página): sem link, sem hover, sem cursor de ação, fora da ordem de Tab e sem indicação de ação como "Conhecer espécie".
- Indicações de ação ("Conhecer espécie →") só aparecem em card navegável; a seta é decorativa (`aria-hidden`).

---

## 11. Campos de formulário

| Propriedade | Valor |
|---|---|
| Altura | 48 px (campos de linha única) |
| Fundo | `--color-surface` |
| Borda | 1.5 px `--color-border-strong` |
| Raio | `--radius-md` |
| Padding | 0 `--space-4` |
| Texto | Inter 400, 16 px (evita zoom automático no iOS) |
| Placeholder | `--color-text-muted`; nunca substitui o rótulo |
| Label | Sempre visível acima do campo, Inter 500, 14 px, gap `--space-2` |
| Ajuda | `--text-small`, `--color-text-muted`, abaixo do campo |

**Estados**
- **Hover:** borda escurece para `--color-text-muted`.
- **Focus:** borda `--color-primary` + anel de foco (ver seção 13).
- **Erro:** borda `--color-danger` + mensagem com ícone e texto (não só cor).
- **Sucesso:** borda `--color-success` + mensagem textual.
- **Desabilitado:** fundo `--color-surface-alt`, texto atenuado.

---

## 12. Navbar

- Fixa no topo (sticky), fundo `--color-surface` (opcionalmente com leve transparência), borda inferior 1 px `--color-border`. Não há sombra ao rolar na v1.
- Altura: **64 px** (mobile) · **76 px** (desktop).
- Esquerda: logotipo (texto em Fraunces 600). Centro/direita: links em Inter 500, 15–16 px, `--color-text`. Máximo de 5 itens + 1 CTA em botão primário.
- Hover: `--color-primary` com sublinhado. Não há estado de link ativo na v1 (a Home navega por âncoras).
- **Mobile:** links ocultos em menu expansível acionado por botão de 44×44 px com rótulo acessível; menu ocupa a largura total, itens com altura mínima de 44 px.
- Breakpoint de transição para menu horizontal: tablet em diante (≥ 768 px).

---

## 13. Estados de hover e focus

**Hover** (somente em dispositivos com ponteiro preciso)
- Mudança sutil e previsível: escurecer, elevar (sombra) ou sublinhar. Nunca mudar layout.
- Links de texto: cor `--color-primary` com sublinhado visível no hover.

**Focus visível (obrigatório em todo elemento interativo)**
- Anel de 3 px em `--color-primary`, com offset de 2 px.
- Sobre fundos escuros ou sobre imagens, o anel usa `--color-on-primary`.
- Nunca remover o contorno sem substituí-lo por um equivalente.
- Usar o foco por teclado (`:focus-visible`); o foco deve ser tão evidente quanto o hover, nunca menos.

**Active:** pressão leve (escala 0.98 ou cor mais escura).
**Disabled:** opacidade reduzida + cursor indicativo; sem hover nem foco de destaque.

---

## 14. Princípios de animação

1. **Discretas e com propósito:** reforçam feedback e hierarquia, nunca decoram.
2. **Duração:** `--duration-fast` 150 ms (hover, foco) · `--duration-base` 250 ms (cards, menus) · `--duration-slow` 400 ms (entrada de seções, máximo).
3. **Easing:** `--ease-standard` = `cubic-bezier(0.2, 0, 0, 1)` (saída suave). Evitar efeitos elásticos ou "bounce".
4. **Propriedades permitidas:** `opacity`, `transform`, `box-shadow`, `background-color`, `color`. Evitar animar dimensões e posição de layout.
5. **Entrada de conteúdo:** fade + deslocamento vertical de no máximo 16 px, uma vez, sem repetição.
6. **Acessibilidade:** respeitar `prefers-reduced-motion` — remover deslocamentos e zoom, mantendo apenas mudanças de cor/opacidade instantâneas ou muito curtas.
7. Nenhuma animação em loop, nem autoplay com movimento contínuo.

---

## 15. Breakpoints responsivos

Estratégia **mobile-first**: o CSS base é o mobile; os breakpoints só adicionam ajustes com largura mínima.

| Nome | Largura mínima | Colunas | Gutter | Comportamento |
|---|---|---|---|---|
| **Mobile** | 0 px (base) | 4 | 16 px | Uma coluna, navbar em menu, botões principais em largura total |
| **Tablet** | 768 px | 8 | 24 px | Grid de cards em 2 colunas, navbar horizontal |
| **Desktop** | 1024 px | 12 | 32 px | Grid de cards em 3 colunas, layouts em duas colunas |
| **Desktop amplo** | 1440 px | 12 | 32 px | Sem regras próprias na v1: o container para em `--container-max` (1200 px) |

- Testar a partir de **360 px** de largura.
- Nenhuma rolagem horizontal em qualquer largura.
- Imagens responsivas, sempre com proporção definida para evitar salto de layout.
- Em ponteiro "touch", não depender de hover para revelar informações.

---

## 16. Regras de acessibilidade visual

**Contraste**
- Texto normal: mínimo **4.5:1** (WCAG AA). Texto grande (≥ 24 px ou ≥ 19 px em negrito): mínimo **3:1**.
- Bordas de campos, ícones informativos e anel de foco: mínimo **3:1** contra o fundo.
- Texto sobre fotografia exige camada de proteção (overlay escuro) que garanta 4.5:1.

**Foco visível**
- Todo elemento interativo exibe foco claro e consistente (seção 13); ordem de tabulação segue a ordem visual.

**Área clicável**
- Mínimo **44 × 44 px** para botões, links isolados, ícones e itens de menu; espaço mínimo de 8 px entre alvos adjacentes.

**Legibilidade**
- Corpo de texto ≥ 16 px; texto auxiliar nunca abaixo de 14 px.
- Line-height ≥ 1.5 em parágrafos; largura de linha 60–75 caracteres.
- Texto alinhado à esquerda; evitar justificado e blocos longos centralizados.
- Interface deve funcionar com zoom de 200% sem perda de conteúdo.

**Estados que não dependem só de cor**
- Erro, sucesso, link ativo, item selecionado e status ("Disponível", "Reservado") combinam cor com **texto, ícone ou sublinhado**.
- Links dentro de texto corrido sempre sublinhados.

**Imagens**
- Toda fotografia de animal tem texto alternativo descritivo; imagens decorativas têm alternativo vazio.

---

## 17. Mapeamento para CSS variables

Convenção de nomes para a etapa de implementação (todos os tokens deste documento já seguem o padrão):

| Grupo | Prefixo |
|---|---|
| Cores | `--color-*` |
| Tipografia (família) | `--font-*` |
| Tamanhos de texto | `--text-*` |
| Espaçamento | `--space-*` |
| Raio | `--radius-*` |
| Sombras | `--shadow-*` |
| Containers | `--container-*`, `--gutter` |
| Animação | `--duration-*`, `--ease-*` |

Os breakpoints (768 e 1024 px, mais o 1440 px documentado sem regras próprias) são valores fixos de *media query* e não variáveis CSS.
