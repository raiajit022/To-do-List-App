"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function Calendar() {
  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const [date, setDate] = useState(new Date())
  const currentYear = date.getFullYear()
  const currentMonth = date.getMonth()

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay()
  }

  const handlePrevMonth = () => {
    setDate(new Date(currentYear, currentMonth - 1))
  }

  const handleNextMonth = () => {
    setDate(new Date(currentYear, currentMonth + 1))
  }

  // Generate array of years from 1900 to 2100
  const years = Array.from({ length: 201 }, (_, i) => 1900 + i)

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Select
            value={currentMonth.toString()}
            onValueChange={(value) => setDate(new Date(currentYear, Number.parseInt(value)))}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue>{months[currentMonth]}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {months.map((month, i) => (
                <SelectItem key={i} value={i.toString()}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={currentYear.toString()}
            onValueChange={(value) => setDate(new Date(Number.parseInt(value), currentMonth))}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue>{currentYear}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-1">
          <button className="rounded-full p-1 hover:bg-blue-100" onClick={handlePrevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button className="rounded-full p-1 hover:bg-blue-100" onClick={handleNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-sm">
        {days.map((day) => (
          <div key={day} className="p-2 text-xs text-muted-foreground">
            {day}
          </div>
        ))}
        {Array.from({ length: getFirstDayOfMonth(currentYear, currentMonth) }, (_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {Array.from({ length: getDaysInMonth(currentYear, currentMonth) }, (_, i) => (
          <button
            key={i + 1}
            className={`rounded-full p-2 hover:bg-blue-100 ${
              i + 1 === date.getDate() ? "bg-blue-600 text-white hover:bg-blue-700" : ""
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  )
}

