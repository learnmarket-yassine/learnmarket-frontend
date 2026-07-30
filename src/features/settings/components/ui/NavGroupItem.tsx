import NavItem, { NavItemType } from './NavItem'

type NavGroupItemProps = {
  label: string
  items: NavItemType[]
  onSelectItem: (id: number) => void
  selectedItem: number
}

const NavGroupItem = ({ label, items, onSelectItem, selectedItem }: NavGroupItemProps) => {
  const filteredItems = items.filter((item) => item.show)

  return (
    <div className="space-y-3">
      <h3 className="text-2xl font-semibold">{label}</h3>
      <div>
        {filteredItems.map((item) => (
          <NavItem
            key={item.stepNumber}
            {...item}
            onSelect={onSelectItem}
            isActive={selectedItem === item.stepNumber}
          />
        ))}
      </div>
    </div>
  )
}

export default NavGroupItem
