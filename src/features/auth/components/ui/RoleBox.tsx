type RoleBoxProps = {
  onClick: () => void
  active: boolean
  title: string
}

const RoleBox = ({ onClick, active, title }: RoleBoxProps) => {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-8 py-4 font-semibold ${
        active ? 'bg-[#143681] text-white' : 'bg-[#FFFFFF] text-[#143681]'
      }`}
    >
      {title}
    </button>
  )
}

export default RoleBox
