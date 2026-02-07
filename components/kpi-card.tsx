import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"

interface KpiCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  description?: string
  trend?: {
    value: number
    isPositive: boolean
  }
}

const iconColors = [
  { bg: "from-cyan-500 to-blue-500", text: "text-black" }, // Total Sales - cyan/blue for money
  { bg: "from-purple-500 to-purple-600", text: "text-black" }, // Orders - purple for shopping cart
  { bg: "from-pink-500 to-red-500", text: "text-black" }, // Avg Ticket - pink/red for trending up
  { bg: "from-cyan-500 to-blue-500", text: "text-black" }, // Total Calls - cyan/blue for phone
  { bg: "from-purple-500 to-purple-600", text: "text-black" }, // Call Minutes - purple for clock/time
  { bg: "from-pink-500 to-red-500", text: "text-black" }, // Conversion Rate - pink/red for percentage
]

let cardIndex = 0

export function KpiCard({ title, value, icon: Icon, description, trend }: KpiCardProps) {
  const colors = iconColors[cardIndex % iconColors.length]
  cardIndex++
  
  return (
    <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] bg-white backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-3 px-4 relative z-10">
        <CardTitle className="text-xs font-semibold text-gray-700">{title}</CardTitle>
        <div className={`p-2 rounded-lg bg-gradient-to-br ${colors.bg} shadow-md`}>
          <Icon className="h-4 w-4 text-white" />
        </div>
      </CardHeader>
      <CardContent className="relative z-10 px-4 pb-3">
        <div className={`text-2xl font-bold ${colors.text}`}>
          {value}
        </div>
        {description && (
          <p className="text-[10px] text-gray-600 mt-1 font-medium">{description}</p>
        )}
        {trend && (
          <div className={`inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
            trend.isPositive 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            <span>{trend.isPositive ? '↑' : '↓'}</span>
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
