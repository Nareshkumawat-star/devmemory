import { Navigation } from "@/components/layout/Navigation";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

export function Layout({ children, title }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {title && <h1 className="text-2xl font-bold tracking-tight mb-4">{title}</h1>}
          {children}
        </div>
      </main>
    </div>
  );
}
