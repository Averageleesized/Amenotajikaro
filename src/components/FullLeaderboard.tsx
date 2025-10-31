import { ArrowLeft, Trophy } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

export interface LeaderboardUser {
  userId: string;
  name: string;
  email: string;
  avatar: string;
  totalPoints: number;
  tournamentsPlayed: number;
  rank: number;
}

interface FullLeaderboardProps {
  onBack: () => void;
  onUserClick: (userId: string) => void;
  leaderboardData: LeaderboardUser[];
}

export function FullLeaderboard({ onBack, onUserClick, leaderboardData }: FullLeaderboardProps) {
  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-lg border-b border-border/50 shadow-sm">
        <div className="flex items-center gap-3 p-4 max-w-2xl mx-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-foreground hover:bg-primary-foreground/10 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-foreground">Season Leaderboard</h1>
        </div>
      </header>

      <main className="p-4 max-w-2xl mx-auto space-y-4">
        {/* Season Info */}
        <Card className="p-4 bg-card border-border shadow-[var(--elevation-md)]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-foreground">2024/2025 Season</h2>
              <p className="text-sm text-muted-foreground">Total participants: {leaderboardData.length}</p>
            </div>
            <Trophy className="w-8 h-8 text-secondary" />
          </div>
        </Card>

        {/* Leaderboard Table */}
        <Card className="p-0 bg-card border-border shadow-[var(--elevation-md)] overflow-hidden">
          <div className="p-4 border-b border-border bg-accent/5">
            <h3 className="text-foreground">Full Rankings</h3>
          </div>
          
          {/* Table Header */}
          <div
            role="row"
            className="px-4 py-3 flex items-center gap-4 border-b border-border bg-accent/10 text-xs text-muted-foreground uppercase tracking-wide"
          >
            <div className="w-10" role="columnheader">Rank</div>
            <div className="flex-1" role="columnheader">Player</div>
            <div className="w-20 text-center" role="columnheader">Tournaments</div>
            <div className="w-20 text-right" role="columnheader">Points</div>
          </div>

          {/* Table Body */}
          <div role="rowgroup">
            {leaderboardData.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <Trophy className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No players yet this season</p>
                <p className="text-sm mt-1">Be the first to join a tournament!</p>
              </div>
            ) : (
              leaderboardData.map((user) => (
                <button
                  key={user.userId}
                  role="row"
                  onClick={() => onUserClick(user.userId)}
                  className={`w-full p-4 flex items-center gap-4 transition-colors hover:bg-accent/20 text-left border-b border-border/50 last:border-0 ${ 
                    user.rank <= 3 ? 'bg-secondary/5' : ''
                  }`}
                >
                  {/* Rank */}
                  <div className="w-10 flex items-center" role="cell">
                    <div className={`flex items-center justify-center w-7 h-7 rounded-full ${
                      user.rank === 1 ? 'bg-chart-5 text-white' :
                      user.rank === 2 ? 'bg-secondary/30 text-secondary-foreground' :
                      user.rank === 3 ? 'bg-chart-1/30 text-primary-foreground' :
                      ''
                    }`}>
                      {user.rank}
                    </div>
                  </div>

                  {/* Player Info */}
                  <div className="flex-1 flex items-center gap-3 min-w-0" role="cell">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-[12px]">{user.avatar}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`truncate ${user.rank <= 3 ? 'font-[var(--font-weight-bold)]' : ''}`}>
                        {user.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                  </div>

                  {/* Tournaments */}
                  <div className="w-20 text-center" role="cell">
                    <Badge variant="outline" className="text-xs">
                      {user.tournamentsPlayed}
                    </Badge>
                  </div>

                  {/* Points */}
                  <div className="w-20 text-right" role="cell">
                    <p className={`${user.rank <= 3 ? 'font-[var(--font-weight-bold)] text-primary' : ''}`}>
                      {user.totalPoints.toLocaleString()}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </Card>
      </main>
    </div>
  );
}
