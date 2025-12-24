"use client";

import { Sidebar } from "./sidebar";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="pl-64">
        <div className="container py-8 px-6">{children}</div>
      </main>
    </div>
  );
}
