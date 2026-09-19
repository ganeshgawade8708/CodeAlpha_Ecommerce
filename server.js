const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Change this line (around line 13):
const db = new sqlite3.Database('./ecommerce_v2.db', (err) => {
    if (err) console.error(err.message);
    console.log('Connected to the SQLite database V2.');
});

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, password TEXT)`);
    db.run(`CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, price REAL, description TEXT)`);
    
    // FORCE UPDATE: Drop the old orders table and create the new one with the 'items' column
    db.run(`DROP TABLE IF EXISTS orders`, () => {
        db.run(`CREATE TABLE orders (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, total REAL, status TEXT, items TEXT)`);
    }); 

    db.get("SELECT COUNT(*) AS count FROM products", (err, row) => {
        if (row.count === 0) {
            const laptopSpecs = `<div class="product-slider-container"><button class="slider-btn prev" onclick="slideImages(this, -1)">&#10094;</button><div class="slider-wrapper"><img src="1.jpg" alt="Front Display" class="slider-img"><img src="2.jpg" alt="Keyboard" class="slider-img"><img src="3.jpg" alt="Colors" class="slider-img"><img src="4.jpg" alt="Apps" class="slider-img"><img src="5.jpg" alt="A18 Pro Chip" class="slider-img"><img src="6.jpg" alt="In the Box" class="slider-img"></div><button class="slider-btn next" onclick="slideImages(this, 1)">&#10095;</button></div><p class="item-subtitle">A18 Pro - (8 GB/512 GB SSD/Tahoe) MHFG4HN/A (13 inch, Indigo, 1.23 kg)</p><div class="spec-table"><div class="spec-row"><span class="spec-key">In the Box</span><span class="spec-val">1 x MacBook Neo, 1 x 20W USB-C Power Adapter, 1 x USB-C Charge Cable (1.5 m)</span></div><div class="spec-row"><span class="spec-key">Processor Brand</span><span class="spec-val">Apple</span></div><div class="spec-row"><span class="spec-key">Processor Name</span><span class="spec-val">A18 Pro (6 Cores)</span></div><div class="spec-row"><span class="spec-key">RAM</span><span class="spec-val">8 GB (Unified Memory)</span></div><div class="spec-row"><span class="spec-key">Storage</span><span class="spec-val">512 GB SSD</span></div><div class="spec-row"><span class="spec-key">Operating System</span><span class="spec-val">Mac OS</span></div><div class="spec-row"><span class="spec-key">Graphic Processor</span><span class="spec-val">NA</span></div></div>`;
            const iphoneSpecs = `<div class="product-slider-container"><button class="slider-btn prev" onclick="slideImages(this, -1)">&#10094;</button><div class="slider-wrapper"><img src="s1.jpg" alt="iPhone 17 Back" class="slider-img"><img src="s2.jpg" alt="iPhone 17 Front" class="slider-img"><img src="s3.jpg" alt="iPhone 17 Camera" class="slider-img"><img src="s4.jpg" alt="iPhone 17 Colors" class="slider-img"><img src="s5.jpg" alt="iPhone 17 In Box" class="slider-img"><img src="s6.jpg" alt="iPhone 17 Accessories" class="slider-img"></div><button class="slider-btn next" onclick="slideImages(this, 1)">&#10095;</button></div><p class="item-subtitle">Apple iPhone 17 (White, 256 GB)</p><div class="spec-table"><div class="spec-row"><span class="spec-key">Display Size</span><span class="spec-val">16.0 cm (6.3 inch)</span></div><div class="spec-row"><span class="spec-key">Resolution</span><span class="spec-val">2622 x 1206 Pixels (Super Retina XDR)</span></div><div class="spec-row"><span class="spec-key">Display Type</span><span class="spec-val">All Screen OLED Display</span></div><div class="spec-row"><span class="spec-key">GPU</span><span class="spec-val">5 core GPU with Neural Accelerators</span></div><div class="spec-row"><span class="spec-key">Battery Type</span><span class="spec-val">Lithium Ion</span></div><div class="spec-row"><span class="spec-key">Dimensions</span><span class="spec-val">71.5 mm x 7.95 mm x 149.6 mm</span></div><div class="spec-row"><span class="spec-key">Weight</span><span class="spec-val">177 g</span></div></div>`;
            const airpodsSpecs = `<div class="product-slider-container"><button class="slider-btn prev" onclick="slideImages(this, -1)">&#10094;</button><div class="slider-wrapper"><img src="e1.jpg" alt="AirPods 4 Earbuds" class="slider-img"><img src="e2.jpg" alt="AirPods 4 in Case" class="slider-img"><img src="e4.jpg" alt="30 Hours Battery" class="slider-img"><img src="e5.jpg" alt="What's in the Box" class="slider-img"></div><button class="slider-btn next" onclick="slideImages(this, 1)">&#10095;</button></div><p class="item-subtitle">Personalised Spatial Audio, Sweat and Water Resistant Bluetooth Headset (White, True Wireless)</p><div class="spec-table"><div class="spec-row"><span class="spec-key">Model ID</span><span class="spec-val">MXP63HN/A</span></div><div class="spec-row"><span class="spec-key">Color</span><span class="spec-val">White</span></div><div class="spec-row"><span class="spec-key">Headphone Type</span><span class="spec-val">True Wireless Earbud</span></div><div class="spec-row"><span class="spec-key">Connectivity</span><span class="spec-val">Bluetooth</span></div><div class="spec-row"><span class="spec-key">Compatible Devices</span><span class="spec-val">Laptop, Mobile, Tablet</span></div><div class="spec-row"><span class="spec-key">Fast Charging</span><span class="spec-val">Yes</span></div><div class="spec-row"><span class="spec-key">Noise Cancellation</span><span class="spec-val">No</span></div><div class="spec-row"><span class="spec-key">In the Box</span><span class="spec-val">Headphone, Charging Case</span></div></div>`;

            db.run(`INSERT INTO products (name, price, description) VALUES ('Apple Macbook Neo A18 Pro', 1499.99, ?)`, [laptopSpecs]);
            db.run(`INSERT INTO products (name, price, description) VALUES ('Apple iPhone 17', 799.99, ?)`, [iphoneSpecs]);
            db.run(`INSERT INTO products (name, price, description) VALUES ('Apple AirPods 4', 129.99, ?)`, [airpodsSpecs]);
        }
    });
});

app.post('/api/register', (req, res) => {
    const { username, password } = req.body;
    db.run(`INSERT INTO users (username, password) VALUES (?, ?)`, [username, password], function(err) {
        if (err) return res.status(400).json({ error: "Username already exists" });
        res.json({ id: this.lastID, username });
    });
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    db.get(`SELECT * FROM users WHERE username = ? AND password = ?`, [username, password], (err, user) => {
        if (user) res.json({ message: "Login successful", user });
        else res.status(401).json({ error: "Invalid credentials" });
    });
});

app.get('/api/products', (req, res) => {
    db.all(`SELECT * FROM products`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// UPDATED: Now receives and saves `items` (the cart) as a JSON string
app.post('/api/orders', (req, res) => {
    const { userId, total, items } = req.body;
    const itemsJson = JSON.stringify(items);
    
    db.run(`INSERT INTO orders (user_id, total, status, items) VALUES (?, ?, 'Processing', ?)`, [userId, total, itemsJson], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Order placed successfully!", orderId: this.lastID });
    });
});

app.get('/api/orders/:userId', (req, res) => {
    const userId = req.params.userId;
    db.all(`SELECT * FROM orders WHERE user_id = ? ORDER BY id DESC`, [userId], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});