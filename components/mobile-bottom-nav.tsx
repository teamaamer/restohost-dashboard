"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, ShoppingBag, Phone, Store, Home, LogOut } from "lucide-react"
import { motion } from "framer-motion"
import { useAuthStore } from "@/lib/auth-store"

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Orders", href: "/dashboard/orders", icon: ShoppingBag },
  { name: "Calls", href: "/dashboard/calls", icon: Phone },
  { name: "Restaurants", href: "/dashboard/restaurants", icon: Store },
]

export function MobileBottomNav() {
  const pathname = usePathname()
  const logout = useAuthStore((state) => state.logout)

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-slate-200 shadow-lg">
      <nav className="flex items-center justify-around px-1 py-2">
        {navigation.map((item) => {
          const isActive = item.href === "/dashboard" 
            ? pathname === item.href
            : pathname === item.href || pathname?.startsWith(`${item.href}/`)
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className="relative flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-lg transition-all duration-200"
            >
              {isActive && (
                <motion.div
                  layoutId="mobile-active"
                  className="absolute inset-0 bg-black rounded-lg"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <item.icon 
                className={`h-4 w-4 relative z-10 ${
                  isActive ? "text-white" : "text-gray-600"
                }`} 
              />
              <span 
                className={`text-[10px] mt-0.5 font-medium relative z-10 ${
                  isActive ? "text-white" : "text-gray-600"
                }`}
              >
                {item.name}
              </span>
            </Link>
          )
        })}

        {/* Logout */}
        <button
          onClick={() => {
            logout()
            window.location.href = "/login"
          }}
          className="flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-lg transition-all duration-200"
        >
          <LogOut className="h-4 w-4 text-red-500" />
          <span className="text-[10px] mt-0.5 font-medium text-red-500">
            Logout
          </span>
        </button>
      </nav>
    </div>
  )
}
