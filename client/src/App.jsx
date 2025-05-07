import { useState } from 'react'
import './index.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="card max-w-lg w-full">
        <header className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-primary-600">FinSight</h1>
          <p className="text-gray-600 mt-2">AI-Driven Financial Health Dashboard</p>
        </header>
        
        <div className="text-center mb-6">
          <p className="mb-4">Welcome to FinSight! This is a placeholder dashboard.</p>
          <p className="mb-4">Count: {count}</p>
          <button 
            className="btn btn-primary" 
            onClick={() => setCount((count) => count + 1)}
          >
            Increment
          </button>
        </div>
        
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Phase 1 Setup Complete</p>
        </div>
      </div>
    </div>
  )
}

export default App