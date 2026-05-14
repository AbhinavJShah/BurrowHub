require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();
app.use(cors({
  origin: ["http://localhost:5173", "https://your-vercel-app.vercel.app"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());

// ─── HEALTH CHECK ─────────────────────────────────────────
app.get("/", (req, res) => {
  res.send("BorrowHub API Running");
});

// ─── USERS ────────────────────────────────────────────────

// Create user
app.post("/users", async (req, res) => {
  try {
    const { name, email } = req.body;
    const result = await pool.query(
      `INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *`,
      [name, email]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Get all users
app.get("/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// ─── ITEMS ────────────────────────────────────────────────

// Get all items
app.get("/items", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM items ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Get items by owner
app.get("/my-items/:owner_id", async (req, res) => {
  try {
    const { owner_id } = req.params;
    const result = await pool.query(
      `SELECT * FROM items WHERE owner_id = $1 ORDER BY created_at DESC`,
      [owner_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Create item
app.post("/items", async (req, res) => {
  try {
    const { owner_id, title, category, description } = req.body;
    const result = await pool.query(
      `INSERT INTO items (owner_id, title, category, description)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [owner_id, title, category, description]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Delete item
app.delete("/items/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query(`DELETE FROM items WHERE id = $1`, [id]);
    res.json({ message: "Item deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// ─── REQUESTS ─────────────────────────────────────────────

// Create borrow request
app.post("/request-item", async (req, res) => {
  try {
    const { item_id, borrower_id } = req.body;

    // Check if request already exists
    const existing = await pool.query(
      `SELECT * FROM requests 
       WHERE item_id = $1 AND borrower_id = $2 
       AND status NOT IN ('rejected', 'returned')`,
      [item_id, borrower_id]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ error: "You have already requested this item!" });
    }

    const result = await pool.query(
      `INSERT INTO requests (item_id, borrower_id) VALUES ($1, $2) RETURNING *`,
      [item_id, borrower_id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// View requests made by a borrower
app.get("/my-requests/:borrower_id", async (req, res) => {
  try {
    const { borrower_id } = req.params;
    const result = await pool.query(
      `SELECT requests.*, items.title, items.category
       FROM requests
       JOIN items ON requests.item_id = items.id
       WHERE borrower_id = $1
       ORDER BY requests.created_at DESC`,
      [borrower_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// View requests received by an owner
app.get("/received-requests/:owner_id", async (req, res) => {
  try {
    const { owner_id } = req.params;
    const result = await pool.query(
      `SELECT requests.*, items.title, items.category, users.name AS borrower_name
       FROM requests
       JOIN items ON requests.item_id = items.id
       JOIN users ON requests.borrower_id = users.id
       WHERE items.owner_id = $1
       ORDER BY requests.created_at DESC`,
      [owner_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Approve / Reject / Return a request
app.put("/update-request/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowed = ["pending", "approved", "rejected", "returned"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const result = await pool.query(
      `UPDATE requests SET status = $1 WHERE id = $2 RETURNING *`,
      [status, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
// ─── NEEDS ────────────────────────────────────────────────

// Post a need
app.post("/needs", async (req, res) => {
  try {
    const { requester_id, title, description, days_needed } = req.body;

    if (!title || !days_needed) {
      return res.status(400).json({ error: "Title and days needed are required!" });
    }

    const result = await pool.query(
      `INSERT INTO needs (requester_id, title, description, days_needed)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [requester_id, title, description, days_needed]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Get all open needs
app.get("/needs", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT needs.*, users.name AS requester_name
       FROM needs
       JOIN users ON needs.requester_id = users.id
       WHERE needs.status = 'open'
       ORDER BY needs.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Get my needs
app.get("/my-needs/:requester_id", async (req, res) => {
  try {
    const { requester_id } = req.params;
    const result = await pool.query(
      `SELECT * FROM needs
       WHERE requester_id = $1
       ORDER BY created_at DESC`,
      [requester_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Mark need as fulfilled
app.put("/needs/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowed = ["open", "fulfilled"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const result = await pool.query(
      `UPDATE needs SET status = $1 WHERE id = $2 RETURNING *`,
      [status, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// ─── START SERVER ─────────────────────────────────────────
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});