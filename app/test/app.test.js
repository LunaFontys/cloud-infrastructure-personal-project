const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");

const testDirectory = fs.mkdtempSync(
  path.join(os.tmpdir(), "cloud-project-test-")
);

process.env.DATABASE_PATH = path.join(
  testDirectory,
  "test.db"
);

const app = require("../src/app");
const db = require("../src/database");

let server;
let baseUrl;

test.before(() => {
  server = app.listen(0);

  const address = server.address();

  baseUrl = `http://127.0.0.1:${address.port}`;
});

test.after(async () => {
    await new Promise((resolve, reject) => {
      server.close((error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  
    db.close();
  
    fs.rmSync(testDirectory, {
      recursive: true,
      force: true
    });
  });

test("GET /health returns healthy status", async () => {
  const response = await fetch(`${baseUrl}/health`);
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.status, "healthy");
});

test("POST /services creates a service", async () => {
  const response = await fetch(`${baseUrl}/services`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: "Test Service"
    })
  });

  const body = await response.json();

  assert.equal(response.status, 201);
  assert.equal(body.name, "Test Service");
  assert.equal(body.status, "operational");
});

test("invalid service status is rejected", async () => {
  const createResponse = await fetch(`${baseUrl}/services`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: "Status Test Service"
    })
  });

  const service = await createResponse.json();

  const response = await fetch(
    `${baseUrl}/services/${service.id}/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        status: "broken"
      })
    }
  );

  const body = await response.json();

  assert.equal(response.status, 400);
  assert.equal(
    body.error,
    "status must be operational, degraded, or outage"
  );
});