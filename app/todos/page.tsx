import TodoList from "@/components/todos/TodoList";

export default function TodosPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <span className="inline-block w-1 h-6 rounded-full bg-module-todos" />
          <h1 className="text-2xl font-bold tracking-tight">待办事项</h1>
        </div>
        <p className="ml-4 text-sm text-[var(--color-text-secondary)]">
          管理你的每日任务
        </p>
      </div>
      <TodoList />
    </div>
  );
}
