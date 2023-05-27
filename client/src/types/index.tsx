export enum TaskStatus {
    pending = 'pending',
    completed = 'completed'
}

export interface Subtask {
    id: number;
    title: string;
    status: TaskStatus;
}

export interface Task extends Subtask {
    subtasks?: Subtask[];
}
