/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react';
import { Trophy, Calendar, Users, Clock, ArrowRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-hot-toast';
// Add to package.json: "react-hot-toast": "^2.4.1"
// Run: npm install react-hot-toast

const contests = [
  {
    title: 'Weekly Challenge #42',
    description: 'Solve 5 algorithmic problems in 2 hours',
    startDate: '2024-03-15T18:00:00Z',
    participants: 234,
    duration: '2 hours',
    difficulty: 'Intermediate'
  },
  {
    title: 'Dynamic Programming Contest',
    description: 'Special contest focused on DP problems',
    startDate: '2024-03-20T15:00:00Z',
    participants: 156,
    duration: '3 hours',
    difficulty: 'Advanced'
  },
  {
    title: 'Beginner Friendly #12',
    description: 'Perfect for newcomers to competitive programming',
    startDate: '2024-03-18T20:00:00Z',
    participants: 412,
    duration: '1.5 hours',
    difficulty: 'Easy'
  }
];

export interface Contest {
  id: string;
  title: string;
  description: string;
  startDate: string;
  participants: number;
  duration: string;
  difficulty: 'Easy' | 'Intermediate' | 'Advanced';
  registeredUsers?: string[];
}

export default function Contests() {
  const { user } = useAuth();
  const [registeredContests, setRegisteredContests] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (contestId: string) => {
    if (!user) {
      toast.error('Please login to register for contests');
      return;
    }

    setLoading(true);
    try {
      // Add registration logic here
      const response = await fetch('/api/contests/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contestId, userId: user.id }),
      });

      if (!response.ok) throw new Error('Failed to register');
      
      setRegisteredContests(prev => [...prev, contestId]);
      toast.success('Successfully registered for the contest!');
    } catch (_) {
      toast.error('Failed to register for the contest');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Coding Contests</h1>
          <p className="text-secondary mt-2">Compete with others and improve your skills</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-accent-purple text-white rounded-lg hover:bg-accent-purple/90 transition-colors">
          <Trophy className="w-4 h-4" />
          View Leaderboard
        </button>
      </div>

      <div className="grid gap-6">
        {contests.map((contest) => {
          const startDate = new Date(contest.startDate);
          const isUpcoming = startDate > new Date();
          const isRegistered = registeredContests.includes(contest.title); // Using title as unique identifier since id is not available

          return (
            <div
              key={contest.title}
              className="bg-card rounded-lg p-6 hover:bg-card-hover transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-foreground">{contest.title}</h3>
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          contest.difficulty === 'Easy'
                            ? 'bg-accent-green/10 text-accent-green'
                            : contest.difficulty === 'Intermediate'
                            ? 'bg-accent-yellow/10 text-accent-yellow'
                            : 'bg-accent-red/10 text-accent-red'
                        }`}
                      >
                        {contest.difficulty}
                      </span>
                    </div>
                    <p className="text-secondary">{contest.description}</p>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2 text-secondary">
                      <Calendar className="w-4 h-4" />
                      <span>{startDate.toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-secondary">
                      <Clock className="w-4 h-4" />
                      <span>{contest.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-secondary">
                      <Users className="w-4 h-4" />
                      <span>{contest.participants} participants</span>
                    </div>
                  </div>
                </div>
                <button
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    isUpcoming
                      ? isRegistered
                        ? 'bg-accent-green text-white hover:bg-accent-green/90'
                        : 'bg-accent-blue text-white hover:bg-accent-blue/90'
                      : 'bg-card-hover text-secondary'
                  }`}
                  disabled={!isUpcoming || loading}
                  onClick={() => handleRegister(contest.title)}
                >
                  {isUpcoming ? (
                    isRegistered ? (
                      <>
                        Registered
                        <Trophy className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        Register Now
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )
                  ) : (
                    'Ended'
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {user && (
        <div className="bg-card rounded-lg p-8">
          <div className="flex items-center gap-4 mb-6">
            <Trophy className="w-12 h-12 text-accent-yellow" />
            <div>
              <h2 className="text-2xl font-bold text-foreground">Your Contest Stats</h2>
              <p className="text-secondary">Track your competitive programming journey</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card-hover rounded-lg p-4">
              <div className="text-3xl font-bold text-accent-blue mb-2">
                {registeredContests.length}
              </div>
              <div className="text-secondary">Upcoming Contests</div>
            </div>
            <div className="bg-card-hover rounded-lg p-4">
              <div className="text-3xl font-bold text-accent-green mb-2">1,240</div>
              <div className="text-secondary">Global Ranking</div>
            </div>
            <div className="bg-card-hover rounded-lg p-4">
              <div className="text-3xl font-bold text-accent-purple mb-2">85%</div>
              <div className="text-secondary">Average Score</div>
            </div>
          </div>
        </div>
      )}

      {!user && (
        <div className="bg-card rounded-lg p-6 text-center">
          <p className="text-secondary mb-4">
            Sign in to register for contests and track your progress
          </p>
          <button
            onClick={() => window.location.href = '/login'}
            className="inline-flex items-center gap-2 px-4 py-2 bg-accent-blue text-white rounded-lg hover:bg-accent-blue/90 transition-colors"
          >
            Sign In
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}