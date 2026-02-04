"use client"

import { SidebarProvider, useSidebar } from "@/components/dashboard-sidebar-context"
import DashboardNavRail from "@/components/dashboard-navrail"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { isHovered } = useSidebar()
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  return (
    <div className="flex-1 overflow-y-auto">
      <motion.main 
        className="p-4 pb-24 md:pb-8"
        initial={false}
        animate={{ 
          marginLeft: isMobile ? "0px" : (isHovered ? "288px" : "80px")
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {children}
      </motion.main>
    </div>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <div className="h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30 flex">
        <DashboardNavRail />
        <DashboardContent>{children}</DashboardContent>
        <MobileBottomNav />
      </div>
    </SidebarProvider>
  )
}
