import { useEffect, useState } from 'react';
import { Task, TaskFillable, TaskStatus } from '../types';
import Submitform from './SubmitForm';

const BASE_URL = process.env.REACT_APP_API_URL;

const TodoPage = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTaskTitle, setNewTaskTitle] = useState('');

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await fetch(`${BASE_URL}/todos`);
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
                const response = await fetch(`${BASE_URL}/todo`, {
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

    const handleToggleTask = async (taskId: number) => {
        const updatedTasks = tasks.map((task) => {
            if (task.id === taskId) {
                const nextStatus = task.status === TaskStatus.completed ? TaskStatus.pending : TaskStatus.completed;
                return {
                    ...task,
                    status: nextStatus,
                    subtasks: task.subtasks?.map((sub) => {
                        return {
                            ...sub,
                            status: nextStatus
                        };
                    })
                };
            }
            return task;
        });

        setTasks(updatedTasks);

        try {
            await fetch(`${BASE_URL}/todo/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: updatedTasks.find((task) => task.id === taskId)?.status })
            });
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    const handleToggleSubtask = async (taskId: number, subtaskId: number) => {
        const updatedTasks = tasks.map((task) => {
            if (task.id === taskId) {
                const updatedSubtasks = task.subtasks?.map((subtask) => {
                    if (subtask.id === subtaskId) {
                        return {
                            ...subtask,
                            status: subtask.status === TaskStatus.completed ? TaskStatus.pending : TaskStatus.completed
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
        try {
            await fetch(`${BASE_URL}/subtask/${subtaskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    status: updatedTasks.find((task) => task.id === taskId)?.subtasks?.find((subtask) => subtask.id === subtaskId)?.status
                })
            });
        } catch (error) {
            console.error('Error updating subtask:', error);
        }
    };

    const handleToggleTaskCollapse = (taskId: number) => {
        setTasks((prevTasks) => prevTasks.map((task) => (task.id === taskId ? { ...task, open: !task.open } : task)));
    };

    return (
        <div className="todo-app">
            <h1 className="todo-title">Todo App</h1>
            <Submitform setInput={setNewTaskTitle} value={newTaskTitle} onClick={handleAddTask} />
            <ul className="task-list">
                {tasks.map((task) => (
                    <li key={task.id}>
                        <div onClick={() => handleToggleTaskCollapse(task.id)}>collapse</div>
                        <label className="task-label">
                            <input
                                type="checkbox"
                                checked={task.status === TaskStatus.completed}
                                onChange={() => handleToggleTask(task.id)}
                            />
                            {task.title}
                        </label>
                        {task.open && (
                            <ul className="subtask-list">
                                {task?.subtasks?.map((subtask) => (
                                    <li key={subtask.id}>
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
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TodoPage;
