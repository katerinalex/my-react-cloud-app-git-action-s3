/* eslint-disable no-underscore-dangle */
import { useState } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  handleDelete: (todoId: string) => void,
  handleToggle: (todo: Todo) => void,
  updating: string,
  handleChangingTitle: (todo: Todo, title: string) => void,
  isRenaming: string,
  setIsRenaming: (id: string) => void,
};

export const ToDo: React.FC<Props> = ({
  todo,
  handleDelete,
  handleToggle,
  updating,
  handleChangingTitle,
  isRenaming,
  setIsRenaming,
}) => {
  const [startTitle, setStartTitle] = useState(todo.title);
  const [newTitle, setNewTitle] = useState(startTitle);

  const handleRenamingTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  };

  return (
    <div
      className={todo.completed ? 'todo completed' : 'todo'}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => handleToggle(todo)}
        />
      </label>

      {isRenaming === todo._id
        ? (
          <form onSubmit={(event) => {
            event.preventDefault();
            handleChangingTitle(todo, newTitle);
            setIsRenaming('');
          }}
          >
            <input
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={newTitle}
              onChange={handleRenamingTitle}
              onBlur={() => {
                handleChangingTitle(todo, newTitle);
              }}
            />
          </form>
        )
        : (
          <>
            <button
              type="button"
              className="todo__title"
              onClick={(event) => {
                if (event.detail === 2) {
                  setIsRenaming(todo._id);
                  setStartTitle(todo.title);
                }
              }}
            >
              {todo.title}
            </button>

            <button
              type="button"
              className="todo__remove"
              onClick={() => handleDelete(todo._id)}
            >
              ×
            </button>
          </>
        )}

      <div
        className={`modal overlay ${updating === todo._id && 'is-active'}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
