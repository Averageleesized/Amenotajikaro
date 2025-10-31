import { ArrowLeft, Trophy, CheckCircle2, Clock, TrendingUp } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useState } from 'react';

interface Match {
  id: string;
  player1: string;
  player2: string;
  tournament: string;
  time: string;
  date: string;
}

export interface Prediction {
  id: string;
  matchId: string;
  player1: string;
  player2: string;
  tournament: string;
  selectedPlayer: string;
  date: string;
  time: string;
  totalVotes?: number;
  player1Votes?: number;
  player2Votes?: number;
  pointsEarned?: number;
  isCorrect?: boolean;
  status: 'pending' | 'completed';
}

interface PredictionsProps {
  onBack: () => void;
  predictions: Prediction[];
  onAddPrediction: (prediction: Omit<Prediction, 'id' | 'status'>) => void;
}

// Mock data for today's matches
const todaysMatches: Match[] = [
  {
    id: 'match-1',
    player1: 'D. Djokovic',
    player2: 'B. Shelton',
    tournament: 'ATP Finals',
    time: '2:00 PM',
    date: 'Today'
  },
  {
    id: 'match-2',
    player1: 'I. Swiatek',
    player2: 'A. Sabalenka',
    tournament: 'WTA Finals',
    time: '5:30 PM',
    date: 'Today'
  },
  {
    id: 'match-3',
    player1: 'C. Alcaraz',
    player2: 'J. Sinner',
    tournament: 'ATP Finals',
    time: '7:00 PM',
    date: 'Today'
  }
];

function PredictionBox({ 
  match, 
  existingPrediction,
  onPredict 
}: { 
  match: Match;
  existingPrediction?: Prediction;
  onPredict: (matchId: string, selectedPlayer: string) => void;
}) {
  const hasPredicted = !!existingPrediction;
  const selectedPlayer = existingPrediction?.selectedPlayer;

  // Calculate potential points based on pick percentage
  let potentialPoints = '1-15';
  if (existingPrediction && selectedPlayer) {
    const pickedPercentage = selectedPlayer === match.player1 
      ? existingPrediction.player1Votes 
      : existingPrediction.player2Votes;
    
    if (pickedPercentage !== undefined) {
      const points = Math.ceil((1 - pickedPercentage / 100) * 15);
      potentialPoints = `${points}`;
    }
  }

  return (
    <Card className="bg-card border-border rounded-[var(--radius)] overflow-hidden">
      {/* Match Header */}
      <div className="bg-accent/50 border-b border-border p-3 flex items-center justify-between">
        <div>
          <p className="text-card-foreground/60">{match.tournament}</p>
          <div className="flex items-center gap-2 mt-1">
            <Clock className="w-3 h-3 text-card-foreground/60" />
            <p className="text-card-foreground/80">{match.time}</p>
          </div>
        </div>
        {hasPredicted && (
          <Badge className="bg-secondary text-secondary-foreground border-0">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Predicted
          </Badge>
        )}
      </div>

      {/* Players */}
      <div className="p-4">
        <div className="space-y-3">
          {/* Player 1 */}
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <p className={selectedPlayer === match.player1 ? 'font-[var(--font-weight-bold)]' : ''}>
                {match.player1}
              </p>
              {existingPrediction?.player1Votes !== undefined && (
                <p className="text-card-foreground/60">
                  {existingPrediction.player1Votes}% picked
                </p>
              )}
            </div>
            <Button
              variant={selectedPlayer === match.player1 ? 'default' : 'outline'}
              className={`${
                selectedPlayer === match.player1
                  ? 'bg-secondary text-secondary-foreground'
                  : 'border-border'
              }`}
              onClick={() => onPredict(match.id, match.player1)}
              disabled={hasPredicted}
            >
              {selectedPlayer === match.player1 ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                'Pick'
              )}
            </Button>
          </div>

          {/* VS Divider */}
          <div className="relative">
            <div className="h-px bg-border" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-3">
              <p className="text-card-foreground/60">vs</p>
            </div>
          </div>

          {/* Player 2 */}
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <p className={selectedPlayer === match.player2 ? 'font-[var(--font-weight-bold)]' : ''}>
                {match.player2}
              </p>
              {existingPrediction?.player2Votes !== undefined && (
                <p className="text-card-foreground/60">
                  {existingPrediction.player2Votes}% picked
                </p>
              )}
            </div>
            <Button
              variant={selectedPlayer === match.player2 ? 'default' : 'outline'}
              className={`${
                selectedPlayer === match.player2
                  ? 'bg-secondary text-secondary-foreground'
                  : 'border-border'
              }`}
              onClick={() => onPredict(match.id, match.player2)}
              disabled={hasPredicted}
            >
              {selectedPlayer === match.player2 ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                'Pick'
              )}
            </Button>
          </div>
        </div>

        {/* Prediction Info */}
        {hasPredicted && (
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex items-center justify-between text-card-foreground/80">
              <p>Potential Points</p>
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-secondary" />
                <span>{potentialPoints} pts</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

function PastPredictionCard({ prediction }: { prediction: Prediction }) {
  const pointsEarned = prediction.pointsEarned || 0;
  const isCorrect = prediction.isCorrect;

  return (
    <Card className="bg-card border-border rounded-[var(--radius)] overflow-hidden">
      <div className="bg-accent/50 border-b border-border p-3 flex items-center justify-between">
        <div>
          <p className="text-card-foreground/60">{prediction.tournament}</p>
          <p className="text-card-foreground/80">{prediction.date}</p>
        </div>
        <Badge className={`${
          isCorrect 
            ? 'bg-secondary text-secondary-foreground' 
            : 'bg-destructive text-destructive-foreground'
        } border-0`}>
          {isCorrect ? `+${pointsEarned} pts` : '0 pts'}
        </Badge>
      </div>

      <div className="p-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className={isCorrect && prediction.selectedPlayer === prediction.player1 ? 'font-[var(--font-weight-bold)]' : ''}>
              {prediction.player1}
            </p>
            {prediction.player1Votes !== undefined && (
              <p className="text-card-foreground/60">{prediction.player1Votes}%</p>
            )}
          </div>
          <div className="h-px bg-border" />
          <div className="flex items-center justify-between">
            <p className={isCorrect && prediction.selectedPlayer === prediction.player2 ? 'font-[var(--font-weight-bold)]' : ''}>
              {prediction.player2}
            </p>
            {prediction.player2Votes !== undefined && (
              <p className="text-card-foreground/60">{prediction.player2Votes}%</p>
            )}
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
          <div>
            <p className="text-card-foreground/60">Your Pick</p>
            <p className="font-[var(--font-weight-bold)]">{prediction.selectedPlayer}</p>
          </div>
          {isCorrect ? (
            <CheckCircle2 className="w-5 h-5 text-secondary" />
          ) : (
            <div className="w-5 h-5 rounded-full border-2 border-destructive" />
          )}
        </div>
      </div>
    </Card>
  );
}

export function Predictions({ onBack, predictions, onAddPrediction }: PredictionsProps) {
  const [activeTab, setActiveTab] = useState<'active' | 'past'>('active');

  const pendingPredictions = predictions.filter(p => p.status === 'pending');
  const completedPredictions = predictions.filter(p => p.status === 'completed');

  // Group past predictions by tournament
  const predictionsByTournament = completedPredictions.reduce((acc, pred) => {
    if (!acc[pred.tournament]) {
      acc[pred.tournament] = [];
    }
    acc[pred.tournament].push(pred);
    return acc;
  }, {} as Record<string, Prediction[]>);

  const handlePredict = (matchId: string, selectedPlayer: string) => {
    const match = todaysMatches.find(m => m.id === matchId);
    if (!match) return;

    // Simulate vote percentages (in real app, this would come from backend)
    const player1Votes = Math.floor(Math.random() * 60) + 20; // 20-80%
    const player2Votes = 100 - player1Votes;

    onAddPrediction({
      matchId,
      player1: match.player1,
      player2: match.player2,
      tournament: match.tournament,
      selectedPlayer,
      date: match.date,
      time: match.time,
      player1Votes,
      player2Votes
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-primary border-b border-border">
        <div className="flex items-center gap-3 p-4">
          <button onClick={onBack} className="shrink-0">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div className="flex-1">
            <h3 className="text-foreground">Predictions</h3>
            <p className="text-foreground/80">Pick winners to earn bonus points</p>
          </div>
        </div>
      </header>

      {/* Info Banner */}
      <div className="bg-secondary/10 border-b border-border p-4">
        <div className="flex items-start gap-3">
          <TrendingUp className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
          <div>
            <h4 className="mb-1">How Predictions Work</h4>
            <p className="text-card-foreground/80">
              Earn 1-15 points per correct prediction. Fewer people picking your winner = more points!
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-[73px] z-40 bg-card border-b border-border">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'active' | 'past')}>
          <TabsList className="w-full grid grid-cols-2 bg-transparent border-0 rounded-none h-auto p-0">
            <TabsTrigger 
              value="active" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-secondary data-[state=active]:bg-transparent data-[state=active]:shadow-none py-3"
            >
              Active ({todaysMatches.length})
            </TabsTrigger>
            <TabsTrigger 
              value="past" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-secondary data-[state=active]:bg-transparent data-[state=active]:shadow-none py-3"
            >
              Past ({completedPredictions.length})
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Active Predictions */}
      {activeTab === 'active' && (
        <div className="p-4 space-y-4">
          <div>
            <h3 className="mb-2">Today's Matches</h3>
            <p className="text-card-foreground/80">Make your predictions before matches start</p>
          </div>

          {todaysMatches.map((match) => {
            const existingPrediction = pendingPredictions.find(p => p.matchId === match.id);
            return (
              <PredictionBox
                key={match.id}
                match={match}
                existingPrediction={existingPrediction}
                onPredict={handlePredict}
              />
            );
          })}

          {pendingPredictions.length > 0 && (() => {
            // Calculate cumulative potential points
            const totalPotentialPoints = pendingPredictions.reduce((sum, prediction) => {
              const match = todaysMatches.find(m => m.id === prediction.matchId);
              if (!match) return sum;
              
              const pickedPercentage = prediction.selectedPlayer === match.player1
                ? prediction.player1Votes
                : prediction.player2Votes;
              
              if (pickedPercentage !== undefined) {
                const points = Math.ceil((1 - pickedPercentage / 100) * 15);
                return sum + points;
              }
              return sum;
            }, 0);

            // Calculate total points earned from completed predictions
            const totalPointsEarned = predictions
              .filter(p => p.status === 'completed')
              .reduce((sum, p) => sum + (p.pointsEarned || 0), 0);

            return (
              <div className="mt-6 p-4 bg-accent rounded-[var(--radius)] border border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="mb-1">Total Predictions</h4>
                    <p className="text-card-foreground/80">{pendingPredictions.length} active</p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-card-foreground/60">Today's Potential</p>
                      <div className="flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-secondary" />
                        <span className="font-[var(--font-weight-bold)]">
                          {totalPotentialPoints} pts
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-card-foreground/60">Total Earned</p>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-secondary" />
                        <span className="font-[var(--font-weight-bold)]">
                          {totalPointsEarned} pts
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Past Predictions */}
      {activeTab === 'past' && (
        <div className="p-4 space-y-6">
          {Object.keys(predictionsByTournament).length === 0 ? (
            <Card className="bg-accent border-border rounded-[var(--radius)] p-6 text-center">
              <Trophy className="w-12 h-12 text-card-foreground/60 mx-auto mb-3" />
              <h4 className="mb-2">No Past Predictions</h4>
              <p className="text-card-foreground/80">
                Your completed predictions will appear here after matches finish.
              </p>
            </Card>
          ) : (
            Object.entries(predictionsByTournament).map(([tournament, tournamentPredictions]) => {
              const correctCount = tournamentPredictions.filter(p => p.isCorrect).length;
              const totalPoints = tournamentPredictions.reduce((sum, p) => sum + (p.pointsEarned || 0), 0);

              return (
                <div key={tournament}>
                  <div className="mb-3 pb-2 border-b border-border">
                    <h3 className="mb-1">{tournament}</h3>
                    <div className="flex items-center gap-4">
                      <p className="text-card-foreground/80">
                        {correctCount}/{tournamentPredictions.length} correct
                      </p>
                      <div className="flex items-center gap-1">
                        <Trophy className="w-4 h-4 text-secondary" />
                        <span className="font-[var(--font-weight-bold)]">{totalPoints} pts</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {tournamentPredictions.map((prediction) => (
                      <PastPredictionCard key={prediction.id} prediction={prediction} />
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
