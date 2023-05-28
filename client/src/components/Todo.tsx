import { useState } from 'react';
import { Task, TaskStatus } from '../types';
import Submitform from './SubmitForm';

const TodoPage = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTaskTitle, setNewTaskTitle] = useState('');

    const handleAddTask = (e: any) => {
        if (newTaskTitle.trim() !== '') {
            const newTask: Task = {
                id: Date.now(),
                title: newTaskTitle,
                status: TaskStatus.pending
            };

            setTasks([...tasks, newTask]);
            setNewTaskTitle('');
        }
        e.preventDefault();
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
            <ul className="task-list">
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
