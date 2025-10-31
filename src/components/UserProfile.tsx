import { ArrowLeft, Trophy, Calendar, Award } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

export interface TournamentPerformance {
  tournamentId: string;
  tournamentName: string;
  tournamentDate: string;
  points: number;
  rank: number;
  totalParticipants: number;
  team: {
    name: string;
    players: Array<{
      name: string;
      country: string;
      tier: number;
      price: number;
    }>;
  };
}

export interface UserProfileData {
  userId: string;
  name: string;
  email: string;
  avatar: string;
  totalPoints: number;
  tournamentsPlayed: number;
  seasonRank: number;
  tournaments: TournamentPerformance[];
}

interface UserProfileProps {
  onBack: () => void;
  profileData: UserProfileData;
}

export function UserProfile({ onBack, profileData }: UserProfileProps) {
  const avgPoints = profileData.tournamentsPlayed > 0 
    ? Math.round(profileData.totalPoints / profileData.tournamentsPlayed)
    : 0;

  const bestFinish = profileData.tournaments.length > 0
    ? Math.min(...profileData.tournaments.map(t => t.rank))
    : null;

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
          <h1 className="text-foreground">Player Profile</h1>
        </div>
      </header>

      <main className="p-4 max-w-2xl mx-auto space-y-4">
        {/* Profile Header */}
        <Card className="p-6 bg-card border-border shadow-[var(--elevation-md)]">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">{profileData.avatar}</span>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-foreground mb-1">{profileData.name}</h2>
              <p className="text-sm text-muted-foreground mb-3">{profileData.email}</p>
              <div className="flex items-center gap-2">
                <Badge className="bg-primary text-primary-foreground border-0">
                  Season Rank: #{profileData.seasonRank}
                </Badge>
              </div>
            </div>
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-4 bg-card border-border shadow-[var(--elevation-sm)] text-center">
            <Trophy className="w-5 h-5 mx-auto mb-2 text-secondary" />
            <p className="text-xs text-muted-foreground mb-1">Total Points</p>
            <p className="font-[var(--font-weight-bold)] text-foreground">
              {profileData.totalPoints.toLocaleString()}
            </p>
          </Card>

          <Card className="p-4 bg-card border-border shadow-[var(--elevation-sm)] text-center">
            <Calendar className="w-5 h-5 mx-auto mb-2 text-primary" />
            <p className="text-xs text-muted-foreground mb-1">Tournaments</p>
            <p className="font-[var(--font-weight-bold)] text-foreground">
              {profileData.tournamentsPlayed}
            </p>
          </Card>

          <Card className="p-4 bg-card border-border shadow-[var(--elevation-sm)] text-center">
            <Award className="w-5 h-5 mx-auto mb-2 text-chart-1" />
            <p className="text-xs text-muted-foreground mb-1">Best Finish</p>
            <p className="font-[var(--font-weight-bold)] text-foreground">
              {bestFinish ? `#${bestFinish}` : '-'}
            </p>
          </Card>
        </div>

        {/* Tournament History */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-foreground">Tournament History</h3>
            <p className="text-xs text-muted-foreground">
              Avg: {avgPoints} pts
            </p>
          </div>

          {profileData.tournaments.length === 0 ? (
            <Card className="p-8 bg-card border-border shadow-[var(--elevation-md)] text-center">
              <Trophy className="w-12 h-12 mx-auto mb-3 opacity-30 text-muted-foreground" />
              <p className="text-muted-foreground">No tournament history yet</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {profileData.tournaments.map((tournament, index) => (
                <Card
                  key={tournament.tournamentId}
                  className="p-4 bg-card border-border shadow-[var(--elevation-md)] hover:shadow-[var(--elevation-hover)] transition-shadow"
                >
                  {/* Tournament Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-foreground mb-1">{tournament.tournamentName}</h4>
                      <p className="text-xs text-muted-foreground">{tournament.tournamentDate}</p>
                    </div>
                    <Badge 
                      className={`ml-2 ${
                        tournament.rank <= 3 
                          ? 'bg-chart-5 text-white border-0' 
                          : 'bg-secondary/20 text-secondary-foreground border-border'
                      }`}
                    >
                      #{tournament.rank}
                    </Badge>
                  </div>

                  {/* Performance Stats */}
                  <div className="flex items-center gap-4 mb-3 pb-3 border-b border-border/50">
                    <div>
                      <p className="text-xs text-muted-foreground">Points Earned</p>
                      <p className="font-[var(--font-weight-bold)] text-primary">
                        {tournament.points.toLocaleString()}
                      </p>
                    </div>
                    <div className="h-8 w-px bg-border" />
                    <div>
                      <p className="text-xs text-muted-foreground">Placement</p>
                      <p className="font-[var(--font-weight-bold)] text-foreground">
                        {tournament.rank} of {tournament.totalParticipants}
                      </p>
                    </div>
                  </div>

                  {/* Team Details */}
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Team: {tournament.team.name}</p>
                    <div className="space-y-1.5">
                      {tournament.team.players.map((player, playerIndex) => (
                        <div 
                          key={playerIndex}
                          className="flex items-center justify-between text-xs bg-accent/5 rounded-[var(--radius-sm)] px-2 py-1.5"
                        >
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <span className="text-[10px] opacity-60">T{player.tier}</span>
                            <span className="truncate">{player.name}</span>
                            <span className="text-[10px] opacity-60">{player.country}</span>
                          </div>
                          <span className="text-secondary font-[var(--font-weight-bold)] ml-2">
                            ${player.price}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
