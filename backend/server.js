// Import required modules
const express = require('express');  // Express framework for creating the server and APIs
const cors = require('cors');        // CORS middleware to allow cross-origin requests
const db = require('./db');        // MySQL database connection pool (from custom db.js file)
const path = require('path');        // Built-in Node module to work with file and directory paths
const dotenv = require('dotenv');    // To load environment variables from .env file

// Load variables from .env into process.env
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;    // Use port from .env or default to 3000

// Middleware Setup
app.use(cors());                     // Enable CORS so frontend can call backend
app.use(express.json());             // Parse incoming JSON requests
// app.use(express.static(...));  // Serve static files from "frontend" folder
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'))
// })

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// API Routes
// GET /api/category — Fetch list of categories from the database
app.get('/api/category', async (req, res) => {
  try {
    // Query: Get all categories with their subcategories
    const [categories] = await db.query(`
      SELECT c.id, c.name, s.id as subcategory_id, s.name as subcategory_name
      FROM category c
      LEFT JOIN subcategory s ON c.id = s.category_id
      WHERE c.active = 1
      ORDER BY c.id, s.id
    `);
    
    // Format response - group subcategories under their parent categories
    const formattedCategories = [];
    
    // Add "All Products" category
    formattedCategories.push({
      id: 'all',
      name: 'All Products',
      subcategories: []
    });
    
    // Group subcategories under their parent categories
    const categoryMap = {};
    
    categories.forEach(row => {
      if (!categoryMap[row.id]) {
        categoryMap[row.id] = {
          id: row.id,
          name: row.name,
          subcategories: []
        };
        formattedCategories.push(categoryMap[row.id]);
      }
      
      if (row.subcategory_id) {
        categoryMap[row.id].subcategories.push({
          id: row.subcategory_id,
          name: row.subcategory_name
        });
      }
    });
    
    res.json(formattedCategories);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

app.get('/api/products', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        p.*, 
        c.name AS category, 
        s.name AS subcategory_name
      FROM products p
      JOIN category c ON p.category_id = c.id
      LEFT JOIN subcategory s ON p.subcategory_id = s.id
      WHERE p.active = 1
      ORDER BY c.id, s.id
    `);

    const products = rows.map(row => ({
      id: row.id,
      name: row.product_name,
      price: row.unit_price,
      unit: row.unit_quantity,
      category_id: Number(row.category_id),
      subcategory_id: row.subcategory_id ? Number(row.subcategory_id) : null,
      image: row.image_path,
      inStock: row.in_stock,
      active: row.active === 1
    }));
    
    res.json(products);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.get('/api/checkInventory', async (req, res) => {
  const connection = await db.getConnection();

  try {
    const cartString = req.query.cart;
    if (!cartString) {
      return res.status(400).json({ success: false, error: 'No cart data provided' });
    }

    const items = JSON.parse(cartString);
    const outOfStockItems = [];

    for (const item of items) {
      const [rows] = await connection.execute(
        'SELECT product_name, in_stock FROM products WHERE id = ?',
        [item.id]
      );

      const product = rows[0];
      if (!product || product.in_stock < item.quantity) {
        outOfStockItems.push({ 
          id: item.id, 
          name: product?.product_name || 'Unknown', 
          remainingStock: product?.in_stock ?? 0
        });
      }
    }

    if (outOfStockItems.length > 0) {
      return res.json({ success: false, outOfStockItems });
    }

    return res.json({ success: true });

  } catch (err) {
    console.error('Inventory check error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  } finally {
    connection.release();
  }
});

// Deduct item quantities on order confirmation
app.post('/api/update-inventory', async (req, res) => {
  const cartItems = req.body;
  const connection = await db.getConnection();

  try {
      await connection.beginTransaction();

      for (const item of cartItems) {
          await connection.execute(
              `UPDATE products SET in_stock = in_stock - ? WHERE id = ? AND in_stock >= ?`,
              [item.quantity, item.id, item.quantity]
          );
      }

      await connection.commit();
      res.json({ success: true });
  } catch (err) {
      await connection.rollback();
      console.error('Inventory update error:', err);
      res.status(500).json({ success: false, error: 'Failed to update inventory' });
  } finally {
      connection.release();
  }
});

// GET /api/health — Simple health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});



