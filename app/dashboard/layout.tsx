"use client"

import { SidebarProvider, useSidebar } from "@/components/dashboard-sidebar-context"
import DashboardNavRail from "@/components/dashboard-navrail"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import { ProtectedRoute } from "@/components/ProtectedRoute"
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
    <ProtectedRoute>
      <SidebarProvider>
        <div className="h-screen overflow-hidden bg-white flex relative">
          {/* Grid pattern background */}
          <div className="absolute inset-0 [background-size:20px_20px] [background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]"></div>
          {/* Radial gradient for faded look */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
          
          <DashboardNavRail />
          <DashboardContent>{children}</DashboardContent>
          <MobileBottomNav />
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  )
}
