 require('dotenv').config(); 
 const cors = require("cors");
 const express = require('express');
 const logRequest = require('./middlware/logger.js');
 const validateTodo = require('./middlware/validator.js')
 const errorhandler = require('./middlware/errorHandler.js');
 const app = express();



 app.use(express.json());
 app.use(logRequest);

 let todos = [
   { id: 1, task: 'learn node.js', completed: false },
   { id: 2, task: 'learn express.js', completed: false }
 ];

 app.get('/todos', (req, res, next) => {
    try {
        res.status(200).json(todos);
    } catch (error) {
        next(error);
    }
 });


app.get('/todos/active', (req, res, next) => {
    try {
        const activeTodos = todos.filter(t => !t.completed);
        res.json(activeTodos);
    } catch (error) {
        next(error);
    }
 });


app.get('/todos/:id', (req, res, next) => {
  try {
      const todoId = req.params.id;
      if (isNaN(todoId)) {
        throw new Error('Invalid ID format');
      }
      const todo = todos.find(t => t.id === parseInt(todoId));
      if (!todo) return res.status(404).json({ message: 'Todo not found' });
      res.json(todo);

  } catch (error) {
    next(error);
  }
});

app.post('/todos', validateTodo, (req, res, next) => {
    try {
        const { task } = req.body;
        if (!task || task.length <= 2) {
            return res.status(400).json({ message: 'please provide a valid task' });
        }
        const newtodo = { ...req.body, id: todos.length + 1, completed: false };
        todos.push(newtodo);
        res.status(201).json(newtodo);
    } catch (error) {
        next(error);
    }
});


 app.patch('/todos/:id', validateTodo, (req, res, next) => {
    try {
        const todo = todos.find(t => t.id === parseInt(req.params.id));
        if (!todo) return res.status(404).json({ message: 'Todo not found' });
          Object.assign(todo, req.body);
          res.status(200).json(todo);
    } catch (error) {
        next(error);
    }    
 });

 app.delete('/todos/:id', validateTodo, (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const initialLength = todos.length;
        todos = todos.filter(t => t.id !== id);
        if (todos.length === initialLength) return res.status(404).json({ message: 'Todo not found' });
        res.status(204).send();
    } catch (error) {
        next(error);
    }        
 });

app.get('/todos/completed', (req, res, next) => {
   try {
        const completedTodos = todos.filter(t => t.completed);
        res.json(completedTodos);
   } catch (error) {
    next(error);
   }
 });

app.use(errorhandler); 


 const PORT = process.env.PORT || 3000;
 app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`);
 });