"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useStore } from "@/store/useStore";
import Link from "next/link";
import { 
  LayoutDashboard, 
  UserPlus, 
  Search, 
  LogOut, 
  ShieldAlert,
  Menu,
  X
} from "lucide-react";
import clsx from "clsx";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useStore((state) => state.user);
  const logout = useStore((state) => state.logout);
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!user) {
      router.replace("/login");
    }
  }, [user, router]);

  if (!mounted || !user) {
    return null; // or a loading spinner
  }

  const navItems = [
    { name: "Panel", href: "/dashboard", icon: LayoutDashboard },
    { name: "Registrar", href: "/dashboard/register", icon: UserPlus },
    { name: "Buscar", href: "/dashboard/search", icon: Search },
  ];

  return (
    <div className="flex bg-background h-screen overflow-hidden">
      {/* Mobile sidebar backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/80 backdrop-blur-sm lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0",
          !isSidebarOpen && "-translate-x-full"
        )}
      >
        <div className="flex h-16 shrink-0 items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-6 w-6 text-blue-600" />
            <span className="font-semibold text-lg dark:text-white">CreditRisk</span>
          </div>
          <button 
            className="lg:hidden text-slate-500 hover:text-slate-700 dark:text-slate-400"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col px-4 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={clsx(
                  "group flex gap-x-3 rounded-md p-2 text-sm font-medium leading-6 transition-colors",
                  isActive
                    ? "bg-slate-50 text-blue-600 dark:bg-slate-800 dark:text-blue-400"
                    : "text-slate-700 hover:bg-slate-50 hover:text-blue-600 dark:text-slate-400 dark:hover:bg-slate-800"
                )}
              >
                <item.icon
                  className={clsx(
                    "h-5 w-5 shrink-0",
                    isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-400 group-hover:text-blue-600 dark:text-slate-500"
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md px-4 sm:px-6 lg:px-8">
          <button
            className="-m-2.5 p-2.5 text-slate-700 lg:hidden"
            onClick={() => setIsSidebarOpen(true)}
          >
            <span className="sr-only">Abrir barra lateral</span>
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex flex-1 justify-end gap-x-4 self-stretch lg:gap-x-6 items-center">
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                {user.email}
              </span>
              <button
                onClick={() => {
                  logout();
                  router.push("/login");
                }}
                className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              >
                <LogOut className="h-4 w-4" />
                Cerrar sesión
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto bg-slate-50 dark:bg-[#0f172a] p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
