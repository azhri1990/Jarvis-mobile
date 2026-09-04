const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 8000;

const dataDir = path.join(__dirname, "data");
const notesFile = path.join(dataDir, "notes.json");
const tasksFile = path.join(dataDir, "tasks.json");
const memoryFile = path.join(dataDir, "memory.json");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

function ensureDataFiles() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(notesFile)) fs.writeFileSync(notesFile, "[]");
  if (!fs.existsSync(tasksFile)) fs.writeFileSync(tasksFile, "[]");
  if (!fs.existsSync(memoryFile)) fs.writeFileSync(memoryFile, "{}");
}

function readJson(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
}

function writeJson(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function getNotes() {
  return readJson(notesFile, []);
}

function saveNotes(notes) {
  writeJson(notesFile, notes);
}

function getTasks() {
  return readJson(tasksFile, []);
}

function saveTasks(tasks) {
  writeJson(tasksFile, tasks);
}

function getMemory() {
  return readJson(memoryFile, {});
}

function saveMemory(memory) {
  writeJson(memoryFile, memory);
}

function escapeHtml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderPage(message = "") {
  const notes = getNotes();
  const tasks = getTasks();

  const notesHtml = notes.length
    ? notes.map((n) => `<li class="item">${escapeHtml(n.text)}</li>`).join("")
    : "<li class='item empty'>No notes yet</li>";

  const tasksHtml = tasks.length
    ? tasks.map((t) => `
        <li class="item">
          <span>${escapeHtml(t.text)}</span>
          <span class="badge ${t.done ? "done" : "open"}">${t.done ? "Done" : "Open"}</span>
        </li>
      `).join("")
    : "<li class='item empty'>No tasks yet</li>";

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>JARVIS Mobile</title>
    <style>
      * { box-sizing: border-box; }
      body {
        margin: 0;
        font-family: Arial, sans-serif;
        background: linear-gradient(180deg, #0b1020, #11182d);
        color: white;
        padding: 16px;
      }
      .app { max-width: 480px; margin: 0 auto; }
      .header { margin-bottom: 16px; }
      .title { font-size: 28px; font-weight: bold; }
      .subtitle { color: #9fb3c8; margin-top: 6px; font-size: 14px; }
      .card {
        background: #161f36;
        border: 1px solid #243250;
        border-radius: 16px;
        padding: 16px;
        margin-bottom: 16px;
        box-shadow: 0 8px 24px rgba(0,0,0,0.25);
      }
      .message {
        background: #0f2e1f;
        color: #8ff7b2;
        border: 1px solid #1f6a47;
        padding: 12px;
        border-radius: 12px;
        margin-bottom: 12px;
      }
      .label { font-size: 14px; color: #a8bfd8; margin-bottom: 8px; }
      input {
        width: 100%;
        padding: 14px;
        font-size: 16px;
        border-radius: 12px;
        border: 1px solid #2a3c60;
        background: #0f1729;
        color: white;
        outline: none;
      }
      input::placeholder { color: #6f86a3; }
      button {
        width: 100%;
        padding: 14px;
        margin-top: 10px;
        background: linear-gradient(90deg, #1d8cf8, #3358ff);
        color: white;
        border: none;
        border-radius: 12px;
        font-size: 16px;
        font-weight: bold;
      }
      h3 { margin: 0 0 12px 0; font-size: 18px; }
      ul { list-style: none; padding: 0; margin: 0; }
      .item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        padding: 12px;
        border-radius: 12px;
        background: #0f1729;
        border: 1px solid #21304e;
        margin-bottom: 10px;
      }
      .empty { color: #8ba0b8; justify-content: center; }
      .badge {
        padding: 6px 10px;
        border-radius: 999px;
        font-size: 12px;
        font-weight: bold;
      }
      .badge.open { background: #3a2c08; color: #ffd76a; }
      .badge.done { background: #123222; color: #7ef0aa; }
      .tips { color: #9fb3c8; font-size: 13px; line-height: 1.6; }
      .tips div { margin-bottom: 6px; }
    </style>
  </head>
  <body>
    <div class="app">
      <div class="header">
        <div class="title">JARVIS Mobile</div>
        <div class="subtitle">Notes, tasks, and memory in one lightweight mobile dashboard.</div>
      </div>

      <div class="card">
        ${message ? `<div class="message">${escapeHtml(message)}</div>` : ""}
        <div class="label">Enter a command</div>
        <form method="POST" action="/command">
          <input name="command" placeholder="add note buy milk" required />
          <button type="submit">Run Command</button>
        </form>
      </div>

      <div class="card">
        <h3>Notes</h3>
        <ul>${notesHtml}</ul>
      </div>

      <div class="card">
        <h3>Tasks</h3>
        <ul>${tasksHtml}</ul>
      </div>

      <div class="card">
        <h3>Examples</h3>
        <div class="tips">
          <div>add note buy milk</div>
          <div>add task finish homework</div>
          <div>done task finish homework</div>
          <div>remember my name is Alex</div>
          <div>what do you remember about my name</div>
          <div>show notes</div>
          <div>show tasks</div>
        </div>
      </div>
    </div>
  </body>
  </html>
  `;
}

function processCommand(input) {
  const command = String(input || "").trim();
  const lower = command.toLowerCase();

  const notes = getNotes();
  const tasks = getTasks();
  const memory = getMemory();

  if (lower.startsWith("add note ")) {
    const text = command.slice(9).trim();
    if (!text) return "Note text is empty.";
    notes.push({ id: Date.now(), text });
    saveNotes(notes);
    return `Note added: ${text}`;
  }

  if (lower.startsWith("add task ")) {
    const text = command.slice(9).trim();
    if (!text) return "Task text is empty.";
    tasks.push({ id: Date.now(), text, done: false });
    saveTasks(tasks);
    return `Task added: ${text}`;
  }

  if (lower.startsWith("done task ")) {
    const text = command.slice(10).trim().toLowerCase();
    const task = tasks.find((t) => t.text.toLowerCase() === text);
    if (!task) return "Task not found.";
    task.done = true;
    saveTasks(tasks);
    return `Task marked done: ${task.text}`;
  }

  if (lower.startsWith("remember ")) {
    const body = command.slice(9).trim();
    const match = body.match(/^(.+?)\s+is\s+(.+)$/i);
    if (!match) return "Use format: remember name is value";
    const key = match[1].trim().toLowerCase();
    const value = match[2].trim();
    memory[key] = value;
    saveMemory(memory);
    return `I will remember ${key} is ${value}`;
  }

  if (lower.startsWith("what do you remember about ")) {
    const key = command.slice(28).trim().toLowerCase();
    return memory[key] ? `${key}: ${memory[key]}` : `No memory for ${key}`;
  }

  if (lower === "show notes") {
    return notes.length ? notes.map((n) => n.text).join(" | ") : "No notes saved.";
  }

  if (lower === "show tasks") {
    return tasks.length ? tasks.map((t) => `${t.text} [${t.done ? "done" : "open"}]`).join(" | ") : "No tasks saved.";
  }

  return "Unknown command.";
}

app.get("/", (req, res) => {
  res.send(renderPage(req.query.message || ""));
});

app.post("/command", (req, res) => {
  const result = processCommand(req.body.command);
  res.redirect("/?message=" + encodeURIComponent(result));
});

ensureDataFiles();

app.listen(PORT, () => {
  console.log(`JARVIS running at http://localhost:${PORT}`);
});
