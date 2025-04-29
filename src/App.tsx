// --- START OF FILE DSA-main/src/App.tsx ---
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Problems from './pages/Problems';
import ProblemDetail from './pages/ProblemDetail';
import Learn from './pages/Learn';
import Contests from './pages/Contests';
import Community from './pages/Community';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
// Import new pages
// TODO: Create and import Visualize component once implemented
// import Visualize from './pages/Visualize';
const Visualize = () => <div>Visualization Coming Soon</div>;
// TODO: Create and import SystemDesign component once implemented
// import SystemDesign from './pages/SystemDesign';
const SystemDesign = () => <div>System Design Coming Soon</div>;
// TODO: Create and import AIStudio component once implemented
// import AIStudio from './pages/AIStudio';
const AIStudio = () => <div>AI Studio Coming Soon</div>;

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/problems" element={<Problems />} />
            <Route path="/problems/:id" element={<ProblemDetail />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/contests" element={<Contests />} />
            <Route path="/community" element={<Community />} />
            {/* Add routes for new pages */}
            <Route path="/visualize" element={<Visualize />} />
            <Route path="/system-design" element={<SystemDesign />} />
            <Route path="/ai-studio" element={<AIStudio />} />
            {/* Auth routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
// --- END OF FILE DSA-main/src/App.tsx ---