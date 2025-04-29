import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Brain, Code, Users, Zap, Target, BookOpen, 
  Moon, Sun, Bot, Network, 
  GitCompare, Lightbulb, Telescope 
} from "lucide-react";
import { 
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer 
} from 'recharts';
import AIAgents from '../components/AIAgents';
import CodeVisualizer from '../components/CodeVisualizer';

export default function Home() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  const algorithmPerformanceData = [
    { name: 'Binary Search', complexity: 'O(log n)', speedup: 85 },
    { name: 'Quick Sort', complexity: 'O(n log n)', speedup: 72 },
    { name: 'A* Search', complexity: 'O(b^d)', speedup: 90 },
    { name: 'Neural Network', complexity: 'O(n^2)', speedup: 65 }
  ];

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode.toString());
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <div className={`${darkMode ? "dark bg-gray-900 text-white" : "bg-gray-100 text-gray-900"} min-h-screen space-y-24`}>

      {/* Dark Mode Toggle Button */}
      <div className="fixed top-4 right-6 z-50 flex items-center gap-4">
        <button
          className="p-2 rounded-full bg-gray-800 text-yellow-400 dark:bg-gray-200 dark:text-gray-900 shadow-lg"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
        </button>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-3xl" />
        <div className="relative text-center space-y-6 max-w-4xl mx-auto px-4">
          <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
            Level Up Your Coding Journey
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Join the next generation of developers mastering algorithms, solving real-world problems,
            and preparing for technical interviews with our advanced learning platform.
          </p>
          <div className="flex justify-center gap-6 pt-8">
            <Link to="/register" className="group relative px-8 py-4 bg-blue-600 rounded-xl hover:bg-blue-700 transition">
              <span className="flex items-center gap-2 text-lg font-semibold">
                <Zap className="w-5 h-5" />
                Start Coding Now
              </span>
            </Link>
            <Link to="/problems" className="group px-8 py-4 bg-gray-800 rounded-xl border border-gray-700 hover:bg-gray-700 transition">
              <span className="flex items-center gap-2 text-lg font-semibold">
                <Code className="w-5 h-5" />
                Browse Problems
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 px-12">
        {[
          { icon: <Code className="w-12 h-12 text-blue-500" />, title: "300+ Curated Problems", description: "From easy to advanced, covering all key algorithms and data structures." },
          { icon: <Target className="w-12 h-12 text-purple-500" />, title: "Smart Learning Path", description: "Personalized problem recommendations based on your skill level." },
          { icon: <Brain className="w-12 h-12 text-yellow-500" />, title: "Advanced Code Editor", description: "Feature-rich IDE with multi-language support and real-time compilation." },
          { icon: <BookOpen className="w-12 h-12 text-green-500" />, title: "In-depth Solutions", description: "Detailed explanations and multiple approaches for each problem." }
        ].map((feature, index) => (
          <div key={index} className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:shadow-xl transition">
            {feature.icon}
            <h3 className="text-xl font-semibold mt-4 mb-2">{feature.title}</h3>
            <p className="text-gray-400">{feature.description}</p>
          </div>
        ))}
      </section>

      {/* AI Agents Section */}
      <section className="p-12 bg-gradient-to-br from-blue-600/10 to-purple-600/10 rounded-3xl">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold flex justify-center items-center gap-4">
            <Bot className="w-12 h-12 text-blue-500" />
            Meet Your AI Learning Companions
          </h2>
          <p className="text-gray-400 mt-4">Specialized AI agents to guide you through coding challenges, project ideas, and optimizations.</p>
        </div>
        <AIAgents />
      </section>

      {/* CodeVisualizer Section */}
      <section className="p-12 bg-gradient-to-br from-blue-600/10 to-purple-600/10 rounded-3xl">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold flex justify-center items-center gap-4">
            <Bot className="w-12 h-12 text-blue-500" />
            CodeVisualizer
          </h2>
          <p className="text-gray-400 mt-4">Specialized CodeVisualizer to guide you through coding challenges, project ideas, and optimizations.</p>
        </div>
        <CodeVisualizer />
      </section>

      {/* AI Performance Learning Section */}
      <section className="grid md:grid-cols-2 gap-12 px-12">
        <div className="space-y-6">
          <h2 className="text-4xl font-bold flex gap-4 items-center">
            <Bot className="w-12 h-12 text-blue-500" />
            AI-Powered Learning Companion
          </h2>
          <p className="text-lg text-gray-300">
            Revolutionize your coding journey with intelligent assistants providing code suggestions, optimization, and problem-solving help.
          </p>
          <ul className="space-y-4">
            {[
              "Intelligent code suggestions and auto-completion",
              "Personalized learning path recommendation",
              "AI-powered code optimization analysis",
              "Automated bug detection and fixes"
            ].map((text, idx) => (
              <li key={idx} className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                {text}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={algorithmPerformanceData}>
              <XAxis dataKey="name" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "none" }} />
              <Line type="monotone" dataKey="speedup" stroke="#3b82f6" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-center text-gray-400 mt-4">
            AI Performance Insights
          </p>
        </div>
      </section>

      {/* Algorithm Visualization Section */}
      <section className="p-12 bg-gray-800 rounded-3xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold flex justify-center gap-4">
            <Network className="w-12 h-12 text-green-500" />
            Algorithm Visualizations
          </h2>
          <p className="text-gray-300 mt-4 max-w-2xl mx-auto">
            Learn complex algorithms through interactive, real-time visualizations breaking down computation.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: <Telescope className="w-12 h-12 text-purple-500" />, title: "Path Finding Algorithms", description: "Visualize A*, Dijkstra, and BFS algorithms." },
            { icon: <GitCompare className="w-12 h-12 text-yellow-500" />, title: "Sorting Algorithms", description: "Real-time visualization of Quick, Merge, and Bubble Sort." },
            { icon: <Lightbulb className="w-12 h-12 text-blue-500" />, title: "Machine Learning Models", description: "Interactive Neural Network and Decision Tree visualizations." }
          ].map((item, idx) => (
            <div key={idx} className="bg-gray-700 p-6 rounded-xl hover:scale-105 transition-transform">
              {item.icon}
              <h3 className="text-xl font-semibold mt-4 mb-2">{item.title}</h3>
              <p className="text-gray-400">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Code Execution Section */}
      <section className="relative p-12">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-3xl" />
        <div className="relative grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold">Real-time Code Execution</h2>
            <p className="text-gray-300 text-lg">
              Write, compile, and run code across languages. Instant feedback and performance metrics.
            </p>
            <ul className="space-y-4">
              {[
                "Python, JavaScript, C++ and more",
                "Real-time syntax and error detection",
                "Custom test cases and performance metrics",
                "Code sharing and collaboration"
              ].map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <pre className="text-sm text-gray-300 overflow-x-auto">
              <code>{`def two_sum(nums, target):
  seen = {}
  for i, num in enumerate(nums):
    complement = target - num
    if complement in seen:
      return [seen[complement], i]
    seen[num] = i
  return []

nums = [2, 7, 11, 15]
target = 9
print(two_sum(nums, target))  # Output: [0, 1]`}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="bg-gray-800 p-12 rounded-3xl">
        <div className="text-center max-w-3xl mx-auto">
          <Users className="w-16 h-16 text-blue-500 mb-6 mx-auto" />
          <h2 className="text-4xl font-bold mb-4">Join Our Growing Community</h2>
          <p className="text-gray-300 text-lg mb-8">
            Connect with fellow coders, participate in contests, and level up your journey together.
          </p>
          <div className="flex justify-center gap-8">
            {[
              { stat: "10K+", label: "Active Users", color: "text-blue-500" },
              { stat: "50K+", label: "Solutions Shared", color: "text-purple-500" },
              { stat: "95%", label: "Success Rate", color: "text-green-500" }
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className={`text-4xl font-bold ${item.color}`}>{item.stat}</div>
                <div className="text-gray-400">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
