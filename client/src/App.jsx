import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <div className="container mx-auto py-6">
            <h1 className="text-xl font-bold">FinSight Dashboard</h1>
            <p>Welcome to your financial dashboard!</p>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;