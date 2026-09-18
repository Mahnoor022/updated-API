require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
 const port = process.env.PORT || 3000;

app.use(express.json());

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url} - ${new Date()}`);
    next();
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => res.send('My Week 2 API!'));

app.post('/register', (req, res) => {
  const { name, email } = req.body;
if (!name || !email) {return res.status(400).json({ error: 'Missing fields' });
  }
  res.status(400).json({ message: `Registered: ${name}` });
});
 

app.get('/user/:id', (req, res) => {
  const userId = req.params.id;
  res.json({ id: userId, name: `User ${userId}` });
});

 
app.listen(port, () =>  console.log(`Server running on http://localhost:${port}`));