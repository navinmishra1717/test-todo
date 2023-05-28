export enum TaskStatus {
    pending = 'pending',
    completed = 'completed'
}

export interface TaskFillable {
    title: string;
}

export interface Subtask extends TaskFillable {
    id: number;
    status: TaskStatus;
}

export interface Task extends Subtask {
    subtasks?: Subtask[];
}
