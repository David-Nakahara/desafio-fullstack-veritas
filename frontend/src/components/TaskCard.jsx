import { COLUMNS } from "../constants";
import "../css/TaskCard.css";

export default function TaskCard({ task, onEdit, onDelete, onMove }) {
  const currentIndex = COLUMNS.findIndex((c) => c.status === task.status);
  const prevColumn = COLUMNS[currentIndex - 1];
  const nextColumn = COLUMNS[currentIndex + 1];

  return (
    <div className="task-card">
      <div className="task-card__header">
        <h3>{task.title}</h3>
        <div className="task-card__actions">
          <button
            className="icon-button"
            onClick={() => onEdit(task)}
            aria-label="Editar tarefa"
            title="Editar"
          >
            ✎
          </button>
          <button
            className="icon-button icon-button--danger"
            onClick={() => onDelete(task)}
            aria-label="Excluir tarefa"
            title="Excluir"
          >
            ✕
          </button>
        </div>
      </div>

      {task.description && <p className="task-card__description">{task.description}</p>}

      <div className="task-card__move">
        {prevColumn && (
          <button className="move-button" onClick={() => onMove(task, prevColumn.status)}>
            ← {prevColumn.title}
          </button>
        )}
        {nextColumn && (
          <button className="move-button" onClick={() => onMove(task, nextColumn.status)}>
            {nextColumn.title} →
          </button>
        )}
      </div>
    </div>
  );
}