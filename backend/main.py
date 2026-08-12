from datetime import datetime, timezone
from enum import Enum
from uuid import uuid4

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


class Priority(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"


class NoteCreate(BaseModel):
    title: str
    body: str
    priority: Priority = Priority.medium


class Note(BaseModel):
    id: str
    title: str
    body: str
    priority: Priority
    created_at: str


app = FastAPI()

# Allow the Vite dev server to call the API directly if needed.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5173", "http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory store only (no database / file persistence)
notes: dict[str, Note] = {}


@app.get("/")
def root():
    return {"message": "API is running successfully!"}


@app.post("/notes", response_model=Note, status_code=201)
def create_note(payload: NoteCreate) -> Note:
    note = Note(
        id=str(uuid4()),
        title=payload.title,
        body=payload.body,
        priority=payload.priority,
        created_at=datetime.now(timezone.utc).isoformat(),
    )
    notes[note.id] = note
    return note


@app.get("/notes", response_model=list[Note])
def list_notes() -> list[Note]:
    """Return all notes from in-memory storage."""
    return list(notes.values())


@app.get("/notes/{note_id}", response_model=Note)
def get_note(note_id: str) -> Note:
    """Return a single note by id, or 404 if not found."""
    note = notes.get(note_id)
    if note is None:
        raise HTTPException(status_code=404, detail="Note not found")
    return note
