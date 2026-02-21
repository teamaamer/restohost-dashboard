"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSidebar } from "./dashboard-sidebar-context";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Phone, 
  Calendar,
  UtensilsCrossed,
  LogOut,
  BarChart3
} from "lucide-react";
import { useAuthStore } from "@/lib/auth-store";

const navigation = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Orders", href: "/dashboard/orders", icon: ShoppingBag },
  { name: "Calls", href: "/dashboard/calls", icon: Phone },
  { name: "Reservations", href: "/dashboard/reservations", icon: Calendar },
  { name: "Menu", href: "/dashboard/menu", icon: UtensilsCrossed },
];

export default function DashboardNavRail() {
  const pathname = usePathname();
  const { isHovered, setIsHovered } = useSidebar();
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  const tabClass = (active: boolean) =>
    `group w-full flex items-center gap-3 rounded-xl border transition-all duration-300 ease-out ${
      active
        ? "bg-black text-white shadow-lg shadow-black/50"
        : "text-gray-700 hover:bg-gray-50 hover:text-black"
    } ${isHovered ? "px-3 py-2.5" : "justify-center px-3 py-2.5"}`;

  return (
    <motion.aside
      className="fixed top-0 left-0 z-40 hidden md:block h-screen max-h-screen bg-white/95 backdrop-blur-xl shadow-xl shadow-black/5 border-r border-slate-200"
      initial={{ width: "80px" }}
      animate={{ width: isHovered ? "288px" : "80px" }}
      onMouseEnter={() => !isTouchDevice && setIsHovered(true)}
      onMouseLeave={() => !isTouchDevice && setIsHovered(false)}
      onClick={() => isTouchDevice && setIsHovered(!isHovered)}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="flex h-full max-h-screen flex-col p-4 overflow-visible">
        {/* Logo */}
        <div className="mb-4 flex items-center justify-center">
          <Link
            href="/"
            className="flex items-center hover:opacity-80 transition-opacity overflow-hidden"
          >
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center flex-shrink-0">
              <BarChart3 className="h-5 w-5 text-white" strokeWidth={2.5} />
            </div>
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{
                opacity: isHovered ? 1 : 0,
                width: isHovered ? "auto" : 0,
                marginLeft: isHovered ? "12px" : "0px",
              }}
              transition={{ duration: 0.3 }}
              className="font-bold text-slate-900 whitespace-nowrap text-sm"
            >
              Restaurant Analytics
            </motion.span>
          </Link>
        </div>

        <div className="border-t border-slate-200 mb-4" />

        {/* Navigation Links */}
        <div className="flex-1 overflow-x-visible flex flex-col">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-xs font-semibold tracking-wide text-slate-500 px-3 mb-3"
          >
            {isHovered && "DASHBOARD"}
          </motion.div>

          <div className="space-y-1.5 flex-1">
            {navigation.map((item) => {
              // For Overview (/dashboard), only match exact path
              // For other routes, match exact path or sub-routes
              const isActive = item.href === "/dashboard" 
                ? pathname === item.href
                : pathname === item.href || pathname?.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={tabClass(isActive)}
                >
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: isActive ? 1 : 0,
                      width: isActive ? "4px" : "0px",
                      height: "24px",
                    }}
                    transition={{ duration: 0.3 }}
                    className="rounded-full flex-shrink-0 bg-white/80"
                  />
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{
                      opacity: isHovered ? 1 : 0,
                      width: isHovered ? "auto" : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    className="whitespace-nowrap overflow-hidden text-sm font-medium"
                  >
                    {item.name}
                  </motion.span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="mt-6">
          <button
            type="button"
            onClick={() => {
              logout();
              window.location.href = "/login";
            }}
            className={`w-full flex items-center rounded-xl border border-red-500/50 bg-white/80 text-sm font-medium text-red-500 transition-all duration-300 hover:bg-red-500/10 hover:border-red-500 hover:shadow-lg hover:shadow-red-500/20 hover:scale-105 hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0 overflow-hidden ${
              isHovered ? "px-3 py-3" : "justify-center py-3"
            }`}
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{
                opacity: isHovered ? 1 : 0,
                width: isHovered ? "auto" : 0,
                marginLeft: isHovered ? "8px" : "0px",
              }}
              transition={{ duration: 0.3 }}
              className="whitespace-nowrap"
            >
              Sign out
            </motion.span>
          </button>
        </div>
      </div>
    </motion.aside>
  );
}
