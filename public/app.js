const list = document.getElementById("task-list");
const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const counter = document.getElementById("counter");
const message = document.getElementById("message");

function showMessage(text) {
  message.textContent = text || "";
  message.hidden = !text;
}

async function api(path, options) {
  const res = await fetch(path, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || "Terjadi kesalahan");
  }
  return res.status === 204 ? null : res.json();
}

async function loadInfo() {
  try {
    const info = await api("/api/info");
    document.getElementById("version").textContent = "versi " + info.version;
    document.getElementById("host").textContent = "server " + info.hostname.slice(0, 12);
  } catch (e) {
    document.getElementById("version").textContent = "versi ?";
  }
}

function render(tasks) {
  list.innerHTML = "";
  if (tasks.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty";
    empty.textContent = "Belum ada tugas. Tambahkan satu!";
    list.appendChild(empty);
  }
  for (const task of tasks) {
    const li = document.createElement("li");
    if (task.done) li.className = "done";

    const check = document.createElement("input");
    check.type = "checkbox";
    check.checked = task.done;
    check.addEventListener("change", () => act(() => api("/api/tasks/" + task.id, { method: "PATCH" })));

    const text = document.createElement("span");
    text.textContent = task.text;   // textContent, bukan innerHTML, supaya aman dari XSS

    const del = document.createElement("button");
    del.className = "del";
    del.textContent = "Hapus";
    del.addEventListener("click", () => act(() => api("/api/tasks/" + task.id, { method: "DELETE" })));

    li.append(check, text, del);
    list.appendChild(li);
  }
  const done = tasks.filter((t) => t.done).length;
  counter.textContent = done + " dari " + tasks.length + " tugas selesai";
}

async function refresh() {
  render(await api("/api/tasks"));
}

async function act(fn) {
  try {
    showMessage("");
    await fn();
    await refresh();
  } catch (e) {
    showMessage(e.message);
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const value = input.value.trim();
  if (!value) return showMessage("Tulis dulu tugasnya");
  act(async () => {
    await api("/api/tasks", { method: "POST", body: JSON.stringify({ text: value }) });
    input.value = "";
  });
});

loadInfo();
refresh().catch((e) => showMessage(e.message));
