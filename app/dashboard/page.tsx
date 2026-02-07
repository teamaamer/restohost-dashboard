import { Suspense } from "react"
import { OverviewContent } from "./overview-content"

export default function DashboardPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OverviewContent />
    </Suspense>
  )
}
