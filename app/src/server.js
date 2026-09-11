const express = require("express");
const db = require("./database");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy"
  });
});

app.get("/services", (req, res) => {
  const services = db.prepare(`
    SELECT id, name, status
    FROM services
    ORDER BY id
  `).all();

  res.json(services);
});

app.post("/services", (req, res) => {
  const { name, status = "operational" } = req.body;

  if (!name) {
    return res.status(400).json({
      error: "name is required"
    });
  }

  const statement = db.prepare(`
    INSERT INTO services (name, status)
    VALUES (?, ?)
  `);

  const result = statement.run(name, status);

  const service = db.prepare(`
    SELECT id, name, status
    FROM services
    WHERE id = ?
  `).get(result.lastInsertRowid);

  res.status(201).json(service);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});