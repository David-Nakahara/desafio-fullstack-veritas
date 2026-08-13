import TaskCard from "./TaskCard";
import "../css/Column.css";

export default function Column({ title, tasks, onEdit, onDelete, onMove }) {
  return (
    <div className="column">
      <div className="column__header">
        <h2>{title}</h2>
        <span className="column__count">{tasks.length}</span>
      </div>

      <div className="column__body">
        {tasks.length === 0 && <p className="column__empty">Nenhuma tarefa aqui</p>}

        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
            onMove={onMove}
          />
        ))}
      </div>
    </div>
  );
}