import { useState } from "react";
import { BookOpen, Play, Clock, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const courses = [
  {
    title: "Data Structures Fundamentals",
    description: "Learn the essential data structures used in programming",
    duration: "4 hours",
    level: "Beginner",
    modules: 12,
    topics: ["Arrays", "Linked Lists", "Stacks", "Queues", "Hash Tables"],
  },
  {
    title: "Algorithm Design",
    description: "Master common algorithmic patterns and techniques",
    duration: "6 hours",
    level: "Intermediate",
    modules: 15,
    topics: ["Sorting", "Searching", "Recursion", "Divide & Conquer"],
  },
  {
    title: "Dynamic Programming",
    description: "Deep dive into dynamic programming concepts",
    duration: "8 hours",
    level: "Advanced",
    modules: 20,
    topics: ["Memoization", "Tabulation", "Graph DP", "Knapsack Problem"],
  },
];

export default function Learn() {
  const [currentCourse, setCurrentCourse] = useState<typeof courses[0] | null>(null);

  return (
    <div className="space-y-8 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Learning Path</h1>
          <p className="text-secondary mt-2">Master algorithms and data structures step by step</p>
        </div>
        {currentCourse ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => alert(`Resuming ${currentCourse.title}`)}
            className="flex items-center gap-2 px-4 py-2 bg-accent-blue text-white rounded-lg hover:bg-accent-blue/90 transition-colors"
          >
            <Play className="w-4 h-4" /> Continue Learning
          </motion.button>
        ) : null}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course, index) => (
          <motion.div
            key={index}
            className="bg-card rounded-lg p-6 hover:bg-card-hover transition-colors cursor-pointer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setCurrentCourse(course)}
          >
            <div className="flex items-start justify-between mb-4">
              <BookOpen className="w-8 h-8 text-accent-blue" />
              <span className="px-3 py-1 bg-accent-blue/10 text-accent-blue rounded-full text-sm">
                {course.level}
              </span>
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">{course.title}</h3>
            <p className="text-secondary mb-4">{course.description}</p>
            <div className="flex items-center gap-4 text-sm text-secondary">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{course.duration}</span>
              </div>
              <div className="flex items-center gap-1">
                <BookOpen className="w-4 h-4" />
                <span>{course.modules} modules</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {currentCourse && (
        <motion.div className="bg-card rounded-lg p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="text-2xl font-bold text-foreground">{currentCourse.title}</h2>
          <p className="text-secondary mb-4">{currentCourse.description}</p>
          <ul className="list-disc list-inside text-foreground">
            {currentCourse.topics.map((topic, i) => (
              <li key={i} className="flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-accent-blue" /> {topic}
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </div>
  );
}