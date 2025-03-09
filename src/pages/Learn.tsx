import { BookOpen, Play, Clock, CheckCircle, Code, List } from 'lucide-react';
import { useState } from 'react';

const courses = [
  {
    title: 'Data Structures Fundamentals',
    description: 'Learn the essential data structures used in programming',
    duration: '6 hours',
    level: 'Beginner',
    modules: 15,
    topics: ['Arrays', 'Linked Lists', 'Stacks & Queues', 'Hash Tables', 'Trees', 'Graphs'],
  },
  {
    title: 'Algorithm Design',
    description: 'Master common algorithmic patterns and techniques',
    duration: '8 hours',
    level: 'Intermediate',
    modules: 18,
    topics: ['Sorting & Searching', 'Recursion', 'Backtracking', 'Divide & Conquer', 'Greedy Algorithms'],
  },
  {
    title: 'Dynamic Programming',
    description: 'Deep dive into dynamic programming concepts',
    duration: '10 hours',
    level: 'Advanced',
    modules: 22,
    topics: ['Memoization', 'Tabulation', 'Fibonacci Variations', 'Knapsack Problem', 'Longest Common Subsequence'],
  }
];

export default function Learn() {
  interface Course {
    title: string;
    description: string;
    duration: string;
    level: string;
    modules: number;
    topics: string[];
  }
  
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  return (
    <div className="space-y-8 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Learning Path</h1>
          <p className="text-secondary mt-2">Master data structures and algorithms step by step</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-accent-blue text-white rounded-lg hover:bg-accent-blue/90 transition-colors">
          <Play className="w-4 h-4" />
          Continue Learning
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course, index) => (
          <div 
            key={index} 
            className="bg-card rounded-lg p-6 hover:bg-card-hover transition-colors cursor-pointer"
            onClick={() => setSelectedCourse(course)}
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
          </div>
        ))}
      </div>

      {selectedCourse && (
        <div className="bg-card rounded-lg p-8 mt-6">
          <h2 className="text-2xl font-bold text-foreground">{selectedCourse.title} - Topics</h2>
          <ul className="mt-4 space-y-2">
            {selectedCourse.topics.map((topic, index) => (
              <li key={index} className="flex items-center gap-2 text-secondary">
                <CheckCircle className="w-5 h-5 text-accent-green" /> {topic}
              </li>
            ))}
          </ul>
          <div className="mt-6 flex gap-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-accent-green text-white rounded-lg hover:bg-accent-green/90 transition-colors">
              <Code className="w-4 h-4" />
              Start Coding Exercises
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-accent-yellow text-white rounded-lg hover:bg-accent-yellow/90 transition-colors">
              <List className="w-4 h-4" />
              Take a Quiz
            </button>
          </div>
        </div>
      )}
    </div>
  );
}