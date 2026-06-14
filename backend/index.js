const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const pool = new Pool({
  host: process.env.PGHOST || 'db',
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || 'example',
  database: process.env.PGDATABASE || 'usersdb',
  port: process.env.PGPORT ? Number(process.env.PGPORT) : 5432,
});

async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      contact TEXT NOT NULL,
      age INTEGER NOT NULL
    )
  `);
}

app.post('/api/users', async (req, res) => {
  const { name, email, contact, age } = req.body;
  if (!name || !email || !contact || !age) return res.status(400).json({ error: 'Missing fields' });
  try {
    const result = await pool.query(
      'INSERT INTO users (name, email, contact, age) VALUES ($1, $2, $3, $4) RETURNING id',
      [name, email, contact, age]
    );
    const id = result.rows[0].id;
    res.status(201).json({ id, name, email, contact, age });
  } catch (err) {
    console.error('DB error', err);
    res.status(500).json({ error: 'DB error' });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, email, contact, age FROM users ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error('DB error', err);
    res.status(500).json({ error: 'DB error' });
  }
});

const PORT = process.env.PORT || 4000;
initDb().then(() => {
  app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
}).catch(err => {
  console.error('Failed to initialize DB', err);
  process.exit(1);
});
