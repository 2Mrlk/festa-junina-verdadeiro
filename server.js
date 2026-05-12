require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json());

// ── Supabase ─────────────────────────────────────────────────
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// ── Health check ──────────────────────────────────────────────
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// ─────────────────────────────────────────────────────────────
// CORREIO ELEGANTE
// ─────────────────────────────────────────────────────────────

// GET /correio  – lista os últimos 10 correios
app.get('/correio', async (_req, res) => {
  const { data, error } = await supabase
    .from('correio_elegante')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// POST /correio  – cria um novo correio
app.post('/correio', async (req, res) => {
  const { from_name, to_name, message, theme, anonymous } = req.body;

  if (!to_name) return res.status(400).json({ error: 'to_name é obrigatório' });

  const { data, error } = await supabase
    .from('correio_elegante')
    .insert({ from_name: anonymous ? null : (from_name || null), to_name, message: message || null, theme, anonymous })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

// DELETE /correio/:id  – remove um correio
app.delete('/correio/:id', async (req, res) => {
  const { error } = await supabase
    .from('correio_elegante')
    .delete()
    .eq('id', req.params.id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ deleted: true });
});

// ─────────────────────────────────────────────────────────────
// PRODUTOS
// ─────────────────────────────────────────────────────────────

// GET /produtos  – lista todos os produtos
app.get('/produtos', async (_req, res) => {
  const { data, error } = await supabase
    .from('produtos')
    .select('*')
    .order('destaque', { ascending: false })
    .order('created_at');

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// GET /produtos/:id  – busca um produto específico
app.get('/produtos/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('produtos')
    .select('*')
    .eq('id', req.params.id)
    .single();

  if (error) return res.status(404).json({ error: 'Produto não encontrado' });
  res.json(data);
});

// POST /produtos  – cria um produto
app.post('/produtos', async (req, res) => {
  const { nome, descricao, preco, imagem_url, destaque } = req.body;

  if (!nome || preco == null) return res.status(400).json({ error: 'nome e preco são obrigatórios' });

  const { data, error } = await supabase
    .from('produtos')
    .insert({ nome, descricao, preco, imagem_url, destaque: !!destaque })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

// PUT /produtos/:id  – atualiza um produto
app.put('/produtos/:id', async (req, res) => {
  const { nome, descricao, preco, imagem_url, destaque } = req.body;

  const { data, error } = await supabase
    .from('produtos')
    .update({ nome, descricao, preco, imagem_url, destaque })
    .eq('id', req.params.id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// DELETE /produtos/:id  – remove um produto
app.delete('/produtos/:id', async (req, res) => {
  const { error } = await supabase
    .from('produtos')
    .delete()
    .eq('id', req.params.id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ deleted: true });
});

// ─────────────────────────────────────────────────────────────
// PEDIDOS
// ─────────────────────────────────────────────────────────────

// GET /pedidos  – lista todos os pedidos
app.get('/pedidos', async (_req, res) => {
  const { data, error } = await supabase
    .from('pedidos')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// POST /pedidos  – registra um pedido (adicionar ao carrinho)
app.post('/pedidos', async (req, res) => {
  const { produto_id, produto_nome, preco } = req.body;

  const { data, error } = await supabase
    .from('pedidos')
    .insert({ produto_id: produto_id || null, produto_nome, preco })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

// ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🎪 Arraiá API rodando em http://localhost:${PORT}`));
