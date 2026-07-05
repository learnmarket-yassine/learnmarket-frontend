type EmptyBoxProps = {
  title: string
  children: React.ReactNode
}

const EmptyBox: React.FC<EmptyBoxProps> = ({ title, children }) => {
  return (
    <div className="w-[300px] rounded-2xl border border-dashed border-[#9CA3AF] px-10 py-16">
      <div className="flex flex-col gap-4">
        {children}
        <p className="text-2xl font-medium text-[#334155]">{title}</p>
      </div>
    </div>
  )
}

export default EmptyBox
