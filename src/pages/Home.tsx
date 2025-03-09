import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Code, Trophy, Users, Zap, Target, BookOpen } from 'lucide-react';

export default function Home() {
  return (
    <div className="space-y-16">
      <section className="relative min-h-[600px] flex items-center justify-center">
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
            <Link
              to="/register"
              className="group relative px-8 py-4 bg-blue-600 rounded-xl overflow-hidden hover:bg-blue-700 transition-colors"
            >
              <span className="flex items-center gap-2 text-lg font-semibold">
                <Zap className="w-5 h-5" />
                Start Coding Now
              </span>
            </Link>
            <Link
              to="/problems"
              className="group px-8 py-4 bg-gray-800 rounded-xl border border-gray-700 hover:bg-gray-700 transition-colors"
            >
              <span className="flex items-center gap-2 text-lg font-semibold">
                <Code className="w-5 h-5" />
                Browse Problems
              </span>
            </Link>
          </div>
        </div>
      </section>

      <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          {
            icon: <Code className="w-12 h-12 text-blue-500" />,
            title: "300+ Curated Problems",
            description: "From easy to advanced, covering all key algorithms and data structures"
          },
          {
            icon: <Target className="w-12 h-12 text-purple-500" />,
            title: "Smart Learning Path",
            description: "Personalized problem recommendations based on your skill level"
          },
          {
            icon: <Brain className="w-12 h-12 text-yellow-500" />,
            title: "Advanced Code Editor",
            description: "Feature-rich IDE with multi-language support and real-time compilation"
          },
          {
            icon: <BookOpen className="w-12 h-12 text-green-500" />,
            title: "In-depth Solutions",
            description: "Detailed explanations and multiple approaches for each problem"
          }
        ].map((feature, index) => (
          <div
            key={index}
            className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700"
          >
            {feature.icon}
            <h3 className="text-xl font-semibold mt-4 mb-2">{feature.title}</h3>
            <p className="text-gray-400">{feature.description}</p>
          </div>
        ))}
      </section>

      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-3xl" />
        <div className="relative grid md:grid-cols-2 gap-12 items-center p-12">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold">Real-time Code Execution</h2>
            <p className="text-gray-300 text-lg">
              Write, compile, and run your code in multiple programming languages. Get instant feedback
              and improve your coding skills with our advanced compiler integration.
            </p>
            <ul className="space-y-4">
              {[
                "Multiple language support including Python and JavaScript",
                "Real-time syntax highlighting and error detection",
                "Custom test cases and performance metrics",
                "Code sharing and collaboration features"
              ].map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <span className="text-sm text-gray-400">Python</span>
            </div>
            <pre className="text-sm text-gray-300">
              <code>{`def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []

# Example usage
nums = [2, 7, 11, 15]
target = 9
result = two_sum(nums, target)
print(f"Indices: {result}")  # Output: [0, 1]`}</code>
            </pre>
          </div>
        </div>
      </section>

      <section className="bg-gray-800/50 backdrop-blur-sm p-12 rounded-3xl border border-gray-700">
        <div className="max-w-3xl mx-auto text-center">
          <div>
            <Users className="w-16 h-16 text-blue-500 mx-auto mb-6" />
            <h2 className="text-4xl font-bold mb-4">Join Our Growing Community</h2>
            <p className="text-gray-300 text-lg mb-8">
              Connect with fellow developers, participate in coding contests, and learn from the best.
              Our community is here to help you succeed in your coding journey.
            </p>
            <div className="flex justify-center gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-500">10K+</div>
                <div className="text-gray-400">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-500">50K+</div>
                <div className="text-gray-400">Solutions Shared</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-500">95%</div>
                <div className="text-gray-400">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}