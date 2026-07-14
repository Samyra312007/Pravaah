"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Inter } from "next/font/google";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { getStoredUser, clearSession } from "@/lib/auth";
import type { User } from "@/types/common";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/maps": "Geospatial Analysis",
  "/drill-down": "Drill-Down Navigation",
  "/network": "Network & Link Analysis",
  "/cases": "Case Management",
  "/reports": "Intelligence Reports",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    const stored = getStoredUser();
    if (!stored && pathname !== "/login") {
      router.push("/login");
    } else {
      setUser(stored);
    }
  }, [pathname, router]);

  const handleLogout = () => {
    clearSession();
    router.push("/login");
  };

  if (!mounted) return null;

  if (pathname === "/login") {
    return (
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    );
  }

  const currentTitle = Object.entries(pageTitles).find(([path]) =>
    pathname?.startsWith(path)
  )?.[1] || "KSP Crime Intelligence";

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex min-h-screen">
          <Sidebar user={user} onLogout={handleLogout} />
          <div className="flex-1 ml-64">
            <Header title={currentTitle} />
            <main className="p-6">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
