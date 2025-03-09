import React from 'react';
import { BookOpen, Play, Star, Clock } from 'lucide-react';

const courses = [
  {
    title: 'Data Structures Fundamentals',
    description: 'Learn the essential data structures used in programming',
    duration: '4 hours',
    level: 'Beginner',
    modules: 12
  },
  {
    title: 'Algorithm Design',
    description: 'Master common algorithmic patterns and techniques',
    duration: '6 hours',
    level: 'Intermediate',
    modules: 15
  },
  {
    title: 'Dynamic Programming',
    description: 'Deep dive into dynamic programming concepts',
    duration: '8 hours',
    level: 'Advanced',
    modules: 20
  }
];

export default function Learn() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Learning Path</h1>
          <p className="text-secondary mt-2">Master algorithms and data structures step by step</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-accent-blue text-white rounded-lg hover:bg-accent-blue/90 transition-colors">
          <Play className="w-4 h-4" />
          Continue Learning
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course, index) => (
          <div key={index} className="bg-card rounded-lg p-6 hover:bg-card-hover transition-colors">
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

      <div className="bg-card rounded-lg p-8">
        <div className="flex items-center gap-4 mb-6">
          <Star className="w-12 h-12 text-accent-yellow" />
          <div>
            <h2 className="text-2xl font-bold text-foreground">Your Progress</h2>
            <p className="text-secondary">Keep going! You're doing great.</p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-secondary">Overall Progress</span>
              <span className="text-foreground">45%</span>
            </div>
            <div className="h-2 bg-card-hover rounded-full">
              <div className="h-full w-[45%] bg-accent-blue rounded-full" />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-secondary">Current Course</span>
              <span className="text-foreground">60%</span>
            </div>
            <div className="h-2 bg-card-hover rounded-full">
              <div className="h-full w-[60%] bg-accent-green rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}