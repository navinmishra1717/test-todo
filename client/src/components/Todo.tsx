import { useEffect, useState } from 'react';
import { Task, TaskFillable, TaskStatus } from '../types';
import Submitform from './SubmitForm';

const TodoPage = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTaskTitle, setNewTaskTitle] = useState('');

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await fetch('http://localhost:3001/todos');
            const data = await response.json();
            setTasks(data.data.items);
        } catch (error: any) {
            console.error('Error fetching tasks:', error);
        }
    };

    const handleAddTask = async (e: any) => {
        e.preventDefault();
        if (newTaskTitle.trim() !== '') {
            const newTask: TaskFillable = {
                title: newTaskTitle
            };

            try {
                const response = await fetch('http://localhost:3001/todo', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newTask)
                });

                if (response.ok) {
                    const data = await response.json();
                    setTasks([data.data, ...tasks]);
                    setNewTaskTitle('');
                } else {
                    console.error('Failed to add task:', response.statusText);
                }
            } catch (error) {
                console.error('Error adding task:', error);
            }
        }
    };

    const handleToggleTask = (taskId: number) => {
        const updatedTasks = tasks.map((task) => {
            if (task.id === taskId) {
                return {
                    ...task,
                    status: task.status === TaskStatus.completed ? TaskStatus.pending : TaskStatus.completed
                };
            }
            return task;
        });

        setTasks(updatedTasks);
    };

    const handleToggleSubtask = (taskId: number, subtaskId: number) => {
        const updatedTasks = tasks.map((task) => {
            if (task.id === taskId) {
                const updatedSubtasks = task.subtasks?.map((subtask) => {
                    if (subtask.id === subtaskId) {
                        return {
                            ...subtask,
                            status: task.status === TaskStatus.completed ? TaskStatus.pending : TaskStatus.completed
                        };
                    }
                    return subtask;
                });

                return {
                    ...task,
                    subtasks: updatedSubtasks
                };
            }
            return task;
        });

        setTasks(updatedTasks);
    };

    return (
        <div className="todo-app">
            <h1 className="todo-title">Todo App</h1>
            <Submitform setInput={setNewTaskTitle} value={newTaskTitle} onClick={handleAddTask} />
            <ul>
                {tasks.map((task) => (
                    <li key={task.id}>
                        <label>
                            <input
                                type="checkbox"
                                checked={task.status === TaskStatus.completed}
                                onChange={() => handleToggleTask(task.id)}
                            />
                            {task.title}
                        </label>

                        <ul>
                            {task?.subtasks?.map((subtask) => (
                                <li key={subtask.id} className="subtask-list">
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={subtask.status === TaskStatus.completed}
                                            onChange={() => handleToggleSubtask(task.id, subtask.id)}
                                        />
                                        {subtask.title}
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TodoPage;
