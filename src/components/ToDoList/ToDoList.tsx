/* eslint-disable no-underscore-dangle */
import { useState } from 'react';
import { Todo } from '../../types/Todo';
import { ToDo } from '../ToDo';

type Props = {
  visibleTodos: Todo[];
  handleDelete: (todoId: string) => void,
  tempTodo: Todo | null,
  handleToggle: (todo: Todo) => void,
  updating: string,
  handleChangingTitle: (todo: Todo, title: string) => void,
};

export const ToDoList: React.FC<Props> = ({
  visibleTodos,
  handleDelete,
  tempTodo,
  handleToggle,
  updating,
  handleChangingTitle,
}) => {
  const [isRenaming, setIsRenaming] = useState('');

  const handleSettingIsRenaming = (id: string) => {
    setIsRenaming(id);
  };

  return (
    <section className="todoapp__main">
      {visibleTodos.map(todo => (
        <ToDo
          key={todo._id}
          todo={todo}
          handleDelete={handleDelete}
          handleToggle={handleToggle}
          updating={updating}
          handleChangingTitle={handleChangingTitle}
          isRenaming={isRenaming}
          setIsRenaming={handleSettingIsRenaming}
        />
      ))}

      {tempTodo && (
        <div className={tempTodo.completed ? 'todo completed' : 'todo'}>
          <label className="todo__status-label">
            <input
              type="checkbox"
              className="todo__status"
              checked={tempTodo.completed}
            />
          </label>

          <span className="todo__title">{tempTodo.title}</span>
          <button type="button" className="todo__remove">×</button>

          <div className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
