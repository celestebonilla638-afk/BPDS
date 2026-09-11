"use client";

import { useState, useRef, ChangeEvent, KeyboardEvent, CSSProperties } from "react";

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
  const [deletedTasks, setDeletedTasks] = useState<Task[]>([]);
  const [newTaskText, setNewTaskText] = useState<string>("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState<string>("");
  const nextId = useRef<number>(3);

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

  const startEditing = (task: Task) => {
    setEditingId(task.id);
    setEditingText(task.text);
  };

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
      (e.target as HTMLInputElement).blur();
    }
    if (e.key === "Escape") {
      setEditingId(null);
      setEditingText("");
    }
  };

  const toggleCompleted = (id: number) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
  };

  const deleteTask = (id: number) => {
    const taskToDelete = tasks.find((t) => t.id === id);
    if (!taskToDelete) return;

    setDeletedTasks((prev) => [taskToDelete, ...prev]);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const restoreTask = (id: number) => {
    const taskToRestore = deletedTasks.find((t) => t.id === id);
    if (!taskToRestore) return;

    setTasks((prev) => [...prev, taskToRestore]);
    setDeletedTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const clearTrash = () => {
    setDeletedTasks([]);
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
                background: task.completed ? "#8b5cf6" : "#cbd5e1",
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
                  color: task.completed ? "#94a3b8" : "#0f172a",
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

        {deletedTasks.length > 0 && (
          <div style={styles.trashContainer}>
            <div style={styles.trashHeader}>
              <h2 style={styles.trashTitle}>🗑️ Papelera ({deletedTasks.length})</h2>
              <button onClick={clearTrash} style={styles.clearTrashButton}>
                Vaciar papelera
              </button>
            </div>
            {deletedTasks.map((task) => (
              <div key={task.id} style={styles.trashRow}>
                <span style={styles.trashText}>{task.text}</span>
                <button
                  onClick={() => restoreTask(task.id)}
                  style={styles.restoreButton}
                >
                  Restaurar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles: { [key: string]: CSSProperties } = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #311042 100%)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "48px 20px",
    fontFamily:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  card: {
    background: "#ffffff",
    borderRadius: 24,
    padding: "40px 36px 28px",
    width: "100%",
    maxWidth: 520,
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.35)",
  },
  eyebrow: {
    display: "inline-block",
    background: "linear-gradient(90deg, #6366f1, #8b5cf6)",
    color: "#ffffff",
    fontWeight: 700,
    fontSize: 12,
    letterSpacing: 0.5,
    padding: "6px 12px",
    borderRadius: 20,
    marginBottom: 16,
    textTransform: "uppercase",
  },
  title: {
    fontSize: 36,
    fontWeight: 800,
    color: "#0f172a",
    margin: "0 0 8px",
    letterSpacing: "-0.02em",
  },
  subtitle: {
    color: "#475569",
    fontSize: 15,
    margin: "0 0 24px",
    lineHeight: 1.5,
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "16px 18px",
    borderRadius: 14,
    border: "2px solid #e2e8f0",
    fontSize: 15,
    color: "#0f172a",
    outline: "none",
    marginBottom: 20,
    background: "#f8fafc",
  },
  statsBar: {
    display: "flex",
    justifyContent: "space-between",
    background: "#f1f5f9",
    borderRadius: 12,
    padding: "12px 18px",
    marginBottom: 16,
    border: "1px solid #e2e8f0",
  },
  statsText: {
    fontWeight: 700,
    color: "#334155",
    fontSize: 13,
  },
  emptyState: {
    color: "#64748b",
    fontSize: 14,
    textAlign: "center",
    padding: "24px 0",
    fontWeight: 500,
  },
  taskRow: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: 14,
    padding: "14px 16px",
    marginBottom: 10,
  },
  checkbox: {
    width: 22,
    height: 22,
    minWidth: 22,
    borderRadius: "50%",
    border: "none",
    cursor: "pointer",
    padding: 0,
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  taskText: {
    flex: 1,
    fontSize: 15,
    fontWeight: 500,
    cursor: "pointer",
  },
  editInput: {
    flex: 1,
    fontSize: 15,
    padding: "8px 12px",
    borderRadius: 8,
    border: "2px solid #6366f1",
    outline: "none",
    color: "#0f172a",
  },
  deleteButton: {
    background: "#ffe4e6",
    color: "#e11d48",
    border: "none",
    borderRadius: 10,
    padding: "8px 14px",
    fontWeight: 700,
    fontSize: 12,
    cursor: "pointer",
  },
  trashContainer: {
    marginTop: 32,
    borderTop: "2px dashed #e2e8f0",
    paddingTop: 20,
  },
  trashHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  trashTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: "#334155",
    margin: 0,
  },
  clearTrashButton: {
    background: "transparent",
    color: "#64748b",
    border: "none",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
  },
  trashRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "#f1f5f9",
    border: "1px solid #e2e8f0",
    borderRadius: 12,
    padding: "10px 14px",
    marginBottom: 8,
  },
  trashText: {
    color: "#64748b",
    fontSize: 14,
    textDecoration: "line-through",
  },
  restoreButton: {
    background: "#e0e7ff",
    color: "#4f46e5",
    border: "none",
    borderRadius: 8,
    padding: "6px 12px",
    fontWeight: 700,
    fontSize: 11,
    cursor: "pointer",
  },
};