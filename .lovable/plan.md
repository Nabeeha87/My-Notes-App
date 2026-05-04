## Modern Notes App

A clean, production-feel notes app built with React functional components, `useState` for note state, and `useRef` for the input field. Includes add, delete, and inline edit.

### Page structure (`src/routes/index.tsx`)

Single-page app, centered on screen, with a soft gradient background.

```text
┌───────────────────────────────────────────┐
│             gradient background           │
│                                           │
│     ┌───────────────────────────────┐     │
│     │  My Notes                     │     │
│     │  Capture ideas, fast.         │     │
│     │                               │     │
│     │  [ input field ........] [+]  │     │
│     │                               │     │
│     │  ┌─────────────────────────┐  │     │
│     │  │ Note text          ✎  ✕ │  │     │
│     │  │ small timestamp         │  │     │
│     │  └─────────────────────────┘  │     │
│     │  ┌─────────────────────────┐  │     │
│     │  │ Note text          ✎  ✕ │  │     │
│     │  └─────────────────────────┘  │     │
│     │                               │     │
│     │  Empty state when no notes    │     │
│     └───────────────────────────────┘     │
└───────────────────────────────────────────┘
```

### Features

1. **Add note** — type in the input, press Enter or click Add. Field auto-focuses on load via `useRef`, and refocuses after adding.
2. **Delete note** — small ✕ icon on each card with a hover state and a quick fade-out.
3. **Edit note (inline)** — clicking the ✎ icon swaps the card text into a textarea with Save / Cancel; Enter saves, Esc cancels.
4. **Empty state** — friendly message + icon when the list is empty.
5. **Persistence** — notes saved to `localStorage` so a refresh doesn't wipe them (small quality touch, still beginner-friendly).

### Design

- Soft diagonal gradient background (indigo → violet → pink, very low saturation) so it feels modern without being loud.
- Centered glass-style container: white card, generous padding, soft shadow, rounded-2xl.
- Note cards: white surface, subtle border, hover lifts slightly with shadow transition.
- Buttons: primary (Add) filled with smooth hover darken; icon buttons (edit/delete) ghost style, color shifts on hover (delete → red, edit → indigo).
- Typography: system sans, clear hierarchy — large bold title, muted subtitle, readable note body, tiny timestamp.
- Smooth transitions on hover, focus rings for accessibility.

### Technical notes

- Single route file: `src/routes/index.tsx` rendering a `NotesApp` component.
- React hooks only: `useState` for `notes` array and `editingId` / `draft` state, `useRef` for the add-input element, `useEffect` to sync with `localStorage`.
- Note shape: `{ id: string, text: string, createdAt: number }`.
- Styling via Tailwind utility classes already configured in `src/styles.css` — no extra libraries, no shadcn components needed for this scope (keeps it beginner-friendly as requested).
- Replaces the existing placeholder `Index` component.

### Out of scope

- Auth, backend, categories/tags, search, markdown — kept intentionally minimal per the brief.