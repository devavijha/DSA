import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { CircleDot, Search } from 'lucide-react';

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
  const [filter, setFilter] = useState({ difficulty: '', category: '' });

  // ✅ Fetch problems with filters
  const fetchProblems = useCallback(async () => {
    try {
      setLoading(true);
      let query = supabase.from('problems').select('*');

      if (filter.difficulty) query = query.eq('difficulty', filter.difficulty);
      if (filter.category) query = query.eq('category', filter.category);
      if (searchTerm) query = query.ilike('title', `%${searchTerm}%`);

      const { data, error } = await query.order('difficulty', { ascending: true });

      if (error) throw error;

      console.log('Fetched Problems:', data);
      setProblems(data || []);
    } catch (error) {
      console.error('Error fetching problems:', error);
    } finally {
      setLoading(false);
    }
  }, [filter, searchTerm]);


  // ✅ Realtime listener to auto-update UI
  useEffect(() => {
    fetchProblems();

    const channel = supabase
      .channel('problems')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'problems' }, (payload) => {
        console.log('Database change detected:', payload);
        fetchProblems(); // Auto-update when data changes
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchProblems]);

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
              onChange={(e) => setFilter((prev) => ({ ...prev, difficulty: e.target.value }))}
              className="bg-gray-700 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
            <select
              value={filter.category}
              onChange={(e) => setFilter((prev) => ({ ...prev, category: e.target.value }))}
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
        <div className="bg-card rounded-lg overflow-hidden">
          <div className="min-w-full divide-y divide-border">
            <div className="bg-card-hover px-6 py-3">
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
                      <div className="col-span-6 flex items-center gap-3">
                        <CircleDot className="w-5 h-5 text-blue-500" />
                        <span className="font-medium">{problem.title}</span>
                      </div>
                      <div className="col-span-3 text-gray-400">{problem.category}</div>
                      <div className="col-span-3 text-sm px-3 py-1 rounded-full text-foreground bg-card-hover">
                        {problem.difficulty}
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
