import classes from './Loader.module.css'
import { cn } from '@/lib/utils'

type Props = {
  className?: string
  fillColor?: string
  width?: string
  height?: string
}

const Loader = (props: Props) => {
  // const fillColor = props.color || "#4D2EB2";
  const { className, width = '43', height = '44', fillColor = '#2563eb' } = props

  return (
    <div className={cn(className)} style={{ width, height }}>
      <div className={cn(classes.loader)}>
        <svg
          width={width}
          height={height}
          viewBox="0 0 43 44"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            opacity="0.87"
            x="18.4839"
            y="15.2725"
            width="5.68715"
            height="14.2179"
            rx="2.84358"
            transform="rotate(135 18.4839 15.2725)"
            fill={fillColor}
          />
          <rect
            opacity="0.75"
            x="14.3909"
            y="19.4663"
            width="5.68715"
            height="14.2179"
            rx="2.84358"
            transform="rotate(90 14.3909 19.4663)"
            fill={fillColor}
          />
          <rect
            opacity="0.63"
            x="14.4631"
            y="25.3257"
            width="5.68715"
            height="14.2179"
            rx="2.84358"
            transform="rotate(45 14.4631 25.3257)"
            fill={fillColor}
          />
          <rect
            opacity="0.51"
            x="18.6562"
            y="29.4185"
            width="5.68715"
            height="14.2179"
            rx="2.84358"
            fill={fillColor}
          />
          <rect
            opacity="0.39"
            x="38.5947"
            y="35.3794"
            width="5.68715"
            height="14.2179"
            rx="2.84358"
            transform="rotate(135 38.5947 35.3794)"
            fill={fillColor}
          />
          <rect
            opacity="0.27"
            x="42.8267"
            y="19.4663"
            width="5.68715"
            height="14.2179"
            rx="2.84358"
            transform="rotate(90 42.8267 19.4663)"
            fill={fillColor}
          />
          <rect
            opacity="0.15"
            x="34.5737"
            y="5.21924"
            width="5.68715"
            height="14.2179"
            rx="2.84358"
            transform="rotate(45 34.5737 5.21924)"
            fill={fillColor}
          />
          <rect
            x="18.6562"
            y="0.98291"
            width="5.68715"
            height="14.2179"
            rx="2.84358"
            fill={fillColor}
          />
        </svg>
      </div>
    </div>
  )
}

export default Loader
