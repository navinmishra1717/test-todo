export enum TodoStatus {
  pending = 'pending',
  completed = 'completed',
}

export interface TodoFillable {
  title: string;
}

export interface TodoDto {
  id: number;
  title: string;
  status: TodoStatus;
  createdAt: Date;
}
