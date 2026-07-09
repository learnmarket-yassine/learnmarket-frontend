import { Category } from '@/types/category'

interface CategoryListItemProps {
  category: Category
  isActive: boolean
  selectedCount: number
  onSelect: (categoryId: string) => void
}

function CategoryListItem({ category, isActive, selectedCount, onSelect }: CategoryListItemProps) {
  return (
    <li>
      <button
        type="button"
        onClick={() => onSelect(category.id)}
        aria-pressed={isActive}
        className={`block w-full rounded-md px-2 py-1.5 text-left text-sm font-bold transition-colors hover:text-[#2563EB] ${
          isActive ? 'text-[#2563EB]' : 'text-[#4B5563]'
        }`}
      >
        {category.name}
        {selectedCount > 0 && ` (${selectedCount})`}
      </button>
    </li>
  )
}

export default CategoryListItem
