import { Users, MessageSquare, ThumbsUp, Share2 } from 'lucide-react';

const discussions = [
  {
    title: 'Tips for Dynamic Programming',
    author: 'Abhishek Jha',
    content: "Here are some key patterns I've noticed while solving DP problems...",
    likes: 45,
    replies: 12,
    tags: ['dynamic-programming', 'algorithms', 'tips']
  },
  {
    title: 'Help with Graph Traversal Problem',
    author: 'Nirajan',
    content: 'I\'m stuck on implementing DFS for this specific problem...',
    likes: 23,
    replies: 8,
    tags: ['graphs', 'dfs', 'help-wanted']
  },
  {
    title: 'Weekly Contest Discussion',
    author: 'Rajan',
    content: 'Let\'s discuss the solutions from this week\'s contest...',
    likes: 67,
    replies: 34,
    tags: ['contest', 'solutions', 'discussion']
  }
];

export default function Community() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Community</h1>
          <p className="text-secondary mt-2">Connect with fellow developers and share knowledge</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-accent-blue text-white rounded-lg hover:bg-accent-blue/90 transition-colors">
          <MessageSquare className="w-4 h-4" />
          New Discussion
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {discussions.map((discussion, index) => (
            <div key={index} className="bg-card rounded-lg p-6 hover:bg-card-hover transition-colors">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-semibold text-foreground">{discussion.title}</h3>
                <button className="text-secondary hover:text-foreground">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
              <p className="text-secondary mb-4">{discussion.content}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {discussion.tags.map((tag, tagIndex) => (
                  <span
                    key={tagIndex}
                    className="px-2 py-1 bg-card-hover text-secondary rounded-md text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-secondary">
                  <Users className="w-4 h-4" />
                  <span>{discussion.author}</span>
                </div>
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-1 text-secondary hover:text-accent-blue">
                    <ThumbsUp className="w-4 h-4" />
                    <span>{discussion.likes}</span>
                  </button>
                  <button className="flex items-center gap-1 text-secondary hover:text-accent-purple">
                    <MessageSquare className="w-4 h-4" />
                    <span>{discussion.replies}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="bg-card rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Top Contributors</h3>
            <div className="space-y-4">
              {[
                { name: 'Abhishek Jha', points: 1250, rank: 1 },
                { name: 'Nirajan', points: 980, rank: 2 },
                { name: 'Rajan', points: 845, rank: 3 }
              ].map((user, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent-blue/10 flex items-center justify-center text-accent-blue">
                      #{user.rank}
                    </div>
                    <span className="text-foreground">{user.name}</span>
                  </div>
                  <span className="text-secondary">{user.points} pts</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Popular Tags</h3>
            <div className="flex flex-wrap gap-2">
              {[
                'algorithms',
                'dynamic-programming',
                'graphs',
                'arrays',
                'strings',
                'binary-trees',
                'contest',
                'tips'
              ].map((tag, index) => (
                <button
                  key={index}
                  className="px-3 py-1 bg-card-hover text-secondary rounded-full text-sm hover:bg-accent-blue/10 hover:text-accent-blue transition-colors"
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}