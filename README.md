# CodeAlpha_Ecommerce
# CodeAlpha | E-Commerce Web Application

A minimalist, fully responsive, full-stack e-commerce web application inspired by Apple's clean design aesthetic. Built using Node.js, Express, SQLite, and a vanilla JavaScript Single Page Application (SPA) approach.

---

## 🚀 Features

* **Apple-Inspired Minimalist UI:** Dark-themed, sleek layout featuring high-end typography, full-width global navigation, and responsive product cards.
* **Dynamic Product Catalogs & Image Sliders:** Interactive multi-image sliders and detailed product specifications for each item.
* **User Authentication:** Secure registration and login flow with "Enter" key shortcut support.
* **Shopping Bag & Checkout:** Seamless cart management that calculates totals instantly and processes orders.
* **User-Specific Order Tracking:** A dedicated Orders page that securely fetches and displays past order receipts directly from the SQLite database, complete with collapsible itemized detail dropdowns.
* **Full-Stack Architecture:** RESTful API backend built with Express.js connected to a local SQLite database.

---

## 🛠️ Tech Stack

* **Frontend:** HTML5, CSS3 (Custom Grid/Flexbox, Dark Theme), JavaScript (SPA Navigation)
* **Backend:** Node.js, Express.js
* **Database:** SQLite3

---

## 📁 Project Structure

```text
CodeAlpha_Ecommerce/
├── public/                 # Frontend static files
│   ├── index.html          # Main HTML structure & SPA views
│   ├── style.css           # Global Apple-themed styling & components
│   └── app.js              # Frontend logic, API calls, and UI state management
├── server.js               # Node.js & Express backend server / SQLite setup
├── package.json            # Project metadata and dependencies
└── .gitignore              # Specifies intentionally untracked files (node_modules, *.db)
