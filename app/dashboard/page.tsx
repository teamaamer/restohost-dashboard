import { Suspense } from "react"
import { OverviewContent } from "./overview-content"

export default function DashboardPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-3 shadow-xl border-0">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Overview
        </h1>
        <p className="text-gray-600 mt-0.5 text-sm">
          Restaurant analytics and insights
        </p>
      </div>
      <OverviewContent />
    </Suspense>
  )
}
