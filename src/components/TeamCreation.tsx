import { ArrowLeft, Plus, Check, Info } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { useState } from 'react';

interface Tournament {
  name: string;
  location: string;
  date: string;
  size: 32 | 64 | 128;
}

interface Player {
  id: number;
  name: string;
  country: string;
  ranking: number;
  price: number;
  points: number;
  form: 'hot' | 'good' | 'normal';
  tier: number;
}

interface TeamCreationProps {
  tournament: Tournament;
  onBack: () => void;
  onContinue: (players: Array<{ id: number; name: string; country: string; ranking: number; price: number; tier: number }>) => void;
}

const countries = ['🇷🇸', '🇪🇸', '🇷🇺', '🇮🇹', '🇬🇷', '🇩🇰', '🇺🇸', '🇬🇧', '🇫🇷', '🇩🇪', '🇨🇦', '🇦🇺', '🇦🇷', '🇧🇷', '🇯🇵', '🇨🇭'];
const firstNames = ['N.', 'C.', 'D.', 'J.', 'A.', 'S.', 'H.', 'T.', 'F.', 'M.', 'L.', 'K.', 'R.', 'P.', 'B.', 'E.'];
const lastNames = ['Djokovic', 'Alcaraz', 'Medvedev', 'Sinner', 'Rublev', 'Tsitsipas', 'Rune', 'Fritz', 'Federer', 'Murray', 'Lopez', 'Kim', 'Rodriguez', 'Anderson', 'Brown', 'Evans', 'Thompson', 'Martinez', 'Wilson', 'Taylor', 'Davis', 'Johnson', 'Williams', 'Smith', 'Jones', 'Garcia', 'Miller', 'Moore', 'Jackson', 'White', 'Harris', 'Martin', 'Lee', 'Walker', 'Hall', 'Allen', 'Young'];

function generatePlayers(tournamentSize: number): Player[] {
  const players: Player[] = [];
  
  // Calculate tier distribution
  const tierSizes = calculateTierSizes(tournamentSize);
  
  let currentRanking = 1;
  
  for (let tier = 1; tier <= 6; tier++) {
    const playersInTier = tierSizes[tier - 1];
    
    for (let i = 0; i < playersInTier; i++) {
      const player: Player = {
        id: currentRanking,
        name: `${firstNames[currentRanking % firstNames.length]} ${lastNames[currentRanking % lastNames.length]}`,
        country: countries[currentRanking % countries.length],
        ranking: currentRanking,
        price: calculatePrice(tier, i, playersInTier),
        points: Math.max(2000 - (currentRanking - 1) * 15, 100),
        form: calculateForm(currentRanking),
        tier
      };
      
      players.push(player);
      currentRanking++;
    }
  }
  
  return players;
}

function calculateTierSizes(tournamentSize: number): number[] {
  const tier1 = 4;
  const remaining = tournamentSize - tier1;
  const baseSize = Math.floor(remaining / 5);
  const extra = remaining % 5;
  
  const sizes = [tier1];
  for (let i = 0; i < 5; i++) {
    sizes.push(baseSize + (i < extra ? 1 : 0));
  }
  
  return sizes;
}

function calculatePrice(tier: number, indexInTier: number, tierSize: number): number {
  const tierRanges = [
    [22, 25], // Tier 1
    [18, 21], // Tier 2
    [14, 17], // Tier 3
    [10, 13], // Tier 4
    [6, 9],   // Tier 5
    [2, 5]    // Tier 6
  ];
  
  const [min, max] = tierRanges[tier - 1];
  const priceRange = max - min;
  const step = tierSize > 1 ? priceRange / (tierSize - 1) : 0;
  
  return Math.round(max - (step * indexInTier));
}

function calculateForm(ranking: number): 'hot' | 'good' | 'normal' {
  if (ranking <= 8 && ranking % 2 === 0) return 'hot';
  if (ranking <= 16 && ranking % 3 === 0) return 'good';
  if (ranking % 7 === 0) return 'hot';
  if (ranking % 5 === 0) return 'good';
  return 'normal';
}

export function TeamCreation({ tournament, onBack, onContinue }: TeamCreationProps) {
  const [selectedPlayers, setSelectedPlayers] = useState<number[]>([]);
  const maxPlayers = 6;
  const budget = 100;
  
  const players = generatePlayers(tournament.size);
  const playersByTier = players.reduce((acc, player) => {
    if (!acc[player.tier]) acc[player.tier] = [];
    acc[player.tier].push(player);
    return acc;
  }, {} as Record<number, Player[]>);
  
  const totalSpent = selectedPlayers.reduce((sum, playerId) => {
    const player = players.find(p => p.id === playerId);
    return sum + (player?.price || 0);
  }, 0);
  
  const remainingBudget = budget - totalSpent;
  const budgetPercentage = (totalSpent / budget) * 100;

  const togglePlayer = (playerId: number) => {
    const player = players.find(p => p.id === playerId);
    if (!player) return;

    if (selectedPlayers.includes(playerId)) {
      // Deselect the player
      setSelectedPlayers(selectedPlayers.filter(id => id !== playerId));
    } else {
      // Check if a player from this tier is already selected
      const selectedInTier = selectedPlayers.find(id => {
        const p = players.find(pl => pl.id === id);
        return p?.tier === player.tier;
      });

      if (selectedInTier) {
        // Replace the player in this tier
        const oldPlayer = players.find(p => p.id === selectedInTier);
        const budgetWithoutOld = remainingBudget + (oldPlayer?.price || 0);
        
        if (budgetWithoutOld >= player.price) {
          setSelectedPlayers(selectedPlayers.map(id => id === selectedInTier ? playerId : id));
        }
      } else {
        // Add new player if within limits
        if (selectedPlayers.length < maxPlayers && remainingBudget >= player.price) {
          setSelectedPlayers([...selectedPlayers, playerId]);
        }
      }
    }
  };

  const getFormColor = (form: Player['form']) => {
    switch (form) {
      case 'hot': return 'bg-destructive text-destructive-foreground';
      case 'good': return 'bg-secondary text-secondary-foreground';
      default: return 'bg-accent text-accent-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-primary border-b border-border">
        <div className="flex items-center gap-3 p-4">
          <button onClick={onBack} className="shrink-0 min-h-[44px] min-w-[44px]" aria-label="Go back">
            <ArrowLeft className="w-5 h-5 text-foreground" aria-hidden="true" />
          </button>
          <div className="flex-1">
            <h1 className="text-foreground">{tournament.name}</h1>
            <p className="text-foreground/80">{tournament.location} • {tournament.date}</p>
          </div>
        </div>
      </header>

      {/* Budget Section */}
      <section aria-labelledby="budget-heading" className="sticky top-[73px] z-40 bg-card border-b border-border p-4">
        <div className="max-w-2xl mx-auto space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 id="budget-heading">Budget</h2>
              <p className="text-card-foreground/60">
                {selectedPlayers.length}/{maxPlayers} players selected
              </p>
            </div>
            <div className="text-right">
              <p className={remainingBudget < 0 ? 'text-destructive' : 'text-secondary'} aria-live="polite">
                ${remainingBudget.toFixed(0)}
              </p>
              <p className="text-card-foreground/60">remaining</p>
            </div>
          </div>
          <Progress value={budgetPercentage} className="h-2" aria-label={`Budget used: ${budgetPercentage}%`} />
        </div>
      </section>

      {/* Info Banner */}
      <div role="note" className="bg-accent/50 border-b border-border p-3">
        <div className="max-w-2xl mx-auto flex items-start gap-2">
          <Info className="w-4 h-4 text-card-foreground/60 shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-card-foreground/80">
            Select one player from each tier (6 total) within your ${budget} budget. Higher ranked players cost more but earn more points.
          </p>
        </div>
      </div>

      {/* Players List */}
      <section aria-label="Player selection by tier" className="p-4 space-y-6">
        {[1, 2, 3, 4, 5, 6].map((tierNum) => {
          const tierPlayers = playersByTier[tierNum] || [];
          if (tierPlayers.length === 0) return null;
          
          return (
            <div key={tierNum} className="space-y-3">
              <div className="flex items-center gap-2">
                <h2>Tier {tierNum}</h2>
                <Badge className="bg-accent text-accent-foreground border-0" aria-label={`${tierPlayers.length} players in tier ${tierNum}`}>
                  {tierPlayers.length} players
                </Badge>
              </div>
              
              {tierPlayers.map((player) => {
                const isSelected = selectedPlayers.includes(player.id);
                
                // Check if another player from this tier is selected
                const selectedInTier = selectedPlayers.find(id => {
                  const p = players.find(pl => pl.id === id);
                  return p?.tier === player.tier && p?.id !== player.id;
                });
                
                // Calculate budget considering if we're replacing a tier selection
                const effectiveBudget = selectedInTier 
                  ? remainingBudget + (players.find(p => p.id === selectedInTier)?.price || 0)
                  : remainingBudget;
                
                const canAfford = effectiveBudget >= player.price || isSelected;
                const canSelect = selectedPlayers.length < maxPlayers || isSelected || !!selectedInTier;
                const isDisabled = !canAfford || !canSelect;

                return (
                  <button
                    key={player.id}
                    className={`border rounded-[var(--radius)] p-4 transition-all w-full text-left min-h-[44px] ${
                      isSelected 
                        ? 'bg-secondary/10 border-secondary' 
                        : isDisabled 
                        ? 'bg-card/50 opacity-50' 
                        : 'bg-card border-border'
                    }`}
                    onClick={() => !isDisabled && togglePlayer(player.id)}
                    disabled={isDisabled}
                    aria-label={`${isSelected ? 'Remove' : 'Select'} ${player.name}, ${player.country}, Rank ${player.ranking}, ${player.points} points, $${player.price}${!canAfford ? ' (cannot afford)' : ''}`}
                    aria-pressed={isSelected}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span aria-hidden="true">{player.country}</span>
                          <h4>{player.name}</h4>
                        </div>
                        <div className="flex items-center gap-3">
                          <p className="text-card-foreground/60">Rank #{player.ranking}</p>
                          <p className="text-card-foreground/60" aria-hidden="true">•</p>
                          <p className="text-card-foreground/60">{player.points} pts</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <h4 className="text-primary">${player.price}</h4>
                        </div>
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                            isSelected
                              ? 'bg-secondary border-secondary'
                              : 'border-border bg-card'
                          }`}
                          aria-hidden="true"
                        >
                          {isSelected && <Check className="w-4 h-4 text-secondary-foreground" />}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          );
        })}
      </section>

      {/* Fixed Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 space-y-3">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-card-foreground/60">Team Status</p>
              <h4>
                {selectedPlayers.length}/{maxPlayers} players • ${totalSpent.toFixed(0)} spent
              </h4>
            </div>
          </div>
          <Button
            className="w-full bg-secondary text-secondary-foreground border border-border"
            disabled={selectedPlayers.length !== maxPlayers || remainingBudget < 0}
            onClick={() => {
              const playersData = selectedPlayers.map(id => {
                const player = players.find(p => p.id === id)!;
                return {
                  id: player.id,
                  name: player.name,
                  country: player.country,
                  ranking: player.ranking,
                  price: player.price,
                  tier: player.tier
                };
              });
              onContinue(playersData);
            }}
          >
            {selectedPlayers.length === maxPlayers 
              ? 'Continue to Skills' 
              : `Select ${maxPlayers - selectedPlayers.length} more player${maxPlayers - selectedPlayers.length > 1 ? 's' : ''}`
            }
          </Button>
        </div>
      </div>
    </div>
  );
}
