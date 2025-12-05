// Importação das dependências
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path'); // [NOVO] Importante para encontrar a pasta frontend
const { createClient } = require('@supabase/supabase-js');

// Criação do cliente Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Inicia o servidor Express
const app = express();
app.use(cors());
app.use(express.json());

// --- ROTA PARA A PÁGINA INICIAL ---
// [NOVO] Resolve o erro "Cannot GET /" enviando o arquivo HTML
app.get('/', (req, res) => {
  res.send('api esta rodando!');
});
// ----------------------------------

// Rota GET - Listar todos os feedbacks
app.get("/feedbacks", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("feedbacks")
      .select("*");

    if (error) throw error;
    res.status(200).json(data);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Rota POST - Criar um novo feedback
app.post("/feedbacks", async (req, res) => {
  const { usuario, comentario, nota } = req.body;

  try {
    const { data, error } = await supabase
      .from("feedbacks")
      .insert([{ usuario, comentario, nota }])
      .select();

    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Rota PUT - Atualizar um feedback
app.put("/feedbacks/:id", async (req, res) => {
  const { id } = req.params;
  const { usuario, comentario, nota } = req.body;

  try {
    const { data, error } = await supabase
      .from("feedbacks")
      .update({ usuario, comentario, nota })
      .eq("id", id)
      .select();

    if (error) throw error;
    res.status(200).json(data[0]);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Rota DELETE - Remover um feedback
app.delete("/feedbacks/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const { error } = await supabase
      .from("feedbacks")
      .delete()
      .eq("id", id);

    if (error) throw error;
    res.status(200).json({ message: "Feedback removido." });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});