"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { DateRange as ReactDateRange } from "react-date-range"
import "react-date-range/dist/styles.css"
import "react-date-range/dist/theme/default.css"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DateRange {
  from?: Date
  to?: Date
}

interface DateRangePickerProps {
  date: DateRange | undefined
  onDateChange: (date: DateRange | undefined) => void
  className?: string
}

export function DateRangePicker({
  date,
  onDateChange,
  className,
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [state, setState] = React.useState([
    {
      startDate: date?.from || new Date(),
      endDate: date?.to || new Date(),
      key: 'selection'
    }
  ])

  const handleSelect = (ranges: any) => {
    const { startDate, endDate } = ranges.selection
    setState([ranges.selection])
    
    // Only update parent and close if both dates are selected and they're different
    if (startDate && endDate && startDate.getTime() !== endDate.getTime()) {
      onDateChange({
        from: startDate,
        to: endDate
      })
      // Small delay to ensure the selection is visible before closing
      setTimeout(() => setOpen(false), 100)
    }
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal bg-white border-gray-200 hover:border-black hover:bg-gray-50 transition-all duration-200",
              !date && "text-gray-500"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 text-black" />
            {date?.from ? (
              date.to ? (
                <span className="font-medium text-gray-700">
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </span>
              ) : (
                <span className="font-medium text-gray-700">
                  {format(date.from, "LLL dd, y")}
                </span>
              )
            ) : (
              <span className="text-gray-500">Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-white border-gray-200 shadow-xl" align="start">
          <ReactDateRange
            ranges={state}
            onChange={handleSelect}
            months={2}
            direction="horizontal"
            rangeColors={["#000000"]}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
