# Checklist de Desenvolvimento - Linear Clone

Baseado no PRD `linear_prd_full.md`, este documento define o roteiro de desenvolvimento para o clone do Linear, focado em velocidade, simplicidade e colaboração.

## 🏁 Fase 1: Fundação e Core (MVP)
Foco: Estabelecer a arquitetura, design system e funcionalidades essenciais de gestão de issues.

### 🛠️ Configuração Inicial e Infraestrutura
- [ ] **Inicialização do Projeto**
    - [ ] Setup Next.js 14+ (App Router) com TypeScript
    - [ ] Configuração do Tailwind CSS
    - [ ] Setup do ESLint, Prettier e Husky para qualidade de código
    - [ ] Configuração do Repositório (Git)
- [ ] **Backend e Banco de Dados**
    - [ ] Setup do Supabase (PostgreSQL + Auth + Realtime)
    - [ ] Modelagem inicial do Banco de Dados (Users, Workspaces, Teams)
    - [ ] Configuração de Migrations e Seeds iniciais
- [ ] **Autenticação e Segurança**
    - [ ] Implementar Login/Sigup (Email/Password, OAuth GitHub/Google)
    - [ ] Configurar Contexto de Sessão e Proteção de Rotas
    - [ ] Implementar RLS (Row Level Security) básico nas tabelas

### 🎨 Design System e UI Base
- [ ] **Fundamentos de Design (Tokens)**
    - [ ] Definir Paleta de Cores (LCH-based: Teal, Grays, Status Colors)
    - [ ] Configurar Tipografia (Inter, Inter Display, Berkeley Mono)
    - [ ] Definir Espaçamentos e Grid System (4px base)
- [ ] **Componentes Core (Base UI)**
    - [ ] `Button` (Variants: Primary, Secondary, Ghost, Danger; Sizes: SM, MD, LG)
    - [ ] `Input`, `Textarea`, `Select`
    - [ ] `Avatar` e `AvatarGroup`
    - [ ] `Badge`/`Tag` (para Labels e Status)
    - [ ] `Modal`/`Dialog` (com animações de entrada/saída)
    - [ ] `DropdownMenu` e `Tooltip`
- [ ] **Layout Principal**
    - [ ] Sidebar de Navegação (Colapsável) e Topbar
    - [ ] Suporte a Temas (Light/Dark Mode toggle)

### 🎫 Gestão de Issues (Core Feature)
- [ ] **Backend (Issues)**
    - [ ] Tabela `issues`, `labels`, `states` (status customizáveis)
    - [ ] API/Server Actions para CRUD de Issues
- [ ] **Interface de Issues**
    - [ ] Lista de Issues (Virtualizada para performance)
    - [ ] Modal/Página de Criação de Issue (Foco em velocidade)
    - [ ] Detalhes da Issue (Title, Description Markdown, Sidebar de propriedades)
- [ ] **Propriedades da Issue**
    - [ ] Implementar Prioridades (No Priority, Urgent, High, Medium, Low)
    - [ ] Implementar Status (Backlog, Todo, In Progress, Done, Canceled)
    - [ ] Atribuição de Responsável (Assignee)
    - [ ] Sistema de Labels (Criar, Editar, Atribuir)

## 🚀 Fase 2: Fluxos de Trabalho e Colaboração
Foco: Expandir para gestão de projetos, sprints (ciclos) e colaboração em tempo real.

### 📅 Projetos e Ciclos (Sprints)
- [ ] **Projetos**
    - [ ] Tabela `projects` e relacionamentos
    - [ ] CRUD de Projetos (Nome, Descrição, Status, Lead)
    - [ ] View de Roadmap (Timeline visual simples)
- [ ] **Ciclos**
    - [ ] Tabela `cycles` (Start/End Date)
    - [ ] Lógica de Atribuição de Issues a Ciclos
    - [ ] Automação de "Rollover" (mover issues não terminadas para o próximo ciclo)
    - [ ] Gráfico de Burn-down básico

### 💬 Colaboração e Realtime
- [ ] **Comentários**
    - [ ] Tabela `comments` (Draft.js ou Markdown editor)
    - [ ] Threading simples ou lista linear de comentários
    - [ ] Upload de arquivos/imagens (Attachments)
- [ ] **Realtime Updates**
    - [ ] Implementar WebSocket (Supabase Realtime) para atualizações ao vivo na lista de issues
    - [ ] Indicadores de "Quem está vendo" ou "Quem está digitando"

### 📋 Views Avançadas
- [ ] **Board View (Kanban)**
    - [ ] Drag-and-drop de issues entre colunas (Status)
- [ ] **Filtros e Visualizações**
    - [ ] Implementar filtros compostos (Assignee + Status + Priority)
    - [ ] Salvar Views customizadas ("My Issues", "Bugs High Priority")

## 🔌 Fase 3: Integrações, Automação e Polimento
Foco: Conectar com ferramentas externas, automatizar tarefas repetitivas e garantir performance.

### ⚡ Produtividade e "Power User" Features
- [ ] **Command Menu (Cmd+K)**
    - [ ] Implementar Command Palette Global
    - [ ] Ações rápidas: Create Issue, Search Issue, Change Theme
- [ ] **Atalhos de Teclado**
    - [ ] Navegação pela lista (j/k)
    - [ ] Ações rápidas na issue (c: create, e: edit, etc.)

### 🤖 Integrações e Automações
- [ ] **GitHub Integration**
    - [ ] Linkar PRs a Issues automaticamente
    - [ ] Automação: PR Open -> Status "In Review"
    - [ ] Automação: PR Merged -> Status "Done"
- [ ] **Slack Integration**
    - [ ] Notificações de novas issues ou menções
- [ ] **Workflows**
    - [ ] Auto-close de issues antigas
    - [ ] Auto-archive

### 📊 Analytics e Dashboards
- [ ] **Insights da Equipe**
    - [ ] Velocity Chart (Pontos/Issues por ciclo)
    - [ ] Cycle Time médio
    - [ ] Visão geral de progresso do Projeto

### 💎 Polimento Final e Performance
- [ ] **Performance**
    - [ ] Otimização de queries e índices no banco
    - [ ] Code splitting e Lazy loading intensivo
- [ ] **UX/UI Refinements**
    - [ ] Micro-interações e transições suaves
    - [ ] Empty states ilustrativos
    - [ ] Tratamento de erros gracioso e Toasts de feedback
- [ ] **Acessibilidade**
    - [ ] Navegação completa por teclado
    - [ ] Contraste adequado e labels ARIA

## 📝 Documentação
- [ ] Documentação da API
- [ ] Guia de Contribuição
- [ ] Storybook dos Componentes (Opcional)
