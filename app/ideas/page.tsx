import IdeaGrid from "@/components/ideas/IdeaGrid";

export default function IdeasPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <h1 className="text-2xl font-bold">💡 灵感卡片</h1>
      <IdeaGrid />
    </div>
  );
}
