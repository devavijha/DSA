import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { Trophy, Star, Clock } from 'lucide-react';

interface Profile {
  username: string;
  full_name: string;
  points: number;
  avatar_url: string;
}

interface Submission {
  id: string;
  problem: {
    title: string;
    difficulty: string;
  };
  status: string;
  created_at: string;
}

export default function Profile() {
  const { user: authUser } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    if (!authUser) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  }, [authUser]);

  const fetchSubmissions = useCallback(async () => {
    if (!authUser) return;
    
    try {
      const { data, error } = await supabase
        .from('submissions')
        .select('*, problem:problems(title, difficulty)')
        .eq('user_id', authUser.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubmissions(data || []);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  }, [authUser]);

  useEffect(() => {
    if (authUser) {
      fetchProfile();
      fetchSubmissions();
    }
  }, [authUser, fetchProfile, fetchSubmissions]);

  if (loading) {
    return <div className="text-center py-8">Loading profile...</div>;
  }

  if (!profile) {
    return <div className="text-center py-8">Profile not found</div>;
  }

  return (
    <div className="space-y-8">
      <div className="bg-gray-800 p-6 rounded-lg">
        <div className="flex items-center gap-6">
          <img
            src={
              profile.avatar_url ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                profile.username
              )}&background=random`
            }
            alt={profile.username}
            className="w-24 h-24 rounded-full"
          />
          <div>
            <h1 className="text-2xl font-bold">{profile.full_name}</h1>
            <p className="text-gray-400">@{profile.username}</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-gray-800 p-6 rounded-lg flex items-center gap-4">
          <Trophy className="w-12 h-12 text-yellow-500" />
          <div>
            <h3 className="text-xl font-semibold">{profile.points}</h3>
            <p className="text-gray-400">Total Points</p>
          </div>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg flex items-center gap-4">
          <Star className="w-12 h-12 text-blue-500" />
          <div>
            <h3 className="text-xl font-semibold">
              {submissions.filter((s) => s.status === 'success').length}
            </h3>
            <p className="text-gray-400">Problems Solved</p>
          </div>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg flex items-center gap-4">
          <Clock className="w-12 h-12 text-green-500" />
          <div>
            <h3 className="text-xl font-semibold">{submissions.length}</h3>
            <p className="text-gray-400">Total Submissions</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Recent Submissions</h2>
        <div className="space-y-4">
          {submissions.map((submission) => (
            <div
              key={submission.id}
              className="flex items-center justify-between py-3 border-b border-gray-700 last:border-0"
            >
              <div>
                <h4 className="font-medium">{submission.problem.title}</h4>
                <p className="text-sm text-gray-400">
                  {new Date(submission.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={
                    submission.problem.difficulty.toLowerCase() === 'easy'
                      ? 'text-green-500'
                      : submission.problem.difficulty.toLowerCase() === 'medium'
                      ? 'text-yellow-500'
                      : 'text-red-500'
                  }
                >
                  {submission.problem.difficulty}
                </span>
                <span
                  className={
                    submission.status === 'success'
                      ? 'text-green-500'
                      : 'text-red-500'
                  }
                >
                  {submission.status === 'success' ? 'Accepted' : 'Failed'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}