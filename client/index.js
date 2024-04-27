const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const md5 = require('md5');

const app = express();
const port = 3000;

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'login'
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Terhubung ke database MySQL');
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/login/client', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username dan password diperlukan' });
  }

  const encryptedPassword = md5(password);

  const sql = `SELECT * FROM loginclient WHERE user_client = ? AND pass_client = ?`;

  db.query(sql, [username, encryptedPassword], (err, results) => {
    if (err) {
      throw err;
    }

    if (results.length > 0) {
      res.json({ success: true, message: 'Login berhasil' });
    } else {
      res.json({ success: false, message: 'Login gagal, username atau password salah' });
    }
  });
});

app.post('/register/client', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username dan password diperlukan' });
  }

  const encryptedPassword = md5(password);

  const sqlCheckExistence = `SELECT * FROM loginclient WHERE user_client = ?`;

  db.query(sqlCheckExistence, [username], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server' });
    }

    if (results.length > 0) {
      return res.status(400).json({ success: false, message: 'Username sudah digunakan' });
    } else {
      const sqlInsertClient = `INSERT INTO loginclient (user_client, pass_client) VALUES (?, ?)`;
      
      db.query(sqlInsertClient, [username, encryptedPassword], (err, result) => {
        if (err) {
          return res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server' });
        }
        
        res.json({ success: true, message: 'Akun client berhasil dibuat' });
      });
    }
  });
});

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
