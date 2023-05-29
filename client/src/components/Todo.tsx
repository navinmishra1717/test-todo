import { useEffect, useState } from 'react';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import { Subtask, SubtaskFillable, Task, TaskFillable, TaskStatus } from '../types';
import Submitform from './SubmitForm';
// import defaultTodoList from './defaultTodoList';
import SubtaskSubmitform from './SubtaskSubmitform';

const BASE_URL = process.env.REACT_APP_API_URL;

const TodoPage = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newSubTaskTitleMap, setNewSubTaskTitleMap] = useState<any>({});

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

    const handleAddSubtaskTitle = (value: string, taskId: number) => {
        setNewSubTaskTitleMap({
            ...newSubTaskTitleMap,
            [taskId]: value
        });
    };

    const handleAddSubtask = async (e: any, taskId: number) => {
        e.preventDefault();
        const newSubTaskTitle = newSubTaskTitleMap[taskId];
        if (newSubTaskTitle && newSubTaskTitle?.trim() !== '') {
            const newSubtask: SubtaskFillable = {
                title: newSubTaskTitle,
                todoId: taskId
            };

            try {
                const response = await fetch(`${BASE_URL}/subtask`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newSubtask)
                });
                if (response.ok) {
                    const data = await response.json();
                    const taskWithNewSubtask = tasks.map((task) => {
                        if (task.id === taskId) {
                            return {
                                ...task,
                                status: TaskStatus.pending,
                                subtasks: [...((task?.subtasks as Subtask[]) || []), data.data] as Subtask[]
                            };
                        }
                        return task;
                    });
                    setTasks(taskWithNewSubtask);
                    const filteredObject = Object.keys(newSubTaskTitleMap).reduce((acc: any, key: string) => {
                        if (key !== String(taskId)) {
                            acc[key] = newSubTaskTitleMap[key];
                        }
                        return acc;
                    }, {});

                    setNewSubTaskTitleMap(filteredObject);
                } else {
                    console.error('Failed to add task:', response.statusText);
                }
            } catch (error) {
                console.error('Error updating task:', error);
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
                    subtasks: task?.subtasks?.map((sub) => {
                        return {
                            ...sub,
                            status: nextStatus === TaskStatus.completed ? TaskStatus.completed : TaskStatus.pending
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

                const isPendingTask = updatedSubtasks?.find((sub) => sub.status === TaskStatus.pending);

                return {
                    ...task,
                    status: isPendingTask ? TaskStatus.pending : TaskStatus.completed,
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

    const getCompletedSubtasks = (subtasks: Subtask[]): number => {
        return subtasks.filter((subtask) => subtask.status === TaskStatus.completed).length;
    };

    return (
        <div className="todo-app">
            <h1 className="todo-title">Todo App</h1>
            <Submitform setInput={setNewTaskTitle} value={newTaskTitle} onClick={handleAddTask} />
            <ul className="task-list">
                {tasks.map((task) => (
                    <li key={task.id} className="collapsible-list">
                        <div>
                            <label style={{ wordBreak: 'break-all', width: '100%' }}>
                                <input
                                    className="task-checkbox"
                                    type="checkbox"
                                    checked={task.status === TaskStatus.completed}
                                    onChange={() => handleToggleTask(task.id)}
                                />
                                {task.title}
                            </label>
                            <div
                                onClick={() => handleToggleTaskCollapse(task.id)}
                                style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', position: 'relative' }}
                            >
                                <div
                                    style={{
                                        position: 'absolute',
                                        bottom: '0',
                                        opacity: '0.6',
                                        fontSize: '14px',
                                        right: '40px'
                                    }}
                                >
                                    {task?.subtasks?.length
                                        ? `${getCompletedSubtasks(task.subtasks)} of ${task?.subtasks?.length} completed`
                                        : ''}
                                </div>
                                {task.open ? <BsChevronUp /> : <BsChevronDown />}
                            </div>
                        </div>
                        {task.open && (
                            <ul className="subtask-list">
                                {task?.subtasks?.map((subtask) => (
                                    <li key={subtask.id} className="collapsible-list">
                                        <label>
                                            <input
                                                className="task-checkbox"
                                                type="checkbox"
                                                checked={subtask.status === TaskStatus.completed}
                                                onChange={() => handleToggleSubtask(task.id, subtask.id)}
                                            />
                                            {subtask.title}
                                        </label>
                                    </li>
                                ))}
                                <li key="new-list" className="collapsible-list">
                                    <label>
                                        <SubtaskSubmitform
                                            handleInput={handleAddSubtaskTitle}
                                            value={newSubTaskTitleMap[task.id] || ''}
                                            taskId={task.id}
                                            onClick={handleAddSubtask}
                                        />
                                    </label>
                                </li>
                            </ul>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TodoPage;
