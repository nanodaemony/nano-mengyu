import TodoList from "@/components/todos/TodoList";

export default function TodosPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">✅ 待办事项</h1>
      <TodoList />
    </div>
  );
}
