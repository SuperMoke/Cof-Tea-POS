import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function CategoryFilter({ categories, selectedCategory, onChange }) {
  return (
    <div className="mb-6">
      <Label htmlFor="filter-category" className="mb-2 block">
        Filter by Category
      </Label>
      <Select
        value={selectedCategory || "all"}
        onValueChange={(value) => onChange(value === "all" ? null : value)}
      >
        <SelectTrigger className="w-[280px]">
          <SelectValue placeholder="All Categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              <div className="flex items-center">
                <span className="ml-2">{category.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
