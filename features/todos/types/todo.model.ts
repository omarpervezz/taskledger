export interface TodoModel {
  userId: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  version: number;
}
