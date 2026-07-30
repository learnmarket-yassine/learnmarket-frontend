interface Props {
  className?: string
}
const ArrowDownIcon = (props: Props) => {
  return (
    <svg
      className={props.className}
      width="13"
      height="8"
      viewBox="0 0 13 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1 1.3125L6.5 6.68764L12 1.3125"
        stroke="#4C4C4C"
        strokeWidth="2.01568"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default ArrowDownIcon
