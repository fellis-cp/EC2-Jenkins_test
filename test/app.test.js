const test = require("node:test");
const assert = require("node:assert");
const app = require("../app");

let server, base;
test.before(async () => {
  await new Promise((resolve) => { server = app.listen(0, resolve); });
  base = `http://localhost:${server.address().port}`;
});
test.after(() => server.close());

const json = (path, options = {}) =>
  fetch(base + path, { headers: { "Content-Type": "application/json" }, ...options });

test("GET /health mengembalikan status ok", async () => {
  const res = await json("/health");
  assert.strictEqual(res.status, 200);
  assert.strictEqual((await res.json()).status, "ok");
});

test("GET /api/info punya version", async () => {
  const body = await (await json("/api/info")).json();
  assert.ok(body.version);
});

test("GET / menyajikan halaman HTML frontend", async () => {
  const res = await fetch(base + "/");
  const html = await res.text();
  assert.strictEqual(res.status, 200);
  assert.ok(html.includes("Task Board"));
});

test("tambah, centang, lalu hapus tugas", async () => {
  const created = await json("/api/tasks", { method: "POST", body: JSON.stringify({ text: "tes" }) });
  assert.strictEqual(created.status, 201);
  const task = await created.json();
  assert.strictEqual(task.done, false);

  const toggled = await (await json("/api/tasks/" + task.id, { method: "PATCH" })).json();
  assert.strictEqual(toggled.done, true);

  const deleted = await json("/api/tasks/" + task.id, { method: "DELETE" });
  assert.strictEqual(deleted.status, 204);
});

test("tugas kosong ditolak", async () => {
  const res = await json("/api/tasks", { method: "POST", body: JSON.stringify({ text: "   " }) });
  assert.strictEqual(res.status, 400);
});
