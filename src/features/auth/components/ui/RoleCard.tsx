type Props = {
  title: string
  description: string
  image: string
  variant: 'left' | 'right'
}

export default function RoleCard({ title, description, image, variant }: Props) {
  const clipId = `card-clip-${variant}`

  const paths = {
    left: 'M730.002 4H4.00214L4.50214 936H904.002C931.616 936 954.002 913.614 954.002 886V174.5C954.002 146.886 931.616 124.5 904.002 124.5H830.002C802.388 124.5 780.002 102.114 780.002 74.5V54C780.002 26.3858 757.616 4 730.002 4Z',
    right:
      'M228 4H954L953.5 936H54C26.3858 936 4 913.614 4 886V174.5C4 146.886 26.3858 124.5 54 124.5H128C155.614 124.5 178 102.114 178 74.5V54C178 26.3858 200.386 4 228 4Z',
  }

  return (
    <>
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <clipPath
            id={clipId}
            clipPathUnits="objectBoundingBox"
            transform="scale(0.001044 0.001064)"
          >
            <path d={paths[variant]} />
          </clipPath>
        </defs>
      </svg>

      <div
        className="relative overflow-hidden"
        style={{ clipPath: `url(#${clipId})`, height: 'calc(100vh - 130px)' }}
      >
        <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-x-0 bottom-0 h-[300px] bg-gradient-to-t from-black to-transparent" />
        <div className="absolute bottom-14 left-14 right-14 max-w-[500px] text-white">
          <h2 className="text-3xl font-bold">{title}</h2>
          <p className="mt-6 text-2xl leading-relaxed">{description}</p>
        </div>
      </div>
    </>
  )
}
