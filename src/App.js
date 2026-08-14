import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addTask, deleteTask, toggleCompletion, setFilter } from './redux/tasksSlice';
import { v4 as uuidv4 } from 'uuid';
import React, { useEffect, useState } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { View, FlatList, TextInput, Button, StyleSheet, SafeAreaView } from 'react-native';
import { store } from './src/redux/store';
import { fetchUsers, incrementPage } from './src/redux/usersSlice';
import UserCard from './src/components/UserCard';

function App() {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('Medium');
  const { tasks, filter } = useSelector(state => state.tasks);
  const dispatch = useDispatch();

  const handleAdd = () => {
    if (!title) return;
    dispatch(addTask({ id: uuidv4(), title, priority, completed: false }));
    setTitle('');
  };

  const filteredTasks = tasks.filter(task =>
    filter === 'All' ? true : task.priority === filter
  );

  return (
    <div style={{ padding: '20px' }}>
      <h1>Task Manager</h1>

      <div>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="New Task" />
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <button onClick={handleAdd}>Add Task</button>
      </div>

      <div style={{ marginTop: '20px' }}>
        <button onClick={() => dispatch(setFilter('All'))}>All</button>
        <button onClick={() => dispatch(setFilter('High'))}>High</button>
        <button onClick={() => dispatch(setFilter('Medium'))}>Medium</button>
        <button onClick={() => dispatch(setFilter('Low'))}>Low</button>
      </div>

      <ul>
        {filteredTasks.map(task => (
          <li key={task.id} style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
            {task.title} - {task.priority}
            <button onClick={() => dispatch(toggleCompletion(task.id))}>Toggle</button>
            <button onClick={() => dispatch(deleteTask(task.id))}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
