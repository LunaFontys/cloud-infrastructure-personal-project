const express = require("express");
const path = require("path");
const db = require("./database");

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

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

app.patch("/services/:id/status", (req, res) => {
  const id = Number(req.params.id);
  const { status } = req.body;

  const allowedStatuses = [
    "operational",
    "degraded",
    "outage"
  ];

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({
      error: "status must be operational, degraded, or outage"
    });
  }

  const existingService = db.prepare(`
    SELECT id, name, status
    FROM services
    WHERE id = ?
  `).get(id);

  if (!existingService) {
    return res.status(404).json({
      error: "service not found"
    });
  }

  db.prepare(`
    UPDATE services
    SET status = ?
    WHERE id = ?
  `).run(status, id);

  const updatedService = db.prepare(`
    SELECT id, name, status
    FROM services
    WHERE id = ?
  `).get(id);

  res.json(updatedService);
});

app.get("/incidents", (req, res) => {
  const incidents = db.prepare(`
    SELECT
      incidents.id,
      incidents.service_id,
      services.name AS service_name,
      incidents.message,
      incidents.created_at
    FROM incidents
    JOIN services ON incidents.service_id = services.id
    ORDER BY incidents.created_at DESC
  `).all();

  res.json(incidents);
});

app.post("/incidents", (req, res) => {
  const { serviceId, message } = req.body;

  if (!serviceId || !message) {
    return res.status(400).json({
      error: "serviceId and message are required"
    });
  }

  const service = db.prepare(`
    SELECT id
    FROM services
    WHERE id = ?
  `).get(serviceId);

  if (!service) {
    return res.status(404).json({
      error: "service not found"
    });
  }

  const result = db.prepare(`
    INSERT INTO incidents (service_id, message)
    VALUES (?, ?)
  `).run(serviceId, message);

  const incident = db.prepare(`
    SELECT
      incidents.id,
      incidents.service_id,
      services.name AS service_name,
      incidents.message,
      incidents.created_at
    FROM incidents
    JOIN services ON incidents.service_id = services.id
    WHERE incidents.id = ?
  `).get(result.lastInsertRowid);

  res.status(201).json(incident);
});

module.exports = app;