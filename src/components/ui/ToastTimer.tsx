import React from 'react'
import { Theme, TypeOptions } from 'react-toastify'

interface TimerProps {
  theme: Theme
  type: TypeOptions
  duration: number
}

const ToastTimer: React.FC<TimerProps> = ({ theme, type, duration }) => {
  const [timeLeft, setTimeLeft] = React.useState(duration)

  React.useEffect(() => {
    if (timeLeft <= 0) return

    const intervalId = setInterval(() => {
      setTimeLeft((prevTime) => Math.max(prevTime - 1000, 0))
    }, 1000)

    return () => clearInterval(intervalId)
  }, [timeLeft])

  const seconds = Math.ceil(timeLeft / 1000)

  if (seconds === 0) return null

  return (
    <div
      style={{
        fontSize: '14px',
        fontWeight: 'bold',
        color: theme === 'colored' ? '#fff' : type === 'success' ? '#2563EB' : '#C72C41',
      }}
    >
      {seconds}s
    </div>
  )
}
export default ToastTimer
