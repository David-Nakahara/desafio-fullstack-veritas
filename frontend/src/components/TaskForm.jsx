import { useState } from "react";
import { COLUMNS } from "../constants";
import "../css/TaskForm.css";

export default function TaskForm({ taskToEdit, onSave, onCancel, saving }) {
  const [title, setTitle] = useState(taskToEdit?.title ?? "");
  const [description, setDescription] = useState(taskToEdit?.description ?? "");
  const [status, setStatus] = useState(taskToEdit?.status ?? "todo");
  const [validationError, setValidationError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    if (!title.trim()) {
      setValidationError("O título é obrigatório.");
      return;
    }

    onSave({ title: title.trim(), description: description.trim(), status });
  }

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <form
        className="modal"
        onClick={(event) => event.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <h2>{taskToEdit ? "Editar tarefa" : "Nova tarefa"}</h2>

        <label className="field">
          <span>Título *</span>
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            autoFocus
          />
        </label>

        <label className="field">
          <span>Descrição</span>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={3}
          />
        </label>

        <label className="field">
          <span>Status</span>
          <select value={status} onChange={(event) => setStatus(event.target.value)}>
            {COLUMNS.map((column) => (
              <option key={column.status} value={column.status}>
                {column.title}
              </option>
            ))}
          </select>
        </label>

        {validationError && <p className="form-error">{validationError}</p>}

        <div className="modal__actions">
          <button type="button" className="button button--ghost" onClick={onCancel}>
            Cancelar
          </button>
          <button type="submit" className="button button--primary" disabled={saving}>
            {saving ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </form>
    </div>
  );
}