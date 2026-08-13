import { COLUMNS } from "../constants";
import Column from "./Column";
import "../css/Board.css";

export default function Board({ tasks, onEdit, onDelete, onMove }) {
  return (
    <div className="board">
      {COLUMNS.map((column) => (
        <Column
          key={column.status}
          title={column.title}
          tasks={tasks.filter((task) => task.status === column.status)}
          onEdit={onEdit}
          onDelete={onDelete}
          onMove={onMove}
        />
      ))}
    </div>
  );
}