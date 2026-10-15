const express = require("express");
const os = require("os");
const path = require("path");

const VERSION = "1";   // <-- ubah ke "2" untuk mencoba deploy otomatis

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));


let tasks = [
  { id: 1, text: "Deploy aplikasi pertama", done: true },
  { id: 2, text: "Ubah versi lalu push ke GitHub", done: false },
];
let nextId = 3;

app.get("/health", (req, res) => res.json({ status: "ok" }));

app.get("/api/info", (req, res) => {
  res.json({ version: VERSION, hostname: os.hostname(), time: new Date().toISOString() });
});

app.get("/api/tasks", (req, res) => res.json(tasks));

app.post("/api/tasks", (req, res) => {
  const text = (req.body.text || "").trim();
  if (!text) return res.status(400).json({ error: "text wajib diisi" });
  const task = { id: nextId++, text: text.slice(0, 100), done: false };
  tasks.push(task);
  res.status(201).json(task);
});

app.patch("/api/tasks/:id", (req, res) => {
  const task = tasks.find((t) => t.id === Number(req.params.id));
  if (!task) return res.status(404).json({ error: "tidak ditemukan" });
  task.done = !task.done;
  res.json(task);
});

app.delete("/api/tasks/:id", (req, res) => {
  const before = tasks.length;
  tasks = tasks.filter((t) => t.id !== Number(req.params.id));
  if (tasks.length === before) return res.status(404).json({ error: "tidak ditemukan" });
  res.status(204).end();
});

module.exports = app;
