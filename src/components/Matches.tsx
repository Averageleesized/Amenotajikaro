import { ArrowLeft, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useState } from 'react';

interface MatchResult {
  id: string;
  player1: string;
  player2: string;
  player1Score?: string; // e.g., "6 7 6" or "6 7⁶ 6"
  player2Score?: string;
  status: 'completed' | 'upcoming' | 'live';
  hasPrediction?: boolean;
  matchDate?: string; // e.g., "Nov 1"
  matchTime?: string; // e.g., "3:00 PM"
}

interface Round {
  name: string;
  matches: MatchResult[];
}

interface Tournament {
  id: string;
  name: string;
  status: 'active' | 'upcoming' | 'completed';
  rounds: Round[];
}

interface MatchesProps {
  onBack: () => void;
  predictions: { matchId: string }[];
}

// Mock tournament data
const tournaments: Tournament[] = [
  {
    id: 'atp-finals-2025',
    name: 'ATP Finals',
    status: 'active',
    rounds: [
      {
        name: 'Round 16',
        matches: [
          {
            id: 'match-r16-1',
            player1: 'N. Djokovic',
            player2: 'S. Tsitsipas',
            player1Score: '6 7⁶ 6',
            player2Score: '4 6³ 3',
            status: 'completed'
          },
          {
            id: 'match-r16-2',
            player1: 'C. Alcaraz',
            player2: 'T. Fritz',
            player1Score: '7⁵ 6 6',
            player2Score: '6⁷ 3 4',
            status: 'completed'
          },
          {
            id: 'match-r16-3',
            player1: 'J. Sinner',
            player2: 'A. Rublev',
            player1Score: '6 6 7⁴',
            player2Score: '4 3 6⁶',
            status: 'completed'
          },
          {
            id: 'match-r16-4',
            player1: 'D. Medvedev',
            player2: 'H. Hurkacz',
            player1Score: '6 7⁸ ',
            player2Score: '3 6⁶',
            status: 'completed'
          },
          {
            id: 'match-r16-5',
            player1: 'A. Zverev',
            player2: 'C. Ruud',
            player1Score: '7⁵ 6',
            player2Score: '6⁷ 4',
            status: 'completed'
          },
          {
            id: 'match-r16-6',
            player1: 'S. Korda',
            player2: 'F. Auger-Aliassime',
            player1Score: '6 6 6',
            player2Score: '4 7⁵ 3',
            status: 'completed'
          },
          {
            id: 'match-r16-7',
            player1: 'G. Dimitrov',
            player2: 'B. Shelton',
            player1Score: '6 3 7³',
            player2Score: '3 6 6⁷',
            status: 'completed'
          },
          {
            id: 'match-r16-8',
            player1: 'H. Rune',
            player2: 'A. de Minaur',
            player1Score: '7⁶ 6',
            player2Score: '6⁸ 3',
            status: 'completed'
          }
        ]
      },
      {
        name: 'Quarterfinals',
        matches: [
          {
            id: 'match-qf-1',
            player1: 'N. Djokovic',
            player2: 'C. Alcaraz',
            player1Score: '6 3',
            player2Score: '4 6',
            status: 'live'
          },
          {
            id: 'match-qf-2',
            player1: 'J. Sinner',
            player2: 'D. Medvedev',
            status: 'upcoming',
            matchDate: 'Oct 30',
            matchTime: '7:00 PM'
          },
          {
            id: 'match-qf-3',
            player1: 'A. Zverev',
            player2: 'S. Korda',
            status: 'upcoming',
            matchDate: 'Oct 31',
            matchTime: '2:00 PM'
          },
          {
            id: 'match-qf-4',
            player1: 'G. Dimitrov',
            player2: 'H. Rune',
            status: 'upcoming',
            matchDate: 'Oct 31',
            matchTime: '7:00 PM'
          }
        ]
      },
      {
        name: 'Semifinals',
        matches: [
          {
            id: 'match-sf-1',
            player1: 'TBD',
            player2: 'TBD',
            status: 'upcoming'
          },
          {
            id: 'match-sf-2',
            player1: 'TBD',
            player2: 'TBD',
            status: 'upcoming'
          }
        ]
      },
      {
        name: 'Final',
        matches: [
          {
            id: 'match-f-1',
            player1: 'TBD',
            player2: 'TBD',
            status: 'upcoming'
          }
        ]
      }
    ]
  },
  {
    id: 'wta-finals-2025',
    name: 'WTA Finals',
    status: 'active',
    rounds: [
      {
        name: 'Round 16',
        matches: [
          {
            id: 'wta-match-r16-1',
            player1: 'I. Swiatek',
            player2: 'J. Pegula',
            player1Score: '6 6',
            player2Score: '3 4',
            status: 'completed'
          },
          {
            id: 'wta-match-r16-2',
            player1: 'A. Sabalenka',
            player2: 'E. Rybakina',
            player1Score: '7⁴ 6',
            player2Score: '6⁶ 3',
            status: 'completed'
          },
          {
            id: 'wta-match-r16-3',
            player1: 'C. Gauff',
            player2: 'O. Jabeur',
            player1Score: '6 7⁵',
            player2Score: '4 6⁷',
            status: 'completed'
          },
          {
            id: 'wta-match-r16-4',
            player1: 'M. Sakkari',
            player2: 'B. Krejcikova',
            player1Score: '6 6',
            player2Score: '2 4',
            status: 'completed'
          },
          {
            id: 'wta-match-r16-5',
            player1: 'Q. Zheng',
            player2: 'D. Kasatkina',
            player1Score: '7⁶ 6',
            player2Score: '6⁸ 3',
            status: 'completed'
          },
          {
            id: 'wta-match-r16-6',
            player1: 'M. Keys',
            player2: 'L. Fernandez',
            player1Score: '6 3 6',
            player2Score: '4 6 4',
            status: 'completed'
          },
          {
            id: 'wta-match-r16-7',
            player1: 'P. Badosa',
            player2: 'V. Azarenka',
            player1Score: '6 7³',
            player2Score: '4 6⁷',
            status: 'completed'
          },
          {
            id: 'wta-match-r16-8',
            player1: 'J. Ostapenko',
            player2: 'K. Muchova',
            player1Score: '7⁵ 6',
            player2Score: '6⁷ 2',
            status: 'completed'
          }
        ]
      },
      {
        name: 'Quarterfinals',
        matches: [
          {
            id: 'wta-match-qf-1',
            player1: 'I. Swiatek',
            player2: 'A. Sabalenka',
            status: 'upcoming',
            hasPrediction: true,
            matchDate: 'Oct 30',
            matchTime: '5:00 PM'
          },
          {
            id: 'wta-match-qf-2',
            player1: 'C. Gauff',
            player2: 'M. Sakkari',
            status: 'upcoming',
            matchDate: 'Oct 30',
            matchTime: '8:00 PM'
          },
          {
            id: 'wta-match-qf-3',
            player1: 'Q. Zheng',
            player2: 'M. Keys',
            status: 'upcoming',
            matchDate: 'Oct 31',
            matchTime: '3:00 PM'
          },
          {
            id: 'wta-match-qf-4',
            player1: 'P. Badosa',
            player2: 'J. Ostapenko',
            status: 'upcoming',
            matchDate: 'Oct 31',
            matchTime: '6:00 PM'
          }
        ]
      },
      {
        name: 'Semifinals',
        matches: [
          {
            id: 'wta-match-sf-1',
            player1: 'TBD',
            player2: 'TBD',
            status: 'upcoming'
          },
          {
            id: 'wta-match-sf-2',
            player1: 'TBD',
            player2: 'TBD',
            status: 'upcoming'
          }
        ]
      },
      {
        name: 'Final',
        matches: [
          {
            id: 'wta-match-f-1',
            player1: 'TBD',
            player2: 'TBD',
            status: 'upcoming'
          }
        ]
      }
    ]
  }
];

function MatchCard({ match, predictions }: { match: MatchResult; predictions: { matchId: string }[] }) {
  const hasPrediction = predictions.some(p => p.matchId === match.id) || match.hasPrediction;
  const isCompleted = match.status === 'completed';
  const isLive = match.status === 'live';
  const isUpcoming = match.status === 'upcoming';
  const isTBD = match.player1 === 'TBD' || match.player2 === 'TBD';
  const showScores = (isCompleted || isLive) && !isTBD;

  return (
    <Card className="bg-card border-border rounded-[var(--radius)] overflow-hidden">
      <div className="p-4">
        {/* Live Badge */}
        {isLive && (
          <div className="mb-3">
            <Badge className="bg-destructive text-destructive-foreground border-0">
              LIVE
            </Badge>
          </div>
        )}

        <div className="space-y-3">
          {/* Player 1 */}
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className={isTBD ? 'text-card-foreground/40' : ''}>{match.player1}</p>
            </div>
            {showScores && match.player1Score && (
              <p className="ml-4" dangerouslySetInnerHTML={{ __html: match.player1Score }} />
            )}
          </div>

          {/* VS Divider */}
          <div className="relative">
            <div className="h-px bg-border" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-3">
              <p className="text-card-foreground/60">vs</p>
            </div>
          </div>

          {/* Player 2 */}
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className={isTBD ? 'text-card-foreground/40' : ''}>{match.player2}</p>
            </div>
            {showScores && match.player2Score && (
              <p className="ml-4" dangerouslySetInnerHTML={{ __html: match.player2Score }} />
            )}
          </div>
        </div>

        {/* Match Time/Date for Upcoming */}
        {isUpcoming && !isTBD && match.matchDate && match.matchTime && (
          <div className="mt-3 pt-3 border-t border-border">
            <p className="text-card-foreground/60">{match.matchDate} • {match.matchTime}</p>
          </div>
        )}

        {/* Prediction Badge */}
        {hasPrediction && !isTBD && (
          <div className={`${isUpcoming && match.matchDate && match.matchTime ? 'mt-2' : 'mt-3 pt-3 border-t border-border'}`}>
            <Badge className="bg-secondary text-secondary-foreground border-0">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Predicted
            </Badge>
          </div>
        )}
      </div>
    </Card>
  );
}

export function Matches({ onBack, predictions }: MatchesProps) {
  // Find active tournaments and set the first one as default
  const activeTournaments = tournaments.filter(t => t.status === 'active');
  const [selectedTournamentId, setSelectedTournamentId] = useState(activeTournaments[0]?.id || tournaments[0].id);
  const selectedTournament = tournaments.find(t => t.id === selectedTournamentId)!;
  
  // Find the current round (first round with upcoming matches, or last round with completed matches)
  const currentRoundIndex = selectedTournament.rounds.findIndex(r => 
    r.matches.some(m => m.status === 'upcoming' || m.status === 'live')
  );
  const defaultRoundIndex = currentRoundIndex !== -1 ? currentRoundIndex : selectedTournament.rounds.length - 1;
  
  const [currentRound, setCurrentRound] = useState(defaultRoundIndex);

  const canGoPrevious = currentRound > 0;
  const canGoNext = currentRound < selectedTournament.rounds.length - 1;

  const handlePrevious = () => {
    if (canGoPrevious) {
      setCurrentRound(currentRound - 1);
    }
  };

  const handleNext = () => {
    if (canGoNext) {
      setCurrentRound(currentRound + 1);
    }
  };

  const handleTournamentChange = (tournamentId: string) => {
    setSelectedTournamentId(tournamentId);
    const newTournament = tournaments.find(t => t.id === tournamentId)!;
    const newCurrentRoundIndex = newTournament.rounds.findIndex(r => 
      r.matches.some(m => m.status === 'upcoming' || m.status === 'live')
    );
    setCurrentRound(newCurrentRoundIndex !== -1 ? newCurrentRoundIndex : newTournament.rounds.length - 1);
  };

  const round = selectedTournament.rounds[currentRound];
  
  // Sort matches to show live matches first
  const sortedMatches = [...round.matches].sort((a, b) => {
    if (a.status === 'live' && b.status !== 'live') return -1;
    if (a.status !== 'live' && b.status === 'live') return 1;
    return 0;
  });

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b border-border">
        <div className="flex items-center justify-between p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="hover:bg-accent"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2>Matches</h2>
          <div className="w-10" /> {/* Spacer for alignment */}
        </div>

        {/* Tournament Selector */}
        {activeTournaments.length > 1 && (
          <div className="px-4 pb-4">
            <Select value={selectedTournamentId} onValueChange={handleTournamentChange}>
              <SelectTrigger className="w-full bg-card border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {activeTournaments.map(tournament => (
                  <SelectItem key={tournament.id} value={tournament.id}>
                    {tournament.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Single Tournament Display */}
        {activeTournaments.length === 1 && (
          <div className="px-4 pb-4">
            <h3 className="text-center">{selectedTournament.name}</h3>
          </div>
        )}

        {/* Round Navigation */}
        <div className="flex items-center justify-between px-4 pb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrevious}
            disabled={!canGoPrevious}
            className="hover:bg-accent disabled:opacity-30"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h3>{round.name}</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNext}
            disabled={!canGoNext}
            className="hover:bg-accent disabled:opacity-30"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Matches */}
      <div className="p-4 space-y-4">
        {sortedMatches.map(match => (
          <MatchCard key={match.id} match={match} predictions={predictions} />
        ))}
      </div>
    </div>
  );
}
