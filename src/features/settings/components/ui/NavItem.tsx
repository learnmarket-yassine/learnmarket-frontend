import React from 'react'

export type NavItemType = {
  stepNumber: number
  label: string
  component: React.ReactNode
  show: boolean
}
export type NavItemProps = NavItemType & {
  isActive: boolean
  onSelect: (id: number) => void
}

const NavItem = ({ stepNumber, label, isActive, onSelect }: NavItemProps) => {
  return (
    <button
      type="button"
      onClick={() => onSelect(stepNumber)}
      className={`block w-full border-[#2e2e2e] px-4 py-3 text-left text-base ${
        isActive ? 'border-l-4 font-semibold' : 'border-l-[0.5px] font-medium hover:bg-gray-50'
      }`}
    >
      {label}
    </button>
  )
}

export default NavItem
