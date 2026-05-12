# Arraiá Digital — Backend Node.js

## Estrutura

```
arraia-backend/
├── server.js        ← API CRUD (Express + Supabase)
├── index.html       ← Frontend (sem Supabase, consome a API)
├── .env.example     ← Copie para .env e preencha
└── package.json
```

## Setup rápido

```bash
# 1. Instalar dependências
npm install

# 2. Copiar e preencher as credenciais
cp .env.example .env
# Edite .env com seu SUPABASE_URL e SUPABASE_ANON_KEY

# 3. Rodar o servidor
node server.js
# → API rodando em http://localhost:3001

# 4. Abrir o frontend
# Abra index.html no navegador
```

## Endpoints da API

### Correio Elegante
| Método | Rota          | Descrição                   |
|--------|---------------|-----------------------------|
| GET    | /correio      | Lista os últimos 10 correios |
| POST   | /correio      | Envia um novo correio        |
| DELETE | /correio/:id  | Remove um correio            |

### Produtos
| Método | Rota           | Descrição                 |
|--------|----------------|---------------------------|
| GET    | /produtos      | Lista todos os produtos    |
| GET    | /produtos/:id  | Busca um produto           |
| POST   | /produtos      | Cria um produto            |
| PUT    | /produtos/:id  | Atualiza um produto        |
| DELETE | /produtos/:id  | Remove um produto          |

### Pedidos
| Método | Rota      | Descrição               |
|--------|-----------|-------------------------|
| GET    | /pedidos  | Lista todos os pedidos  |
| POST   | /pedidos  | Registra um pedido      |

### Health
| Método | Rota     | Descrição        |
|--------|----------|------------------|
| GET    | /health  | Status da API    |

## Frontend

O `index.html` foi simplificado: **nenhuma dependência do Supabase** no browser.
Toda comunicação é feita via `fetch` para `http://localhost:3001`.

Para mudar a URL da API (ex: deploy em produção), edite a linha no topo do HTML:
```html
<script>
  const API_BASE = 'http://localhost:3001'; // ← mude aqui
</script>
```
