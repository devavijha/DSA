import React from 'react';
import { Trophy, Calendar, Users, Clock, ArrowRight } from 'lucide-react';

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

export default function Contests() {
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
        {contests.map((contest, index) => {
          const startDate = new Date(contest.startDate);
          const isUpcoming = startDate > new Date();

          return (
            <div
              key={index}
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
                      ? 'bg-accent-blue text-white hover:bg-accent-blue/90'
                      : 'bg-card-hover text-secondary'
                  }`}
                  disabled={!isUpcoming}
                >
                  {isUpcoming ? (
                    <>
                      Register Now
                      <ArrowRight className="w-4 h-4" />
                    </>
                  ) : (
                    'Ended'
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

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
            <div className="text-3xl font-bold text-accent-blue mb-2">12</div>
            <div className="text-secondary">Contests Participated</div>
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
    </div>
  );
}