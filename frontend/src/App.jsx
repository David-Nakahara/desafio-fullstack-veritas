import { useEffect, useState } from "react";
import { createTask, deleteTask, fetchTasks, updateTask } from "./api/tasks";
import Board from "./components/Board";
import TaskForm from "./components/TaskForm";
import "./css/App.css";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    setLoading(true);
    setError("");
    try {
      const data = await fetchTasks();
      setTasks(data);
    } catch (err) {
      setError("Não foi possível carregar as tarefas. O backend está rodando?");
    } finally {
      setLoading(false);
    }
  }

  function openCreateForm() {
    setTaskToEdit(null);
    setIsFormOpen(true);
  }

  function openEditForm(task) {
    setTaskToEdit(task);
    setIsFormOpen(true);
  }

  function closeForm() {
    setIsFormOpen(false);
    setTaskToEdit(null);
  }

  async function handleSave(formData) {
    setSaving(true);
    setError("");
    try {
      if (taskToEdit) {
        const updated = await updateTask(taskToEdit.id, formData);
        setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      } else {
        const created = await createTask(formData);
        setTasks((prev) => [...prev, created]);
      }
      closeForm();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(task) {
    if (!confirm(`Excluir a tarefa "${task.title}"?`)) return;

    setError("");
    try {
      await deleteTask(task.id);
      setTasks((prev) => prev.filter((t) => t.id !== task.id));
    } catch (err) {
      setError(err.message);
    }
  }


  async function handleMove(task, newStatus) {
    const previousTasks = tasks;
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, status: newStatus } : t))
    );

    try {
      await updateTask(task.id, { ...task, status: newStatus });
    } catch (err) {
      setError(err.message);
      setTasks(previousTasks);
    }
  }

  return (
    <div className="app">
      <header className="app__header">
        <div>
          <h1>Mini Kanban</h1>
          <p className="app__subtitle">Organize suas tarefas em três colunas</p>
        </div>
        <button className="button button--primary" onClick={openCreateForm}>
          + Nova tarefa
        </button>
      </header>

      {error && (
        <div className="banner banner--error">
          {error}
          <button onClick={() => setError("")} aria-label="Fechar aviso">
            ✕
          </button>
        </div>
      )}

      {loading ? (
        <div className="loading-state">Carregando tarefas...</div>
      ) : (
        <Board tasks={tasks} onEdit={openEditForm} onDelete={handleDelete} onMove={handleMove} />
      )}

      {isFormOpen && (
        <TaskForm
          taskToEdit={taskToEdit}
          onSave={handleSave}
          onCancel={closeForm}
          saving={saving}
        />
      )}
    </div>
  );
}