"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "@/lib/auth"
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Phone, 
  Store, 
  LogOut, 
  Menu,
  X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Orders", href: "/dashboard/orders", icon: ShoppingBag },
  { name: "Calls", href: "/dashboard/calls", icon: Phone },
  { name: "Restaurants", href: "/dashboard/restaurants", icon: Store },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="h-screen overflow-hidden bg-transparent flex">
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-b border-white/20 px-4 py-3 flex items-center justify-between shadow-lg">
        <h1 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Restaurant Analytics
        </h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="hover:bg-purple-100"
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      <div
        className={cn(
          "fixed lg:relative inset-y-0 left-0 z-40 w-64 bg-white/95 backdrop-blur-xl border-r border-white/20 shadow-2xl transform transition-transform duration-200 ease-in-out lg:translate-x-0 flex-shrink-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-purple-100 bg-gradient-to-br from-indigo-50 to-purple-50 flex-shrink-0">
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Restaurant Analytics
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              RestoHost.ai Dashboard
            </p>
          </div>

          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-purple-500/50 scale-105"
                      : "text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:scale-105"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          <div className="p-4 border-t border-purple-100 flex-shrink-0">
            <Button
              variant="ghost"
              className="w-full justify-start hover:bg-red-50 hover:text-red-600 rounded-xl"
              onClick={async () => {
                await signOut({ redirectTo: "/login" })
              }}
            >
              <LogOut className="h-5 w-5 mr-3" />
              Sign out
            </Button>
          </div>
        </div>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1 overflow-y-auto pt-16 lg:pt-0">
        <main className="p-4 pb-8">{children}</main>
      </div>
    </div>
  )
}
