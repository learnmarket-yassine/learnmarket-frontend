import AppRoutes from './Routes'
import { TooltipProvider } from './components/ui/tooltip'

function App() {
  return (
    <div className="h-screen min-h-screen w-full gap-3 bg-white">
      <TooltipProvider>
        <AppRoutes />
      </TooltipProvider>
    </div>
  )
}

export default App
