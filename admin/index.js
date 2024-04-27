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

app.post('/login/admin', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username dan password diperlukan' });
  }

  const encryptedPassword = md5(password);

  const sql = `SELECT * FROM admin WHERE username = ? AND password = ?`;

  db.query(sql, [username, encryptedPassword], (err, results) => {
    if (err) {
      throw err;
    }

    if (results.length > 0) {
      res.json({ success: true, message: 'Login berhasil' });
    } else {
      res.status(401).json({ success: false, message: 'Login gagal, username atau password salah' });
    }
  });
});

app.post('/register/admin', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username dan password diperlukan' });
  }

  const encryptedPassword = md5(password);

  const sqlCheckExistence = `SELECT * FROM admin WHERE username = ?`;

  db.query(sqlCheckExistence, [username], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server' });
    }

    if (results.length > 0) {
      return res.status(400).json({ success: false, message: 'Username sudah digunakan' });
    } else {
      const sqlInsertAdmin = `INSERT INTO admin (username, password) VALUES (?, ?)`;
      
      db.query(sqlInsertAdmin, [username, encryptedPassword], (err, result) => {
        if (err) {
          return res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server' });
        }
        
        res.json({ success: true, message: 'Akun admin berhasil dibuat' });
      });
    }
  });
});

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
