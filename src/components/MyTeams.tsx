import { ArrowLeft, Trophy, Users, Calendar, TrendingUp } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useState } from 'react';
import { PlayerDetails } from './PlayerDetails';

interface Player {
  id: number;
  name: string;
  country: string;
  ranking: number;
  price: number;
  tier: number;
}

export interface Team {
  id: string;
  tournamentName: string;
  tournamentDate: string;
  players: Player[];
  skillAssignments: Record<number, string>;
  createdAt: Date;
  status: 'current' | 'past';
  points?: number;
  rank?: number;
}

interface MyTeamsProps {
  teams: Team[];
  onBack: () => void;
  onCreateTeam: () => void;
}

const SKILL_NAMES: Record<string, string> = {
  'consecutive-games': 'Consecutive Games',
  'return-games': 'Return Games Won',
  'aces': 'Aces',
  'break-points': 'Break Points Saved',
  'tiebreaks': 'Tiebreak Wins',
  'winners': 'Winners'
};

export function MyTeams({ teams, onBack, onCreateTeam }: MyTeamsProps) {
  const [tournamentFilter, setTournamentFilter] = useState<'current' | 'past'>('current');
  const [selectedPlayer, setSelectedPlayer] = useState<{ player: Player; skillName: string } | null>(null);

  const filteredTeams = teams.filter(team => team.status === tournamentFilter);
  const currentTeams = teams.filter(team => team.status === 'current');
  const pastTeams = teams.filter(team => team.status === 'past');

  // Empty state - no teams created yet
  if (teams.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-primary border-b border-border">
          <div className="flex items-center gap-3 p-4">
            <button onClick={onBack} className="shrink-0">
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <h3 className="text-foreground">My Teams</h3>
          </div>
        </header>

        {/* Empty State */}
        <div className="flex-1 flex flex-col items-center justify-center p-4 pb-20">
          <div className="max-w-md mx-auto text-center space-y-4">
            <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto">
              <Users className="w-10 h-10 text-card-foreground/60" />
            </div>
            <div>
              <h2 className="mb-2">No Teams Yet</h2>
              <p className="text-card-foreground/80">
                Create your first team to start competing in tournaments and climb the leaderboard!
              </p>
            </div>
            <Button 
              className="w-full bg-secondary text-secondary-foreground border border-border"
              onClick={onCreateTeam}
            >
              Create Your First Team
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-primary border-b border-border">
        <div className="flex items-center gap-3 p-4">
          <button onClick={onBack} className="shrink-0">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div className="flex-1">
            <h3 className="text-foreground">My Teams</h3>
            <p className="text-foreground/80">{teams.length} team{teams.length !== 1 ? 's' : ''} created</p>
          </div>
        </div>
      </header>

      {/* Tournament Filter Tabs */}
      <div className="sticky top-[73px] z-40 bg-card border-b border-border">
        <Tabs value={tournamentFilter} onValueChange={(value) => setTournamentFilter(value as 'current' | 'past')}>
          <TabsList className="w-full grid grid-cols-2 bg-transparent border-0 rounded-none h-auto p-0">
            <TabsTrigger 
              value="current" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-secondary data-[state=active]:bg-transparent data-[state=active]:shadow-none py-3"
            >
              Current ({currentTeams.length})
            </TabsTrigger>
            <TabsTrigger 
              value="past" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-secondary data-[state=active]:bg-transparent data-[state=active]:shadow-none py-3"
            >
              Past ({pastTeams.length})
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Teams List */}
      <div className="p-4 space-y-4">
        {filteredTeams.length === 0 ? (
          <Card className="bg-accent border-border rounded-[var(--radius)] p-6 text-center">
            <Calendar className="w-12 h-12 text-card-foreground/60 mx-auto mb-3" />
            <h4 className="mb-2">No {tournamentFilter} tournaments</h4>
            <p className="text-card-foreground/80 mb-4">
              {tournamentFilter === 'current' 
                ? 'Create a team for an upcoming tournament to get started.'
                : 'Your past tournament teams will appear here.'}
            </p>
            {tournamentFilter === 'current' && (
              <Button 
                variant="outline" 
                className="border-border"
                onClick={onCreateTeam}
              >
                Create Team
              </Button>
            )}
          </Card>
        ) : (
          filteredTeams.map((team) => (
            <Card key={team.id} className="bg-card border-border rounded-[var(--radius)] overflow-hidden">
              {/* Team Header */}
              <div className="bg-primary p-4 border-b border-border">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="text-foreground mb-1">{team.tournamentName}</h3>
                    <p className="text-foreground/80">{team.tournamentDate}</p>
                  </div>
                  <Badge className={`${
                    team.status === 'current' 
                      ? 'bg-secondary text-secondary-foreground' 
                      : 'bg-accent text-accent-foreground'
                  } border-0`}>
                    {team.status === 'current' ? 'Active' : 'Completed'}
                  </Badge>
                </div>
                
                {team.points !== undefined && (
                  <div className="flex items-center gap-4 pt-2 border-t border-border/30">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-foreground/80" />
                      <span className="text-foreground">{team.points} pts</span>
                    </div>
                    {team.rank && (
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-foreground/80" />
                        <span className="text-foreground">Rank #{team.rank}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Players List */}
              <div className="p-4 space-y-3">
                <h4>Team Roster</h4>
                {team.players.map((player) => {
                  const skillId = team.skillAssignments[player.id];
                  const skillName = skillId ? SKILL_NAMES[skillId] : 'No skill';
                  
                  return (
                    <button 
                      key={player.id} 
                      className="flex items-center justify-between p-3 bg-accent rounded-[var(--radius)] border border-border hover:bg-accent/80 transition-colors text-left w-full min-h-[44px]"
                      onClick={() => setSelectedPlayer({ player, skillName })}
                      aria-label={`View details for ${player.name}, ${player.country}, Tier ${player.tier}, Rank ${player.ranking}, ${425} points, ${skillName} skill`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span aria-hidden="true">{player.country}</span>
                          <p>{player.name}</p>
                        </div>
                        <p className="text-card-foreground/60">
                          Tier {player.tier} • Rank #{player.ranking}
                        </p>
                      </div>
                      <div className="text-right space-y-2">
                        <p className="text-secondary">{245 + 180} pts</p>
                        <Badge variant="outline" className="border-border">
                          {skillName}
                        </Badge>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Team Actions */}
              <div className="p-4 pt-0 flex gap-2">
                <Button variant="outline" className="flex-1 border-border">
                  View Details
                </Button>
                {team.status === 'current' && (
                  <Button variant="outline" className="flex-1 border-border">
                    Edit Team
                  </Button>
                )}
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Create Team FAB */}
      {filteredTeams.length > 0 && (
        <div className="fixed bottom-20 right-4">
          <Button 
            className="rounded-full w-14 h-14 bg-secondary text-secondary-foreground border border-border shadow-lg"
            onClick={onCreateTeam}
          >
            <Users className="w-6 h-6" />
          </Button>
        </div>
      )}

      <PlayerDetails
        player={selectedPlayer?.player || null}
        skillName={selectedPlayer?.skillName || ''}
        open={!!selectedPlayer}
        onOpenChange={(open) => !open && setSelectedPlayer(null)}
      />
    </div>
  );
}
