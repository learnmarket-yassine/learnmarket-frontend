import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { NextUIProvider } from '@nextui-org/react'
import { ToastContainer } from 'react-toastify'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})
createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <NextUIProvider>
      <QueryClientProvider client={queryClient}>
        <App />
        <ToastContainer theme="colored" icon={false} />
      </QueryClientProvider>
    </NextUIProvider>
  </BrowserRouter>
)
