"use client";

import { useState, useRef, ChangeEvent, KeyboardEvent, CSSProperties } from "react";

// ──────────────────────────────────────────────────────────
// Mi lista de tareas — CRUD completo
//
// CREATE: escribes en el input y presionas Enter (no hay botón de agregar)
// READ:   la lista se renderiza desde el estado "tasks"
// UPDATE: haces clic sobre el texto de una tarea para editarla;
//         se guarda sola al salir del campo (blur) o al presionar Enter
// DELETE: el círculo (chulito) SOLO tacha/destacha la tarea, nunca la borra
//         el botón "Eliminar" sí la borra por completo
// ──────────────────────────────────────────────────────────

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

export default function TodoList() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, text: "Aprender JSX", completed: false },
    { id: 2, text: "Crear una función en JavaScript", completed: true },
  ]);
  const [newTaskText, setNewTaskText] = useState<string>("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState<string>("");
  const nextId = useRef<number>(3);

  // CREATE — solo con Enter, sin botón
  const handleNewTaskKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    const text = newTaskText.trim();
    if (text === "") return;

    setTasks((prev) => [
      ...prev,
      { id: nextId.current, text, completed: false },
    ]);
    nextId.current += 1;
    setNewTaskText("");
  };

  // UPDATE — entrar en modo edición al hacer clic en el texto
  const startEditing = (task: Task) => {
    setEditingId(task.id);
    setEditingText(task.text);
  };

  // UPDATE — autoguardado al salir del campo (blur)
  const saveEdit = (id: number) => {
    const text = editingText.trim();
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, text: text === "" ? t.text : text } : t
      )
    );
    setEditingId(null);
    setEditingText("");
  };

  const handleEditKeyDown = (e: KeyboardEvent<HTMLInputElement>, id: number) => {
    if (e.key === "Enter") {
      (e.target as HTMLInputElement).blur(); // dispara saveEdit vía onBlur
    }
    if (e.key === "Escape") {
      setEditingId(null);
      setEditingText("");
    }
  };

  // El chulito SOLO tacha (toggle completed), nunca borra
  const toggleCompleted = (id: number) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
  };

  // DELETE — este botón sí elimina por completo
  const deleteTask = (id: number) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <span style={styles.eyebrow}>Proyecto para principiantes</span>
        <h1 style={styles.title}>Mi lista de tareas</h1>
        <p style={styles.subtitle}>
          Escribe lo que debes hacer hoy y presiona Enter.
        </p>

        <input
          type="text"
          placeholder="Ejemplo: Estudiar JavaScript"
          value={newTaskText}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setNewTaskText(e.target.value)}
          onKeyDown={handleNewTaskKeyDown}
          style={styles.input}
        />

        <div style={styles.statsBar}>
          <span style={styles.statsText}>
            {tasks.length} {tasks.length === 1 ? "tarea" : "tareas"}
          </span>
          <span style={styles.statsText}>{completedCount} completadas</span>
        </div>

        {tasks.length === 0 && (
          <p style={styles.emptyState}>No tienes tareas todavía.</p>
        )}

        {tasks.map((task) => (
          <div key={task.id} style={styles.taskRow}>
            <button
              onClick={() => toggleCompleted(task.id)}
              aria-label={
                task.completed ? "Marcar como pendiente" : "Marcar como completada"
              }
              style={{
                ...styles.checkbox,
                background: task.completed ? "#5b4feb" : "#e2e2ea",
              }}
            />

            {editingId === task.id ? (
              <input
                autoFocus
                type="text"
                value={editingText}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setEditingText(e.target.value)}
                onBlur={() => saveEdit(task.id)}
                onKeyDown={(e) => handleEditKeyDown(e, task.id)}
                style={styles.editInput}
              />
            ) : (
              <span
                onClick={() => startEditing(task)}
                title="Haz clic para editar"
                style={{
                  ...styles.taskText,
                  textDecoration: task.completed ? "line-through" : "none",
                  color: task.completed ? "#9a9aa8" : "#1a1a2e",
                }}
              >
                {task.text}
              </span>
            )}

            <button
              onClick={() => deleteTask(task.id)}
              style={styles.deleteButton}
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles: { [key: string]: CSSProperties } = {
  page: {
    minHeight: "100vh",
    background: "#f2f2f6",
    display: "flex",
    justifyContent: "center",
    padding: "48px 20px",
    fontFamily:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  card: {
    background: "#ffffff",
    borderRadius: 24,
    padding: "40px 40px 24px",
    width: "100%",
    maxWidth: 560,
    boxShadow: "0 20px 40px rgba(20,20,50,0.06)",
  },
  eyebrow: {
    display: "inline-block",
    background: "#e9e7fd",
    color: "#5b4feb",
    fontWeight: 700,
    fontSize: 12,
    letterSpacing: 0.4,
    padding: "4px 10px",
    borderRadius: 6,
    marginBottom: 16,
  },
  title: {
    fontSize: 40,
    fontWeight: 800,
    color: "#14142b",
    margin: "0 0 8px",
  },
  subtitle: {
    color: "#6b6b7a",
    fontSize: 16,
    margin: "0 0 24px",
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "14px 16px",
    borderRadius: 12,
    border: "1px solid #e2e2ea",
    fontSize: 15,
    outline: "none",
    marginBottom: 20,
  },
  statsBar: {
    display: "flex",
    justifyContent: "space-between",
    background: "#f6f6fa",
    borderRadius: 12,
    padding: "14px 18px",
    marginBottom: 12,
  },
  statsText: {
    fontWeight: 600,
    color: "#14142b",
    fontSize: 14,
  },
  emptyState: {
    color: "#9a9aa8",
    fontSize: 14,
    padding: "12px 4px",
  },
  taskRow: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    background: "#f9f9fc",
    borderRadius: 12,
    padding: "14px 16px",
    marginBottom: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    minWidth: 20,
    borderRadius: "50%",
    border: "none",
    cursor: "pointer",
    padding: 0,
  },
  taskText: {
    flex: 1,
    fontSize: 15,
    color: "#1a1a2e",
    cursor: "text",
  },
  editInput: {
    flex: 1,
    fontSize: 15,
    padding: "6px 10px",
    borderRadius: 8,
    border: "1px solid #5b4feb",
    outline: "none",
  },
  deleteButton: {
    background: "#fde3e3",
    color: "#c0392b",
    border: "none",
    borderRadius: 8,
    padding: "8px 14px",
    fontWeight: 700,
    fontSize: 13,
    cursor: "pointer",
  },
};
