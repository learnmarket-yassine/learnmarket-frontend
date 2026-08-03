import React from 'react'
import { toast, Bounce } from 'react-toastify'
import { css } from 'glamor'

import CustomToast from './CustomToast'
import ToastTimer from '../ui/ToastTimer'

type ToastProps = {
  type: 'success' | 'error'
  message: string
}

const ToastMessage: React.FC<ToastProps> = ({ type, message }) => {
  const toastType = type === 'success' ? toast.success : toast.error
  const backgroundColor = type === 'success' ? '#2563EB' : '#C72C41'
  toastType(<CustomToast message={message} type={type} />, {
    className: css({
      background: `${backgroundColor} !important`,
      color: 'white !important',
      fontWeight: 'bold',
    }).toString(),
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    transition: Bounce,
    icon: ({ theme, type }) => <ToastTimer theme={theme} type={type} duration={3500} />,
  })

  return null
}

export default ToastMessage
