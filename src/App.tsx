/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
/* eslint-disable max-len */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
// import {
//   // getTodos,
//   // postTodo,
//   deleteTodo,
//   updateTodo,
// } from './api/todos';
import { Todo } from './types/Todo';
import { FilterType } from './types/Filter';
import { ErrorType } from './types/Error';
import { ErrorNotification } from './components/ErrorNotification';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { ToDoList } from './components/ToDoList';
import { Upload } from './Upload';
// import { Contacts } from './Contacts';
// .new comment to commit

const USER_ID = 6701;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [statusFilter, setStatusFilter] = useState<FilterType>(FilterType.All);
  const [error, setError] = useState<ErrorType>(ErrorType.None);
  const [input, setInput] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const scriptUrlEB = 'http://sample-book-env.eba-pp3eapci.eu-north-1.elasticbeanstalk.com/todos';

  useEffect(() => {
    // Get to EB
    fetch(scriptUrlEB, { method: 'GET' })
      .then((res) => {
        console.log('1get', (res));

        // return JSON.stringify(res);
        return res.text();
      })
      .then((response) => {
        console.log('2get', (response));

        setTodos(JSON.parse(response));
      })
      .catch((err) => {
        console.log(err);

        setTodos([]);
      });
  }, []);

  const addTodo = (title:string) => {
    if (!title) {
      setError(ErrorType.EmptyTitle);

      return;
    }

    const newTodo = {
      title,
      completed: false,
      userId: 1,
    };

    setTempTodo({
      ...newTodo,
      _id: '',
    });

    // Post to EB
    fetch(scriptUrlEB, {
      method: 'POST',
      // mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTodo),
    })
      .then((res) => {
        console.log('1post', res);

        // return JSON.stringify(res);

        return res.json();
      })
      .then((response) => {
        console.log('2post', (response));

        setTodos(oldTodos => ([
          ...oldTodos,
          {
            ...newTodo,
            _id: response.todoId,
          },
        ]));
      })
      .catch((err) => {
        console.log(err);
        setError(ErrorType.Post);
      })
      .finally(() => {
        setTempTodo(null);
      });
  };

  const filterTodos = (filter: FilterType) => {
    switch (filter) {
      case FilterType.Active:
        return (todos.filter(todo => !todo.completed));

      case FilterType.Completed:
        return (todos.filter(todo => todo.completed));

      default:
        return [...todos];
    }
  };

  const visibleTodos:Todo[] = useMemo(
    () => filterTodos(statusFilter), [statusFilter, todos],
  );

  const handleClickFilter = (filter: FilterType) => {
    setStatusFilter(filter);
  };

  const handleDeleteNotification = () => {
    setError(ErrorType.None);
  };

  const activeTodosCount = filterTodos(FilterType.Active).length;
  const completedTodosCount = filterTodos(FilterType.Completed).length;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    addTodo(input);
    setInput('');
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleDelete = (todoId: string) => {
    // setUpdatingId(todoId);
    // deleteTodo(todoId)
    //   .then(() => {
    //     setTodos(oldTodos => (
    //       oldTodos.filter(todo => todo.id !== todoId)
    //     ));
    //   })
    //   .catch(() => {
    //     setError(ErrorType.Delete);
    //   })
    //   .finally(() => {
    //     setUpdatingId(null);
    //   });

    setUpdatingId(todoId);

    fetch(`${scriptUrlEB}/${todoId}`, {
      method: 'DELETE',
      // mode: 'no-cors',
      // headers: {
      //   'Content-Type': 'application/json',
      // },
    })
      .then((res) => {
        console.log('1del', res);

        return res.json();
      })
      .then((response) => {
        console.log('2del', (response));
        setTodos(oldTodos => (
          oldTodos.filter(todo => todo._id !== todoId)
        ));
      })
      .catch((err) => {
        console.log(err);
        setError(ErrorType.Delete);
      })
      .finally(() => {
        setUpdatingId(null);
      });
  };

  const handleClearCompleted = () => {
    todos.forEach(todo => {
      if (todo.completed) {
        handleDelete(todo._id);
      }
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const changeTodo = (todo: Todo) => {
    const todoWithoutId = {
      title: todo.title,
      userId: todo.userId,
      completed: todo.completed,
    };

    fetch(`${scriptUrlEB}/${todo._id}`, {
      method: 'PUT',
      // mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(todoWithoutId),
    })
      .then((res) => {
        console.log('1put', res);

        // return JSON.stringify(res);

        return res.json();
      })
      .then((response) => {
        console.log('2put', (response));
        setTodos(oldTodos => (
          oldTodos.map(oldTodo => (
            oldTodo._id === todo._id ? todo : oldTodo
          ))
        ));
      })
      .catch((err) => {
        console.log(err);
        setError(ErrorType.Update);
      })
      .finally(() => {
        setUpdatingId(null);
      });
  };

  const handleToggle = (todo: Todo) => {
    setUpdatingId(todo._id);
    const newTodo = {
      ...todo,
      completed: !todo.completed,
    };

    changeTodo(newTodo);
  };

  const handleToggleAll = () => {
    todos.forEach(todo => {
      changeTodo({
        ...todo,
        completed: Boolean(activeTodosCount),
      });
    });
  };

  const handleChangingTitle = (todo: Todo, title: string) => {
    if (!title) {
      handleDelete(todo._id);

      return;
    }

    const newTodo = {
      ...todo,
      title,
    };

    changeTodo(newTodo);
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          input={input}
          handleSubmit={handleSubmit}
          handleChange={handleChange}
          numActiveTodos={activeTodosCount}
          handleToggleAll={handleToggleAll}
        />

        <ToDoList
          visibleTodos={visibleTodos}
          handleDelete={handleDelete}
          tempTodo={tempTodo}
          handleToggle={handleToggle}
          updating={updatingId || ''}
          handleChangingTitle={handleChangingTitle}
        />

        <Footer
          numActiveTodos={activeTodosCount}
          numCompletedTodos={completedTodosCount}
          statusFilter={statusFilter}
          todos={todos}
          onClickFilter={handleClickFilter}
          onClearCompleted={handleClearCompleted}
        />
      </div>

      <ErrorNotification
        error={error}
        handleDeleteNotification={handleDeleteNotification}
      />

      <Upload />
      {/* <Contacts /> */}
    </div>
  );
};
