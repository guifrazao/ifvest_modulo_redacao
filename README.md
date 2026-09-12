# 📝 IFVest – Módulo de Redações

---

# 🚀 Funcionalidades

✅ Criação de propostas de redação com textos de apoio (texto ou imagem)
✅ Editor de texto rico (negrito, itálico, tamanho de fonte, etc.) para textos de apoio
✅ Submissão de redações digitadas ou via upload de imagem
✅ OCR multimodal com IA (Groq VLM) para extração de texto de imagens
✅ Correção humana por professor, com comentários por competência (padrão ENEM)
✅ Correção automática por IA (Anthropic/Claude), com feedback geral e notas por competência
✅ Notas por competência de 0 a 200 (múltiplos de 40), seguindo o modelo do ENEM
✅ Detecção de cópia de trechos dos textos de apoio (plágio)
✅ Organização de propostas por tags, com filtragem por tag e data
✅ Áreas separadas para aluno e professor/corretor
✅ Edição e remoção de propostas e textos de apoio

---

# 🧠 Tecnologias Utilizadas

| Tecnologia | Finalidade |
|---|---|
| Python | Linguagem principal do backend |
| FastAPI | API REST |
| SQLModel | ORM e validação de dados |
| SQLite | Banco de dados |
| GroqCloud | OCR multimodal (extração de texto de imagens de redações) |
| Anthropic (Claude) | Correção automática de redações por IA |
| React | Interface web |
| Axios | Comunicação do frontend com a API |
| Lexical | Editor de texto rico para textos de apoio |

---

# ⚙️ Instalação

## 1️⃣ Clone o projeto

```bash
git clone https://github.com/guifrazao/ifvest_modulo_redacao/
cd ifvest_modulo_redacao
```

---

## 2️⃣ Backend

### Acesse a pasta do backend

```bash
cd backend
```

### Crie um ambiente virtual

```bash
python -m venv venv
```

### Ative o ambiente virtual

```powershell
.\venv\Scripts\Activate.ps1
```

### Crie o banco de dados

Crie manualmente um arquivo `database.db` no mesmo nível das pastas `routers`, `models`, etc.

### Instale as dependências

```bash
pip install -r requirements.txt
```

### Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do backend com as variáveis descritas na seção [Variáveis de Ambiente](#-variáveis-de-ambiente).

### Execute o servidor

```bash
python main.py
```

Isso inicia o servidor via Uvicorn.

---

## 3️⃣ Frontend

### Acesse a pasta do frontend

```bash
cd ifvest-modulo-redacao
```

### Instale as dependências

```bash
npm install
```

### Execute a aplicação

```bash
npm start
```

---

# 🔧 Variáveis de Ambiente

| Variável | Padrão | O que é |
|---|---|---|
| `DATABASE_URL` | `sqlite:///./database.db` | Arquivo SQLite |
| `API_PREFIX` | `/api` | Rota padrão utilizada pela API |
| `ALLOWED_ORIGINS` | `http://localhost:3000,http://localhost:5173,http://localhost:8000` | Origens que tem permissão para realizar requisições na API |
| `GROQ_API_KEY` | - | Chave da API Groq, que é utilizada no OCR (obtenha sua chave em https://console.groq.com/) |
| `ANTHROPIC_API_KEY` | - | Chave da API da Anthropic, que é utilizada na correção de redações por IA |
| `MONTHLY_LIMIT` | `10` | Limite mensal de correções por IA |
| `MODEL` | `claude-opus-5` | Modelo utilizado da IA de correção |
| `MAX_TOKENS` | `8000` | Quantidade máxima de tokens da IA de correção |
| `EFFORT` | `Medium` | Esforço feito pela IA de correção |

---

# 🧪 Funcionamento do Sistema

O fluxo principal do sistema funciona em etapas:

1. 📋 Professor cria uma proposta de redação com textos de apoio
2. ✍️ Aluno escreve a redação (digitada ou via upload de imagem)
3. 🔤 OCR multimodal extrai o texto, caso a redação tenha sido enviada como imagem
4. 🔍 Sistema detecta trechos copiados dos textos de apoio
5. 🤖 Correção automática por IA ou 👩‍🏫 correção manual por um professor
6. 📊 Atribuição de notas por competência e feedback
7. 📖 Aluno visualiza a correção, notas e comentários
