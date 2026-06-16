export interface Todo {
  id: string;
  title: string;
  done: boolean;
  priority: "high" | "medium" | "low";
  tags: string[];
  createdAt: string;
}
