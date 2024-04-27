const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static('/public'));

app.post('/login/admin', (req, res) => {
  
});

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
