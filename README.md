<div align="center">

# 🚀 CRM Pro — Gestão Inteligente de Clientes

![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Claude AI](https://img.shields.io/badge/Claude_AI-D97706?style=for-the-badge&logo=anthropic&logoColor=white)

**CRM moderno com inteligência artificial integrada para análise de leads e sugestão de próximas ações.**  
Construído com Next.js 16 App Router, TypeScript e design escuro de alta qualidade.

</div>

---

## 📸 Preview

> **Para adicionar:** grave um GIF com [LICEcap](https://www.cockos.com/licecap/) ou [ScreenToGif](https://www.screentogif.com/) navegando pelo sistema e substitua a linha abaixo:

```
[Adicione aqui um GIF ou screenshot do projeto — ex: demo.gif na raiz do repositório]
```

<!-- Descomente após adicionar a imagem:
![Demo do CRM Pro](./demo.gif)
-->

---

## ✨ Funcionalidades

- 📋 **Listagem de Contatos** — tabela com busca em tempo real e filtro por status (Frio, Morno, Quente)
- 👤 **Detalhe do Contato** — perfil completo com timeline de interações (notas, ligações, e-mails, reuniões)
- 🗂️ **Pipeline Kanban** — quadro drag & drop com 5 etapas: Prospecção → Qualificação → Proposta → Negociação → Fechado
- 🤖 **Análise com IA** — botão que chama a API da Anthropic (Claude) e retorna resumo do histórico + sugestão de próxima ação
- 💾 **Persistência local** — dados salvos no `localStorage`, sobrevivem a recarregamentos sem banco de dados
- 🌑 **Design escuro** — interface moderna com sidebar de navegação, badges de status e scrollbar customizada

---

## 🛠️ Stack Técnica

| Tecnologia | Uso |
|---|---|
| **Next.js 16** (App Router) | Framework full-stack com rotas de API |
| **TypeScript** | Tipagem estática em todo o projeto |
| **Tailwind CSS v4** | Estilização utilitária com tema dark |
| **Claude AI (claude-sonnet-4-6)** | Análise de leads via Anthropic API |

---

## ⚙️ Como Rodar Localmente

**Pré-requisitos:** Node.js 18+ e uma chave de API da Anthropic.

```bash
# 1. Clone o repositório
git clone https://github.com/IgorMxraes/-crm-inteligente.git
cd crm-pro

# 2. Instale as dependências
npm install

# 3. Configure a variável de ambiente
cp .env.local.example .env.local
# Edite .env.local e adicione sua chave:
# ANTHROPIC_API_KEY=sk-ant-...

# 4. Inicie o servidor de desenvolvimento
npm run dev
```

Acesse **http://localhost:3000** — você será redirecionado automaticamente para a listagem de contatos.

---

## 🤖 Como Usar a Análise com IA

1. Acesse qualquer contato na tela de **Contatos**
2. Clique em **"Analisar com IA"** no canto superior direito do perfil
3. O sistema envia o histórico completo de interações para o modelo `claude-sonnet-4-6`
4. Em segundos você recebe:
   - **Resumo do histórico** — síntese objetiva do relacionamento com o lead
   - **Sugestão de próxima ação** — recomendação específica e acionável para avançar o negócio

> A análise considera nome, empresa, status do lead, etapa do pipeline e todas as interações registradas.

---

## 📁 Estrutura do Projeto

```
├── app/
│   ├── contatos/
│   │   ├── page.tsx          # Listagem de contatos
│   │   └── [id]/page.tsx     # Detalhe + histórico + IA
│   ├── pipeline/
│   │   └── page.tsx          # Kanban drag & drop
│   └── api/analisar/
│       └── route.ts          # Rota de API → Anthropic
├── components/
│   └── Sidebar.tsx           # Navegação lateral
├── lib/
│   ├── mockData.ts           # 8 contatos com histórico realista
│   └── storage.ts            # Persistência via localStorage
└── types/
    └── index.ts              # Tipagem global (Contact, Interaction…)
```

---

## 👨‍💻 Autor

Desenvolvido por **Igor Mxraes**

[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/IgorMxraes)

---

<div align="center">
  <sub>Feito com Next.js + Claude AI</sub>
</div>
