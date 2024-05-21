const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const app = express();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const dbPath = path.resolve(__dirname, 'db', 'sqlite(1).db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('成功連接到 SQLite 資料庫。');
});

app.get('/prices', (req, res) => {
    const query = req.query.query || '';
    const sql = query ? `SELECT * FROM product_price_changes WHERE item_name LIKE ?` : `SELECT * FROM product_price_changes`;
    const params = query ? [`%${query}%`] : [];

    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.post('/prices', (req, res) => {
    const { item_name, date, price } = req.body;
    const sql = `INSERT INTO product_price_changes (日期, 產品名稱, 金額) VALUES (?, ?, ?)`;
    const params = [item_name, date, price];

    db.run(sql, params, function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({ id: this.lastID });
    });
});

module.exports = app;
