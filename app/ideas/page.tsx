import IdeaGrid from "@/components/ideas/IdeaGrid";

export default function IdeasPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <span className="inline-block w-1 h-6 rounded-full bg-module-ideas" />
          <h1 className="text-2xl font-bold tracking-tight">灵感卡片</h1>
        </div>
      </div>
      <IdeaGrid />
    </div>
  );
}
