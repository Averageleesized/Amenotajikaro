import { ArrowLeft, Check, Info } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { useState } from 'react';

interface Player {
  id: number;
  name: string;
  country: string;
  ranking: number;
  price: number;
  tier: number;
}

interface SkillsSelectionProps {
  players: Player[];
  tournamentName: string;
  onBack: () => void;
  onComplete: (assignments: Record<number, string>) => void;
}

const SKILLS = [
  { 
    id: 'consecutive-games', 
    name: 'Consecutive Games', 
    description: 'Earn points for winning games in a row',
    details: [
      { level: '2 games in a row', points: 24 },
      { level: '3 games in a row', points: 42 },
      { level: '4 games in a row', points: 63 },
      { level: '5 games in a row', points: 75 },
      { level: '6 games in a row', points: 95 }
    ],
    note: 'Scored at any point in the match, not cumulatively'
  },
  { 
    id: 'return-games', 
    name: 'Return Games Won', 
    description: 'Earn points for breaking serve',
    details: [
      { level: '1 break', points: 20 },
      { level: '2 breaks', points: 36 },
      { level: '3 breaks', points: 51 },
      { level: '4 breaks', points: 68 },
      { level: '5 breaks', points: 95 }
    ]
  },
  { 
    id: 'aces', 
    name: 'Aces', 
    description: 'Earn points for every ace served',
    details: [
      { level: 'Level 1: 1-4 aces', points: 18 },
      { level: 'Level 2: 5 aces', points: 28 },
      { level: 'Level 3: 7 aces', points: 44 },
      { level: 'Level 4: 9 aces', points: 60 },
      { level: 'Level 5: 11+ aces', points: 80 }
    ]
  },
  { 
    id: 'break-points', 
    name: 'Break Points Saved', 
    description: 'Earn points for defending break points',
    details: [
      { level: '1 saved', points: 20 },
      { level: '2 saved', points: 36 },
      { level: '3 saved', points: 51 },
      { level: '5 saved', points: 68 },
      { level: '6 saved', points: 90 }
    ]
  },
  { 
    id: 'tiebreaks', 
    name: 'Tiebreak Wins', 
    description: 'Earn points for winning tiebreaks',
    details: [
      { level: '1 win', points: 80 },
      { level: '2 wins', points: 170 },
      { level: '3 wins', points: 240 }
    ],
    note: '3 wins only possible in Grand Slams'
  },
  { 
    id: 'winners', 
    name: 'Winners', 
    description: 'Earn points for hitting winners',
    details: [
      { level: '10 winners', points: 18 },
      { level: '20 winners', points: 30 },
      { level: '25 winners', points: 44 },
      { level: '35 winners', points: 65 },
      { level: '40 winners', points: 85 }
    ],
    note: 'Ground strokes and volleys only, aces not included'
  }
];

export function SkillsSelection({ players, tournamentName, onBack, onComplete }: SkillsSelectionProps) {
  // skillAssignments maps player ID to skill ID
  const [skillAssignments, setSkillAssignments] = useState<Record<number, string>>({});
  const [openSkillModal, setOpenSkillModal] = useState<string | null>(null);
  
  const assignedSkills = Object.values(skillAssignments);
  const availableSkills = SKILLS.filter(skill => !assignedSkills.includes(skill.id));
  
  const assignSkill = (playerId: number, skillId: string) => {
    // Remove the old assignment if it exists
    const currentSkill = skillAssignments[playerId];
    
    // Check if this skill is already assigned to another player
    const playerWithSkill = Object.entries(skillAssignments).find(([_, skill]) => skill === skillId);
    
    if (playerWithSkill) {
      // Swap skills
      const otherPlayerId = parseInt(playerWithSkill[0]);
      setSkillAssignments({
        ...skillAssignments,
        [playerId]: skillId,
        [otherPlayerId]: currentSkill || ''
      });
    } else {
      // Just assign the skill
      setSkillAssignments({
        ...skillAssignments,
        [playerId]: skillId
      });
    }
  };
  
  const removeSkill = (playerId: number) => {
    const newAssignments = { ...skillAssignments };
    delete newAssignments[playerId];
    setSkillAssignments(newAssignments);
  };
  
  const isComplete = Object.keys(skillAssignments).length === 6;
  
  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-primary border-b border-border">
        <div className="flex items-center gap-3 p-4">
          <button onClick={onBack} className="shrink-0 min-h-[44px] min-w-[44px]" aria-label="Go back">
            <ArrowLeft className="w-5 h-5 text-foreground" aria-hidden="true" />
          </button>
          <div className="flex-1">
            <h1 className="text-foreground">Assign Skills</h1>
            <p className="text-foreground/80">{tournamentName}</p>
          </div>
        </div>
      </header>

      {/* Progress Section */}
      <section aria-labelledby="skills-progress-heading" className="sticky top-[73px] z-40 bg-card border-b border-border p-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h2 id="skills-progress-heading">Skills Assignment</h2>
              <p className="text-card-foreground/60" aria-live="polite">
                {Object.keys(skillAssignments).length}/6 skills assigned
              </p>
            </div>
            <div className="text-right">
              <Badge className={`${isComplete ? 'bg-secondary text-secondary-foreground' : 'bg-accent text-accent-foreground'} border-0`} aria-label={isComplete ? 'All skills assigned' : 'Assignment in progress'}>
                {isComplete ? 'Complete' : 'In Progress'}
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Info Banner */}
      <div role="note" className="bg-accent/50 border-b border-border p-3">
        <div className="max-w-2xl mx-auto flex items-start gap-2">
          <Info className="w-4 h-4 text-card-foreground/60 shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-card-foreground/80">
            Assign one skill to each player. Each skill can only be used once and adds points based on performance. Tap a skill to see scoring details.
          </p>
        </div>
      </div>

      {/* Available Skills */}
      <section className="p-4 space-y-3">
        <h3>Available Skills</h3>
        <div className="grid grid-cols-2 gap-3">
          {SKILLS.map((skill) => {
            const isAssigned = assignedSkills.includes(skill.id);
            return (
              <Card
                key={skill.id}
                className={`border-border rounded-[var(--radius)] p-2 transition-all cursor-pointer hover:border-secondary ${
                  isAssigned ? 'bg-card/50 opacity-50' : 'bg-card'
                }`}
                onClick={() => setOpenSkillModal(skill.id)}
              >
                <h4 className="mb-1">{skill.name}</h4>
                <p className="text-card-foreground/60">{skill.description}</p>
                {isAssigned && (
                  <Badge className="bg-accent text-accent-foreground border-0 mt-2">
                    Assigned
                  </Badge>
                )}
              </Card>
            );
          })}
        </div>
      </section>

      {/* Players List */}
      <section className="p-4 space-y-3">
        <h3>Your Players</h3>
        
        {players.map((player) => {
          const assignedSkillId = skillAssignments[player.id];
          const assignedSkill = SKILLS.find(s => s.id === assignedSkillId);
          
          return (
            <Card
              key={player.id}
              className={`border-border rounded-[var(--radius)] p-4 ${
                assignedSkill ? 'bg-secondary/10 border-secondary' : 'bg-card'
              }`}
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span>{player.country}</span>
                    <h4>{player.name}</h4>
                  </div>
                  <p className="text-card-foreground/60">Tier {player.tier} • Rank #{player.ranking}</p>
                </div>
                {assignedSkill && (
                  <div
                    className="w-6 h-6 rounded-full bg-secondary border-2 border-secondary flex items-center justify-center shrink-0"
                  >
                    <Check className="w-4 h-4 text-secondary-foreground" />
                  </div>
                )}
              </div>
              
              {assignedSkill ? (
                <div className="space-y-2">
                  <div className="bg-card rounded-[var(--radius)] border border-border p-3">
                    <h4 className="mb-1">{assignedSkill.name}</h4>
                    <p className="text-card-foreground/60">{assignedSkill.description}</p>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full border-border"
                    onClick={() => removeSkill(player.id)}
                  >
                    Change Skill
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-card-foreground/60 mb-2">Select a skill:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {availableSkills.map((skill) => (
                      <Button
                        key={skill.id}
                        variant="outline"
                        className="border-border h-auto py-2 px-3"
                        onClick={() => assignSkill(player.id, skill.id)}
                      >
                        <span className="truncate">{skill.name}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </section>

      {/* Fixed Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4">
        <div className="max-w-2xl mx-auto">
          <Button
            className="w-full bg-secondary text-secondary-foreground border border-border"
            disabled={!isComplete}
            onClick={() => onComplete(skillAssignments)}
          >
            {isComplete 
              ? 'Complete Team Setup' 
              : `Assign ${6 - Object.keys(skillAssignments).length} more skill${6 - Object.keys(skillAssignments).length > 1 ? 's' : ''}`
            }
          </Button>
        </div>
      </div>

      {/* Skill Details Modals */}
      {SKILLS.map((skill) => (
        <Dialog key={skill.id} open={openSkillModal === skill.id} onOpenChange={(open) => !open && setOpenSkillModal(null)}>
          <DialogContent className="bg-card border-border max-w-md">
            <DialogHeader>
              <DialogTitle>{skill.name}</DialogTitle>
              <DialogDescription className="text-card-foreground/80">
                {skill.description}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              
              <div className="border border-border rounded-[var(--radius)] overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-accent/50 border-b border-border">
                      <th className="text-left p-3">Achievement</th>
                      <th className="text-right p-3">Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {skill.details.map((detail, idx) => (
                      <tr key={idx} className="border-b border-border last:border-b-0">
                        <td className="p-3">{detail.level}</td>
                        <td className="text-right p-3">{detail.points}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {skill.note && (
                <div className="bg-accent/30 border border-border rounded-[var(--radius)] p-3">
                  <p className="text-card-foreground/80">
                    <Info className="w-4 h-4 inline mr-1" />
                    {skill.note}
                  </p>
                </div>
              )}

              <Button 
                className="w-full bg-secondary text-secondary-foreground border border-border"
                onClick={() => setOpenSkillModal(null)}
              >
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      ))}
    </div>
  );
}
