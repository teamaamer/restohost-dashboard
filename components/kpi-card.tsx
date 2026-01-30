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

const gradients = [
  "from-blue-500 to-cyan-500",
  "from-purple-500 to-pink-500",
  "from-orange-500 to-red-500",
  "from-green-500 to-emerald-500",
  "from-indigo-500 to-purple-500",
  "from-pink-500 to-rose-500",
]

let cardIndex = 0

export function KpiCard({ title, value, icon: Icon, description, trend }: KpiCardProps) {
  const gradient = gradients[cardIndex % gradients.length]
  cardIndex++
  
  return (
    <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] bg-white/95 backdrop-blur-sm">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-10`}></div>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-3 px-4 relative z-10">
        <CardTitle className="text-xs font-semibold text-gray-700">{title}</CardTitle>
        <div className={`p-2 rounded-lg bg-gradient-to-br ${gradient} shadow-md`}>
          <Icon className="h-4 w-4 text-white" />
        </div>
      </CardHeader>
      <CardContent className="relative z-10 px-4 pb-3">
        <div className={`text-2xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
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
