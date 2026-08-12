type Priority = "low" | "medium" | "high";

interface Note {
  id: string;
  title: string;
  body: string;
  priority: Priority;
  created_at: string;
}

const API_BASE = "";

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("App root not found");
}

app.innerHTML = `
  <main class="page">
    <h1>Research Notes</h1>

    <section class="card">
      <h2>Create note</h2>
      <form id="note-form">
        <label>
          Title
          <input id="title" name="title" type="text" required maxlength="200" />
        </label>
        <label>
          Body
          <textarea id="body" name="body" rows="4" required></textarea>
        </label>
        <label>
          Priority
          <select id="priority" name="priority">
            <option value="medium" selected>medium (default)</option>
            <option value="low">low</option>
            <option value="high">high</option>
          </select>
        </label>
        <button type="submit">Create note</button>
      </form>
    </section>

    <section id="status" class="status" hidden role="status" aria-live="polite"></section>

    <section class="card">
      <div class="list-header">
        <h2>Notes</h2>
        <button type="button" id="refresh-btn">Refresh</button>
      </div>
      <ul id="notes-list" class="notes-list"></ul>
    </section>
  </main>
`;

const form = document.querySelector<HTMLFormElement>("#note-form")!;
const titleInput = document.querySelector<HTMLInputElement>("#title")!;
const bodyInput = document.querySelector<HTMLTextAreaElement>("#body")!;
const prioritySelect = document.querySelector<HTMLSelectElement>("#priority")!;
const statusBox = document.querySelector<HTMLElement>("#status")!;
const notesList = document.querySelector<HTMLUListElement>("#notes-list")!;
const refreshBtn = document.querySelector<HTMLButtonElement>("#refresh-btn")!;

function showStatus(message: string, kind: "success" | "error"): void {
  statusBox.hidden = false;
  statusBox.textContent = message;
  statusBox.className = `status ${kind}`;
}

function clearStatus(): void {
  statusBox.hidden = true;
  statusBox.textContent = "";
  statusBox.className = "status";
}

function renderNotes(notes: Note[]): void {
  if (notes.length === 0) {
    notesList.innerHTML = `<li class="empty">No notes yet. Create one above.</li>`;
    return;
  }

  notesList.innerHTML = notes
    .map(
      (note) => `
      <li class="note">
        <div class="note-top">
          <strong>${escapeHtml(note.title)}</strong>
          <span class="badge priority-${escapeHtml(note.priority)}">${escapeHtml(note.priority)}</span>
        </div>
        <p>${escapeHtml(note.body)}</p>
        <div class="meta">
          <span>id: ${escapeHtml(note.id)}</span>
          <span>${escapeHtml(note.created_at)}</span>
        </div>
      </li>
    `
    )
    .join("");
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

async function loadNotes(): Promise<void> {
  try {
    const res = await fetch(`${API_BASE}/notes`);
    if (!res.ok) {
      throw new Error(`Failed to load notes (${res.status})`);
    }
    const notes = (await res.json()) as Note[];
    renderNotes(notes);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load notes";
    showStatus(message, "error");
    notesList.innerHTML = `<li class="empty">Could not load notes.</li>`;
  }
}

async function createNote(event: SubmitEvent): Promise<void> {
  event.preventDefault();
  clearStatus();

  const payload = {
    title: titleInput.value.trim(),
    body: bodyInput.value.trim(),
    priority: prioritySelect.value as Priority,
  };

  if (!payload.title || !payload.body) {
    showStatus("Title and body are required.", "error");
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      let detail = `Create failed (${res.status})`;
      try {
        const data = (await res.json()) as { detail?: unknown };
        if (typeof data.detail === "string") {
          detail = data.detail;
        } else if (Array.isArray(data.detail)) {
          detail = data.detail
            .map((item) => {
              if (item && typeof item === "object" && "msg" in item) {
                return String((item as { msg: string }).msg);
              }
              return JSON.stringify(item);
            })
            .join("; ");
        }
      } catch {
        // keep default detail
      }
      showStatus(detail, "error");
      return;
    }

    const note = (await res.json()) as Note;
    showStatus(`Note created successfully (id: ${note.id}).`, "success");
    form.reset();
    prioritySelect.value = "medium";
    await loadNotes();
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Network error while creating note";
    showStatus(message, "error");
  }
}

form.addEventListener("submit", (event) => {
  void createNote(event);
});

refreshBtn.addEventListener("click", () => {
  clearStatus();
  void loadNotes();
});

void loadNotes();
