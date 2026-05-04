import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/")({
  component: NotesApp,
  head: () => ({
    meta: [
      { title: "My Notes — Capture ideas, fast" },
      {
        name: "description",
        content:
          "A clean, modern notes app to quickly capture, edit, and organize your thoughts.",
      },
    ],
  }),
});

type Note = {
  id: string;
  text: string;
  createdAt: number;
};

const STORAGE_KEY = "my-notes:v1";

function loadNotes(): Note[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Note[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function formatTime(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function NotesApp() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [draft, setDraft] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [hydrated, setHydrated] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const editRef = useRef<HTMLTextAreaElement>(null);

  // Load from localStorage on mount
  useEffect(() => {
    setNotes(loadNotes());
    setHydrated(true);
    inputRef.current?.focus();
  }, []);

  // Persist whenever notes change (after initial hydration)
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    } catch {
      // ignore storage errors
    }
  }, [notes, hydrated]);

  // Focus the textarea when entering edit mode
  useEffect(() => {
    if (editingId && editRef.current) {
      editRef.current.focus();
      const len = editRef.current.value.length;
      editRef.current.setSelectionRange(len, len);
    }
  }, [editingId]);

  const addNote = () => {
    const text = draft.trim();
    if (!text) return;
    const note: Note = {
      id:
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      text,
      createdAt: Date.now(),
    };
    setNotes((prev) => [note, ...prev]);
    setDraft("");
    inputRef.current?.focus();
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    if (editingId === id) setEditingId(null);
  };

  const startEdit = (note: Note) => {
    setEditingId(note.id);
    setEditingText(note.text);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingText("");
  };

  const saveEdit = () => {
    const text = editingText.trim();
    if (!text || !editingId) {
      cancelEdit();
      return;
    }
    setNotes((prev) =>
      prev.map((n) => (n.id === editingId ? { ...n, text } : n)),
    );
    cancelEdit();
  };

  return (
    <main
      className="relative min-h-screen w-full overflow-hidden px-4 py-10 sm:py-16"
      style={{
        backgroundColor: "oklch(0.16 0.03 265)",
        backgroundImage: [
          "radial-gradient(ellipse 80% 60% at 15% 0%, oklch(0.35 0.18 285 / 0.55), transparent 60%)",
          "radial-gradient(ellipse 70% 60% at 100% 20%, oklch(0.40 0.20 200 / 0.45), transparent 60%)",
          "radial-gradient(ellipse 90% 70% at 50% 110%, oklch(0.38 0.22 320 / 0.45), transparent 60%)",
          "linear-gradient(135deg, oklch(0.14 0.04 265) 0%, oklch(0.16 0.05 280) 50%, oklch(0.14 0.04 240) 100%)",
        ].join(", "),
      }}
    >
      {/* Subtle grid overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          maskImage:
            "radial-gradient(ellipse at center, black 40%, transparent 80%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-2xl">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] backdrop-blur-xl sm:p-10">
          {/* Header */}
          <header className="mb-8 text-center">
          
            <h1 className="bg-gradient-to-r from-cyan-300 via-violet-400 to-fuchsia-400 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl">
              My Notes
            </h1>
            <p className="mt-2 text-sm text-slate-400 sm:text-base">
              Capture ideas, fast.
            </p>
          </header>

          {/* Input */}
          <div className="mb-8 flex flex-col gap-2 sm:flex-row">
            <input
              ref={inputRef}
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addNote();
                }
              }}
              placeholder="Write a note and press Enter…"
              className="flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-slate-100 placeholder:text-slate-500 shadow-inner outline-none transition focus:border-cyan-400/60 focus:bg-white/[0.06] focus:ring-4 focus:ring-cyan-400/15"
              aria-label="Note text"
            />
            <button
              onClick={addNote}
              disabled={!draft.trim()}
              className="rounded-xl bg-gradient-to-r from-cyan-500 via-violet-500 to-fuchsia-500 px-5 py-3 font-medium text-white shadow-[0_10px_30px_-10px_rgba(139,92,246,0.7)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_36px_-10px_rgba(139,92,246,0.9)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
            >
              Add Note
            </button>
          </div>

          {/* Notes list */}
          {notes.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-14 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-2xl">
                📝
              </div>
              <p className="text-sm font-medium text-slate-200">
                No notes yet
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Your notes will appear here. Add your first one above.
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {notes.map((note) => {
                const isEditing = editingId === note.id;
                return (
                  <li
                    key={note.id}
                    className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-4 shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:border-cyan-400/30 hover:bg-white/[0.06] hover:shadow-[0_18px_40px_-18px_rgba(34,211,238,0.35)] sm:p-5"
                  >
                    <span
                      aria-hidden
                      className="absolute inset-y-0 left-0 w-[2px] bg-gradient-to-b from-cyan-400 via-violet-400 to-fuchsia-400 opacity-60"
                    />
                    {isEditing ? (
                      <div>
                        <textarea
                          ref={editRef}
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              saveEdit();
                            } else if (e.key === "Escape") {
                              e.preventDefault();
                              cancelEdit();
                            }
                          }}
                          rows={3}
                          className="w-full resize-none rounded-lg border border-white/10 bg-slate-950/40 px-3 py-2 text-slate-100 outline-none transition focus:border-cyan-400/60 focus:ring-4 focus:ring-cyan-400/15"
                          aria-label="Edit note"
                        />
                        <div className="mt-3 flex items-center justify-end gap-2">
                          <button
                            onClick={cancelEdit}
                            className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={saveEdit}
                            className="rounded-lg bg-gradient-to-r from-cyan-500 to-violet-500 px-3 py-1.5 text-sm font-medium text-white transition hover:from-cyan-400 hover:to-violet-400"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="whitespace-pre-wrap break-words text-[15px] leading-relaxed text-slate-100">
                            {note.text}
                          </p>
                          <p className="mt-2 text-xs text-slate-500">
                            {formatTime(note.createdAt)}
                          </p>
                        </div>
                        <div className="flex shrink-0 items-center gap-1 opacity-70 transition group-hover:opacity-100">
                          <button
                            onClick={() => startEdit(note)}
                            aria-label="Edit note"
                            title="Edit"
                            className="rounded-lg p-2 text-slate-400 transition hover:bg-cyan-400/10 hover:text-cyan-300"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M12 20h9" />
                              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => deleteNote(note.id)}
                            aria-label="Delete note"
                            title="Delete"
                            className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-500/15 hover:text-rose-300"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M3 6h18" />
                              <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                              <path d="M10 11v6" />
                              <path d="M14 11v6" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}

          {notes.length > 0 && (
            <p className="mt-6 text-center text-xs text-slate-500">
              {notes.length} {notes.length === 1 ? "note" : "notes"} saved
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
