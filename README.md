
# Login e senha para acessar a página home:

Login: admin@rifas.com

Senha: 123456

Necessário instalar a biblioteca lucide-react no npm para rodar o si# 🎯 Rifas Fáceis

Plataforma completa para criação, gerenciamento e participação em rifas online. O projeto é dividido em frontend (React + Vite) e backend (Node.js + Express + Prisma + PostgreSQL).

🔗 **Deploy:** [rifas-faceis.vercel.app](https://rifas-faceis.vercel.app)

---

## 🚀 Tecnologias

### Frontend
- React + Vite
- React Router DOM
- Lucide React (ícones)
- Context API (autenticação e carrinho)

### Backend
- Node.js + Express
- Prisma ORM
- PostgreSQL
- JWT (autenticação)
- bcryptjs (hash de senha)

---

## 📁 Estrutura do projeto

```
Rifas-Faceis/
├── public/
└── src/
    ├── api/              # Camada HTTP (axios)
    ├── components/       # Componentes reutilizáveis
    │   ├── NumberCard    # Card de número individual da rifa
    │   ├── RaffleCard    # Card de preview da rifa
    │   └── PurchaseModal # Modal de compra de número
    ├── context/          # Contextos globais (Auth, Cart)
    ├── pages/            # Páginas da aplicação
    │   ├── Home          # Listagem de rifas disponíveis
    │   ├── RaffleDetails # Detalhes e compra de números
    │   ├── EditRaffle    # Painel de gestão da rifa (admin/autor)
    │   └── MyRaffles     # Rifas compradas pelo usuário
    └── services/         # Camada de serviços (formatação e lógica)
```

---

## ⚙️ Como rodar localmente

### Pré-requisitos
- Node.js 18+
- PostgreSQL
- npm

### Frontend

```bash
# Clone o repositório
git clone https://github.com/pietroggu/Rifas-Faceis.git
cd Rifas-Faceis

# Instale as dependências
npm install

# Rode o servidor de desenvolvimento
npm run dev
```

### Backend

```bash
cd backend/rifa-facil-api

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com sua DATABASE_URL e JWT_SECRET

# Rode as migrations do banco
npx prisma migrate dev

# Inicie o servidor
npm run dev
```

### Variáveis de ambiente do backend (`.env`)

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/rifas"
JWT_SECRET="sua_chave_secreta"
PORT=3000
```

---

## 🗄️ Schema do banco de dados

O projeto usa três modelos principais:

**User** — usuários da plataforma com suporte a roles (comprador / admin)

**Raffle** — rifas criadas pelos usuários, com suporte a sorteio, vencedor e data de encerramento

**Ticket** — números individuais de cada rifa, vinculados ao usuário comprador

> Relacionamentos: um usuário pode criar várias rifas, comprar vários tickets e ganhar rifas. Cada ticket pertence a uma rifa e pode pertencer a um usuário.

---

## 🧩 Funcionalidades

### Para compradores
- Cadastro e login com JWT
- Listagem de rifas com filtros por nome, categoria e ordenação
- Visualização de detalhes da rifa com grid de números
- Compra de números via carrinho
- Página "Minhas Rifas" com histórico de compras, status de ganhou/perdeu e imagem do prêmio

### Para criadores / admins
- Criação e edição de rifas
- Painel com estatísticas: números vendidos, percentual e valor arrecadado
- Listagem de tickets vendidos com dados do comprador
- Cancelamento de tickets individuais
- Realização do sorteio com apuração automática do vencedor
- Bloqueio automático de vendas após o sorteio

---

## 🔒 Regras de negócio

- Após o sorteio ser realizado, os números ficam bloqueados para compra
- Rifas sorteadas e esgotadas aparecem ao final da listagem
- Tickets cancelados liberam o número para nova compra
- O vencedor é exibido publicamente na página da rifa após o sorteio

---

## 📦 Dependências principais

```bash
npm install lucide-react react-router-dom
```

---
