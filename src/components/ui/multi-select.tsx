
"use client"

import * as React from "react"
import { Check, ChevronsUpDown, PlusCircle, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "./badge"

export type MultiSelectOption = {
  value: string
  label: string
}

interface MultiSelectProps {
  options: MultiSelectOption[]
  selected: string[]
  onChange: (selected: string[]) => void
  className?: string
  placeholder?: string
  allowOther?: boolean
  asDropdown?: boolean
}

export function MultiSelect({
  options,
  selected,
  onChange,
  className,
  placeholder = "Select...",
  allowOther = false,
  asDropdown = false,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [otherValue, setOtherValue] = React.useState("")

  const handleSelect = (value: string) => {
    const newSelected = selected.includes(value)
      ? selected.filter((item) => item !== value)
      : [...selected, value]
    onChange(newSelected)
  }

  const handleAddOther = () => {
    if (otherValue && !selected.includes(otherValue)) {
      onChange([...selected, otherValue])
    }
    setOtherValue("")
  }

  const renderContent = () => (
    <>
      <CommandInput
        placeholder="Search..."
        value={otherValue}
        onValueChange={allowOther ? setOtherValue : undefined}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {options.map((option) => (
            <CommandItem
              key={option.value}
              onSelect={() => handleSelect(option.value)}
              className="cursor-pointer"
            >
              <Check
                className={cn(
                  "mr-2 h-4 w-4",
                  selected.includes(option.value) ? "opacity-100" : "opacity-0"
                )}
              />
              {option.label}
            </CommandItem>
          ))}
        </CommandGroup>
        {allowOther && (
          <>
            <CommandSeparator />
            <CommandGroup>
                <div className="p-2">
                     <CommandItem
                        onSelect={handleAddOther}
                        className="flex items-center gap-2 cursor-pointer"
                        disabled={!otherValue || selected.includes(otherValue)}
                     >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add: "{otherValue}"
                     </CommandItem>
                </div>
            </CommandGroup>
          </>
        )}
      </CommandList>
    </>
  );

  if (asDropdown) {
    return (
        <Command className="p-1">
          {renderContent()}
        </Command>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between h-auto", className)}
        >
          <div className="flex gap-1 flex-wrap">
            {selected.length > 0 ? (
              selected.map((value) => {
                const label = options.find((opt) => opt.value === value)?.label || value;
                return <Badge key={value} variant="secondary">{label}</Badge>
              })
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
            {renderContent()}
        </Command>
      </PopoverContent>
    </Popover>
  )
}

    