const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Example route
app.get('/api/data', (req, res) => {
    res.json({ message: 'Hello, World!' });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'your-db-host',
    user: 'your-username',
    password: 'your-password',
    database: 'your-database-name',
});

db.connect(err => {
    if (err) throw err;
    console.log('Connected to the database');
});

app.get('/api/data', (req, res) => {
    db.query('SELECT * FROM your_table', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});