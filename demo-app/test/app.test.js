const test = require("node:test");
const assert = require("node:assert");
const app = require("../app");

function start() {
  return new Promise((resolve) => {
    const server = app.listen(0, () => resolve(server));
  });
}

test("GET /health mengembalikan status ok", async () => {
  const server = await start();
  const res = await fetch(`http://localhost:${server.address().port}/health`);
  const body = await res.json();
  server.close();
  assert.strictEqual(res.status, 200);
  assert.strictEqual(body.status, "ok");
});

test("GET /api/info punya field version", async () => {
  const server = await start();
  const res = await fetch(`http://localhost:${server.address().port}/api/info`);
  const body = await res.json();
  server.close();
  assert.ok(body.version);
});
