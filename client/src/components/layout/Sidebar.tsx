"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Map,
  Share2,
  FolderSearch,
  FileText,
  Shield,
  LogOut,
  GitBranch,
} from "lucide-react";
import type { User } from "@/types/common";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/maps", label: "Geospatial Maps", icon: Map },
  { href: "/drill-down", label: "Drill-Down Nav", icon: GitBranch },
  { href: "/network", label: "Network Analysis", icon: Share2 },
  { href: "/cases", label: "Cases", icon: FolderSearch },
  { href: "/reports", label: "Reports", icon: FileText },
];

interface SidebarProps {
  user: User | null;
  onLogout: () => void;
}

export function Sidebar({ user, onLogout }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-ksp-navy text-white flex flex-col h-screen fixed left-0 top-0">
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <Shield className="h-8 w-8 text-ksp-gold" />
          <div>
            <h1 className="font-bold text-lg leading-tight">KSP</h1>
            <p className="text-xs text-white/60">Crime Intelligence</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname?.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-ksp-blue text-white"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        {user && (
          <div className="flex items-center gap-3 mb-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-ksp-gold flex items-center justify-center text-xs font-bold text-ksp-navy">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-white/40 truncate">{user.role.replace("_", " ")}</p>
            </div>
          </div>
        )}
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/60 hover:text-red-400 hover:bg-white/5 w-full transition-colors"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
