import { X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Card } from './ui/card';

interface Player {
  id: number;
  name: string;
  country: string;
  ranking: number;
  price: number;
  tier: number;
}

interface PlayerDetailsProps {
  player: Player | null;
  skillName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Mock data for player stats and matches
const getPlayerStats = (playerId: number) => ({
  statScore: 245,
  skillScore: 180,
  totalPoints: 425,
  skillBreakdown: {
    'Aces': 45,
    'Winners': 38,
    'Break Points Saved': 32,
    'Return Games Won': 28,
    'Tiebreak Wins': 22,
    'Consecutive Games': 15
  }
});

const getPlayerMatches = (playerName: string) => ({
  previous: [
    {
      opponent: 'C. Alcaraz',
      result: 'W',
      score: '7-6⁵ 6-4',
      round: 'Round of 16',
      date: '2 days ago'
    },
    {
      opponent: 'A. Rublev',
      result: 'W',
      score: '6-3 7-5',
      round: 'Round of 32',
      date: '4 days ago'
    }
  ],
  live: {
    opponent: 'J. Sinner',
    score: '6-7⁵ 6-4 2-1',
    round: 'Quarterfinals',
    status: 'Live'
  },
  upcoming: [
    {
      opponent: 'N. Djokovic',
      round: 'Semifinals',
      date: 'Tomorrow 3:00 PM'
    }
  ]
});

export function PlayerDetails({ player, skillName, open, onOpenChange }: PlayerDetailsProps) {
  if (!player) return null;

  const stats = getPlayerStats(player.id);
  const matches = getPlayerMatches(player.name);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Player Details</DialogTitle>
          <DialogDescription>
            View player stats, skill breakdown, and tournament match history
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Player Photo and Basic Info */}
          <div className="flex items-start gap-4">
            <div className="w-24 h-24 rounded-[var(--radius)] overflow-hidden border border-border flex-shrink-0">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1519611103964-90f61a50d3e6?w=200&q=80"
                alt={player.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">{player.country}</span>
                <h3>{player.name}</h3>
              </div>
              <p className="text-card-foreground/60 mb-2">
                Rank #{player.ranking} • Tier {player.tier}
              </p>
              <Badge variant="outline" className="border-border">
                {skillName}
              </Badge>
            </div>
          </div>

          {/* Points Summary */}
          <Card className="p-4 bg-accent border-border">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-card-foreground/60 mb-1">Stat Score</p>
                <p className="text-secondary">{stats.statScore}</p>
              </div>
              <div>
                <p className="text-card-foreground/60 mb-1">Skill Score</p>
                <p className="text-secondary">{stats.skillScore}</p>
              </div>
              <div>
                <p className="text-card-foreground/60 mb-1">Total Points</p>
                <p className="text-secondary">{stats.totalPoints}</p>
              </div>
            </div>
          </Card>

          {/* Skill Breakdown */}
          <div>
            <h4 className="mb-3">Skill Points Breakdown</h4>
            <div className="space-y-2">
              {Object.entries(stats.skillBreakdown).map(([skill, points]) => (
                <div key={skill} className="flex items-center justify-between p-2 bg-accent rounded-[var(--radius)] border border-border">
                  <span className="text-card-foreground/80">{skill}</span>
                  <span className="text-secondary">{points} pts</span>
                </div>
              ))}
            </div>
          </div>

          {/* Matches */}
          <div>
            <h4 className="mb-3">Tournament Matches</h4>
            
            {/* Live Match */}
            {matches.live && (
              <div className="mb-3">
                <p className="text-card-foreground/60 mb-2">Live Match</p>
                <Card className="p-3 border-secondary bg-secondary/10">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-secondary">{matches.live.round}</p>
                    <Badge variant="destructive" className="text-[10px]">LIVE</Badge>
                  </div>
                  <p className="mb-1">vs {matches.live.opponent}</p>
                  <p className="text-secondary">{matches.live.score}</p>
                </Card>
              </div>
            )}

            {/* Previous Matches */}
            <div className="mb-3">
              <p className="text-card-foreground/60 mb-2">Previous Matches</p>
              <div className="space-y-2">
                {matches.previous.map((match, idx) => (
                  <Card key={idx} className="p-3 border-border">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-card-foreground/80">{match.round}</p>
                      <Badge 
                        variant={match.result === 'W' ? 'default' : 'destructive'}
                        className="text-[10px]"
                      >
                        {match.result}
                      </Badge>
                    </div>
                    <p className="mb-1">vs {match.opponent}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-card-foreground/60" dangerouslySetInnerHTML={{ __html: match.score }} />
                      <p className="text-card-foreground/60">{match.date}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Upcoming Matches */}
            {matches.upcoming.length > 0 && (
              <div>
                <p className="text-card-foreground/60 mb-2">Upcoming Matches</p>
                <div className="space-y-2">
                  {matches.upcoming.map((match, idx) => (
                    <Card key={idx} className="p-3 border-border">
                      <p className="text-card-foreground/80 mb-1">{match.round}</p>
                      <p className="mb-1">vs {match.opponent}</p>
                      <p className="text-card-foreground/60">{match.date}</p>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
