import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { FilterOption } from "./job-header";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface FilterPopoverProps {
  label: string;
  options: FilterOption[];
  selected: string;
  onSelect: (value: string) => void;
  paramPlaceholder: "jpd" | "jt" | "jl" | "search" | "cid" | "jel" | "js";
}

const FilterPopover: React.FC<FilterPopoverProps> = ({
  label,
  options,
  selected,
  onSelect,
  paramPlaceholder,
}) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-auto justify-between"
        >
          {selected
            ? options.find((opt) => opt.value === selected)?.label || label
            : label}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Command>
          <CommandInput placeholder={`Search ${label.toLowerCase()}...`} />
          <CommandList>
            <CommandEmpty>No options found.</CommandEmpty>
            <CommandGroup>
              {options.map((opt) => (
                <CommandItem
                  key={opt.value}
                  value={opt.value}
                  onSelect={(currentValue) => {
                    onSelect(currentValue === selected ? "" : currentValue);
                    setOpen(false);
                    if (paramPlaceholder) {
                      if (currentValue === selected) {
                        const params = new URLSearchParams(searchParams);
                        params.delete(paramPlaceholder);
                        replace(`${pathname}?${params.toString()}`);
                      } else {
                        const params = new URLSearchParams(searchParams);
                        params.set(paramPlaceholder, currentValue);
                        replace(`${pathname}?${params.toString()}`);
                      }
                    }
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selected === opt.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {opt.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default FilterPopover;
