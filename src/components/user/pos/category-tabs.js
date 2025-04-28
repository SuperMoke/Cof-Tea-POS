"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function CategoryTabs({
  categories,
  selectedCategory,
  onCategoryChange,
}) {
  if (!categories || categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <p className="text-muted-foreground">No categories found</p>
      </div>
    );
  }

  return (
    <Tabs
      value={selectedCategory}
      onValueChange={onCategoryChange}
      className="w-full"
    >
      <TabsList className="w-full justify-start mb-4 overflow-x-auto scrollbar-hide">
        <div className="inline-flex pr-4">
          {categories.map((category) => (
            <TabsTrigger
              key={category.id}
              value={category.id}
              className="flex items-center whitespace-nowrap"
            >
              {category.name}
            </TabsTrigger>
          ))}
        </div>
      </TabsList>
    </Tabs>
  );
}
