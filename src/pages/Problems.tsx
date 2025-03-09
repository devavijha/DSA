import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { CircleDot, Search, Filter } from 'lucide-react';

interface Problem {
  id: string;
  title: string;
  difficulty: string;
  category: string;
}

export default function Problems() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState({
    difficulty: '',
    category: '',
  });

  useEffect(() => {
    fetchProblems();
  }, [filter, searchTerm]);

  async function fetchProblems() {
    try {
      let query = supabase
        .from('problems')
        .select('*')
        .order('difficulty', { ascending: true });

      if (filter.difficulty) {
        query = query.eq('difficulty', filter.difficulty);
      }
      if (filter.category) {
        query = query.eq('category', filter.category);
      }
      if (searchTerm) {
        query = query.ilike('title', `%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      setProblems(data || []);
    } catch (error) {
      console.error('Error fetching problems:', error);
    } finally {
      setLoading(false);
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'text-green-500';
      case 'medium':
        return 'text-yellow-500';
      case 'hard':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getDifficultyBadgeColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-green-500/10 text-green-500';
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-500';
      case 'hard':
        return 'bg-red-500/10 text-red-500';
      default:
        return 'bg-gray-500/10 text-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold">Coding Problems</h1>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search problems..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 pl-10 pr-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-4">
            <select
              value={filter.difficulty}
              onChange={(e) =>
                setFilter((prev) => ({ ...prev, difficulty: e.target.value }))
              }
              className="bg-gray-700 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
            <select
              value={filter.category}
              onChange={(e) =>
                setFilter((prev) => ({ ...prev, category: e.target.value }))
              }
              className="bg-gray-700 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              <option value="Arrays">Arrays</option>
              <option value="Strings">Strings</option>
              <option value="LinkedLists">Linked Lists</option>
              <option value="Trees">Trees</option>
              <option value="Graphs">Graphs</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading problems...</div>
      ) : (
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="min-w-full divide-y divide-gray-700">
            <div className="bg-gray-900 px-6 py-3">
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-6 text-sm font-semibold text-gray-300">Problem</div>
                <div className="col-span-3 text-sm font-semibold text-gray-300">Category</div>
                <div className="col-span-3 text-sm font-semibold text-gray-300">Difficulty</div>
              </div>
            </div>
            <div className="divide-y divide-gray-700">
              {problems.map((problem) => (
                <Link
                  key={problem.id}
                  to={`/problems/${problem.id}`}
                  className="block hover:bg-gray-700/50 transition-colors"
                >
                  <div className="px-6 py-4">
                    <div className="grid grid-cols-12 gap-4 items-center">
                      <div className="col-span-6">
                        <div className="flex items-center gap-3">
                          <CircleDot className="w-5 h-5 text-blue-500" />
                          <span className="font-medium">{problem.title}</span>
                        </div>
                      </div>
                      <div className="col-span-3">
                        <span className="text-gray-400">{problem.category}</span>
                      </div>
                      <div className="col-span-3">
                        <span className={`px-3 py-1 rounded-full text-sm ${getDifficultyBadgeColor(problem.difficulty)}`}>
                          {problem.difficulty}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}