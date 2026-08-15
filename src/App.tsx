import AppRoutes from './Routes'
import { TooltipProvider } from './components/ui/tooltip'
import { useSocketConnection } from './features/messaging/hooks/useSocketConnection'
import { useNotificationsSocketConnection } from './features/notifications/hooks/useNotificationsSocketConnection'

function App() {
  useSocketConnection()
  useNotificationsSocketConnection()
  return (
    <div className="h-screen min-h-screen w-full gap-3 bg-white">
      <TooltipProvider>
        <AppRoutes />
      </TooltipProvider>
    </div>
  )
}

export default App
