

# Sonus — Plataforma de Binaural Beats Personalizado

## Visão Geral
Plataforma web de bem-estar que gera sessões personalizadas de Binaural Beats em tempo real usando Web Audio API. Interface bilíngue (PT-BR / EN), tema escuro imersivo, modelo freemium com assinatura mensal.

---

## 1. Identidade Visual e Layout Base
- Tema escuro com paleta de azul profundo, roxo elétrico e tons neon sutis
- Tipografia moderna e minimalista
- Animações suaves e transições fluidas
- Layout responsivo (mobile-first)
- Sistema de internacionalização (PT-BR e EN) com troca dinâmica

## 2. Landing Page / Tela Inicial
- Apresentação do Sonus com visual imersivo
- Chamada para ação (cadastro/login)
- Demonstração visual das ondas sonoras
- Aviso legal: *"Esta plataforma utiliza Binaural Beats para apoiar relaxamento e foco. Não substitui tratamento médico ou psicológico."*

## 3. Onboarding Personalizado
- Fluxo de 4 etapas com transições suaves:
  1. **Objetivo principal** — Reduzir tensão / Acalmar mente / Dormir mais rápido / Melhorar concentração
  2. **Período preferido** — Manhã / Tarde / Noite
  3. **Nível de estresse** — Baixo / Médio / Alto
  4. **Duração por sessão** — 5 / 10 / 20 / 30 min
- Barra de progresso visual
- Salvar perfil do usuário (localStorage inicialmente)

## 4. Dashboard Principal
- **Botão principal**: "Iniciar Sessão Personalizada" (baseada no perfil)
- **Modos rápidos** com cards visuais:
  - 🌙 Modo Sono (delta 1–4 Hz)
  - 🧘 Modo Calma (theta 4–8 Hz)
  - 🎯 Modo Foco (beta 13–20 Hz)
- **Histórico** de sessões recentes
- **Evolução emocional** — gráfico semanal com Recharts
- **Streak** — sequência de dias consecutivos
- Design limpo com cards e gradientes sutis

## 5. Motor de Áudio (Web Audio API)
- Geração em tempo real de duas frequências (ouvido esquerdo + direito) para criar a diferença binaural
- Configuração dinâmica:
  - Frequência portadora (ex: 200 Hz)
  - Frequência diferencial conforme objetivo (delta/theta/alpha/beta)
  - Variações de personalização (±2 Hz)
- Camadas ambiente opcionais: chuva, ruído branco, oceano
- Controle de volume independente (beats + ambiente)
- Fade in/out suave ao iniciar e pausar

## 6. Experiência de Sessão Imersiva
- Tela dedicada em modo escuro total
- **Visual de ondas** animadas reativas ao áudio
- **Esfera de respiração** opcional (expande/contrai)
- **Timer** discreto com barra de progresso circular
- **Botão de pausa** minimalista
- Informação da frequência atual (sutil)
- Tela cheia incentivada

## 7. Feedback Pós-Sessão
- Pergunta: *"Como você se sente agora?"*
- Escala visual de 1 a 5 (emojis ou ícones)
- Armazenamento local dos dados
- Contribui para o gráfico de evolução no dashboard

## 8. Estatísticas e Progresso
- Total de sessões concluídas
- Frequência mais eficaz (baseada no feedback)
- Tendência emocional semanal (gráfico de linha)
- Streak de uso (dias consecutivos)
- Tudo visível no dashboard

## 9. Sistema de Assinatura (UI)
- **Plano Gratuito**: 3 frequências básicas, sessões limitadas (3/semana), sem histórico detalhado
- **Plano Pro**: Todas as frequências, personalização total, histórico completo, presets personalizados
- Tela de comparação de planos
- Interface de upgrade (preparada para integração com Stripe futuramente)
- Controle de acesso baseado no plano (mockado inicialmente)

## 10. Navegação e Estrutura
- Barra de navegação inferior (mobile) / lateral (desktop)
- Rotas: Home, Dashboard, Sessão, Histórico, Perfil, Planos
- Transições suaves entre páginas

---

**Nota técnica**: O MVP será construído como aplicação frontend completa. Os dados do usuário serão persistidos em localStorage. Quando quiser adicionar backend (autenticação, banco de dados, pagamentos), podemos integrar com Supabase e Stripe.

