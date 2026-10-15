const express = require("express");
const os = require("os");

const VERSION = "1";   // <-- ubah ini ke "2" untuk mencoba deploy otomatis

const app = express();

app.get("/", (req, res) => {
  res.send(`
    <html>
      <body style="font-family: sans-serif; text-align: center; margin-top: 80px;">
        <h1>Halo DevOps! 🚀</h1>
        <p>Versi aplikasi: <b>${VERSION}</b></p>
        <p>Server: ${os.hostname()}</p>
      </body>
    </html>
  `);
});

app.get("/health", (req, res) => res.json({ status: "ok" }));

app.get("/api/info", (req, res) => {
  res.json({ version: VERSION, hostname: os.hostname(), time: new Date().toISOString() });
});

module.exports = app;
