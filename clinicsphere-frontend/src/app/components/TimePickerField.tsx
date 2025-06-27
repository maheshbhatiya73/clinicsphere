import { Clock } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function TimePickerField({
  day,
  label,
  value,
  onChange,
}: {
  day: string
  label: string
  value: string
  onChange: (time: string) => void
}) {
  return (
    <div className="space-y-2">
      <Label
        htmlFor={`${day}-open`}
        className="text-sm font-medium text-gray-700 flex items-center gap-2"
      >
        <Clock className="w-4 h-4 text-indigo-600" />
        {label}
      </Label>
      <div className="relative">
        <Input
          id={`${day}-open`}
          type="time"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="border-gray-200 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg pl-10 transition-all duration-200"
          required
        />
        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
      </div>
    </div>
  )
}
    