/* eslint-disable @typescript-eslint/no-var-requires */
// eslint-disable-next-line import/no-extraneous-dependencies
const express = require('express');

const app = express();
const port = 3000; // Define the port for the server

// Middleware to parse JSON data from requests
app.use(express.json());

// In-memory data storage
const todos = [
  {
    id: 1,
    userId: 4,
    completed: false,
    title: 'expedita tempore nobis eveniet laborum maiores',
    createdAt: '2020-07-06T14:30:32.542Z',
    updatedAt: '2020-07-06T14:30:32.542Z',
  },
  {
    id: 2,
    userId: 4,
    completed: false,
    title: 'expedita tempore nobis eveniet laborum maiores',
    createdAt: '2020-07-06T14:30:32.542Z',
    updatedAt: '2020-07-06T14:30:32.542Z',
  },
];

// GET - Retrieve all todos
app.get('/todos', (req, res) => {
  res.status(200).json(todos);
});

// POST - Create a new todo
app.post('/todos', (req, res) => {
  const newtodo = {
    id: todos.length + 1,
    name: req.body.name,
  };

  todos.push(newtodo);
  res.status(201).json(newtodo);
});

// PUT - Update an existing todo by ID
// eslint-disable-next-line consistent-return
app.put('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const todoIndex = todos.findIndex((todo) => todo.id === id);

  if (todoIndex === -1) {
    return res.status(404).json({ error: 'todo not found' });
  }

  todos[todoIndex].name = req.body.name || todos[todoIndex].name;
  res.status(200).json(todos[todoIndex]);
});

// DELETE - Delete an todo by ID
// eslint-disable-next-line consistent-return
app.delete('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const todoIndex = todos.findIndex((todo) => todo.id === id);

  if (todoIndex === -1) {
    return res.status(404).json({ error: 'todo not found' });
  }

  todos.splice(todoIndex, 1);
  res.status(204).send(); // No content response
});

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on http://localhost:${port}`);
});
