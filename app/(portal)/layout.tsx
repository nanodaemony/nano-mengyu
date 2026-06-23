import ModuleNavbar from "@/components/layout/ModuleNavbar";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <ModuleNavbar />
      <main className="flex-1 p-4 md:p-6">{children}</main>
    </div>
  );
}
