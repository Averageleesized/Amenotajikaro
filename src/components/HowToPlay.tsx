import { ChevronLeft } from 'lucide-react';
import { Button } from './ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';

interface HowToPlayProps {
  onBack: () => void;
}

export function HowToPlay({ onBack }: HowToPlayProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-primary/95 backdrop-blur-lg border-b border-border/50 shadow-sm">
        <div className="flex items-center gap-3 p-4 max-w-2xl mx-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-foreground hover:bg-primary-foreground/10 -ml-2"
            aria-label="Go back"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-foreground">How to Play</h1>
        </div>
      </header>

      {/* Content */}
      <div className="p-4 max-w-2xl mx-auto pb-8">
        <p className="text-card-foreground/70 mb-6">
          Learn how to build your dream team, make predictions, and compete for the top spot on the leaderboard.
        </p>

        <Accordion type="single" collapsible className="space-y-4">
          {/* How to Win */}
          <AccordionItem 
            value="item-1" 
            className="bg-card border-0 rounded-[var(--radius)] shadow-[var(--elevation-sm)] overflow-hidden"
          >
            <AccordionTrigger className="px-5 py-4 hover:bg-accent/50 transition-colors">
              <span>1. How to Win</span>
            </AccordionTrigger>
            <AccordionContent className="px-5 pb-4 pt-2">
              <div className="space-y-3 text-card-foreground/70">
                <p>
                  Win by accumulating the most points through your team's performance and accurate predictions.
                </p>
                <div className="space-y-2">
                  <h4 className="text-card-foreground">Points Sources:</h4>
                  <ul className="space-y-2 ml-4 list-disc">
                    <li>Your selected players earn points for wins, sets won, and game performance</li>
                    <li>Bonus points for correct match predictions</li>
                    <li>Special skills boost your players' score</li>
                  </ul>
                </div>
                <p>
                  The team with the highest total points at the end of each tournament wins and climbs the leaderboard!
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Creating Your Team */}
          <AccordionItem 
            value="item-2" 
            className="bg-card border-0 rounded-[var(--radius)] shadow-[var(--elevation-sm)] overflow-hidden"
          >
            <AccordionTrigger className="px-5 py-4 hover:bg-accent/50 transition-colors">
              <span>2. Creating Your Team</span>
            </AccordionTrigger>
            <AccordionContent className="px-5 pb-4 pt-2">
              <div className="space-y-3 text-card-foreground/70">
                <p>
                  Build your team strategically within a $100 budget by selecting 6 players from upcoming tournaments.
                </p>
                <div className="space-y-2">
                  <h4 className="text-card-foreground">Team Building Process:</h4>
                  <ul className="space-y-2 ml-4 list-disc">
                    <li><strong>Choose a Tournament:</strong> Select from tournaments of varying sizes (32, 64, or 128 players)</li>
                    <li><strong>Budget Management:</strong> You have $100 to spend on 6 players</li>
                    <li><strong>Tier System:</strong> Players are organized into 6 tiers based on their seeding
                      <ul className="mt-2 space-y-1 ml-4 list-circle">
                        <li>Tier 1: Top 4 seeded players (most expensive)</li>
                        <li>Tiers 2-6: Remaining players evenly distributed by ranking</li>
                      </ul>
                    </li>
                    <li><strong>Strategy:</strong> Balance top-tier stars with value picks to stay within budget</li>
                  </ul>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Predictions */}
          <AccordionItem 
            value="item-3" 
            className="bg-card border-0 rounded-[var(--radius)] shadow-[var(--elevation-sm)] overflow-hidden"
          >
            <AccordionTrigger className="px-5 py-4 hover:bg-accent/50 transition-colors">
              <span>3. Predictions</span>
            </AccordionTrigger>
            <AccordionContent className="px-5 pb-4 pt-2">
              <div className="space-y-3 text-card-foreground/70">
                <p>
                  Boost your score by making accurate match predictions throughout the tournament.
                </p>
                <div className="space-y-2">
                  <h4 className="text-card-foreground">How Predictions Work:</h4>
                  <ul className="space-y-2 ml-4 list-disc">
                    <li><strong>Select Matches:</strong> Choose from upcoming matches in any tournament</li>
                    <li><strong>Pick the Winner:</strong> Vote for who you think will win</li>

                    <li><strong>Lock In:</strong> Predictions must be made before the match starts</li>
                  </ul>
                </div>
                <p>
                  Correct predictions earn you bonus points, with higher confidence yielding bigger rewards!
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Score Calculation */}
          <AccordionItem 
            value="item-4" 
            className="bg-card border-0 rounded-[var(--radius)] shadow-[var(--elevation-sm)] overflow-hidden"
          >
            <AccordionTrigger className="px-5 py-4 hover:bg-accent/50 transition-colors">
              <span>4. Score Calculation</span>
            </AccordionTrigger>
            <AccordionContent className="px-5 pb-4 pt-2">
              <div className="space-y-3 text-card-foreground/70">
                <p>
                  Your total score is calculated from multiple sources throughout the tournament.
                </p>
                <div className="space-y-2">
                  <h4 className="text-card-foreground">Scoring Breakdown:</h4>
                  <ul className="space-y-2 ml-4 list-disc">
                    <li><strong>Match Wins:</strong> Base points for each match your players win</li>
                    <li><strong>Set Performance:</strong> Additional points for sets won</li>
                    <li><strong>Round Progression:</strong> Bonus points for advancing through tournament rounds</li>
                    <li><strong>Skill Multipliers:</strong> Special abilities you assign boost specific scoring categories</li>
                    <li><strong>Prediction Bonuses:</strong> Correct predictions add extra points based on confidence level</li>
                  </ul>
                </div>
                <div className="space-y-2 mt-4">
                  <h4 className="text-card-foreground">Skills Impact:</h4>
                  <p>
                    Each player can be assigned one skill that multiplies their points in specific scenarios. Choose wisely based on your players' strengths and playing style!
                  </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Competition and Tournaments */}
          <AccordionItem 
            value="item-5" 
            className="bg-card border-0 rounded-[var(--radius)] shadow-[var(--elevation-sm)] overflow-hidden"
          >
            <AccordionTrigger className="px-5 py-4 hover:bg-accent/50 transition-colors">
              <span>5. Competition and Tournaments</span>
            </AccordionTrigger>
            <AccordionContent className="px-5 pb-4 pt-2">
              <div className="space-y-3 text-card-foreground/70">
                <p>
                  Play tournaments from Challengers to a Grand Slam across real-world tennis tournaments throughout the season.
                </p>
                <div className="space-y-2">
                  <h4 className="text-card-foreground">Tournament Types:</h4>
                  <ul className="space-y-2 ml-4 list-disc">
                    <li><strong>Grand Slam:</strong> The biggest tournaments with 128 players and maximum prestige</li>
                    <li><strong>Masters 1000:</strong> Elite events featuring top-ranked players</li>
                    <li><strong>ATP 500:</strong> Major tournaments with strong player fields</li>
                    <li><strong>ATP 250:</strong> Smaller events perfect for testing strategies</li>
                  </ul>
                </div>
                <div className="space-y-2 mt-4">
                  <h4 className="text-card-foreground">How to Compete:</h4>
                  <ul className="space-y-2 ml-4 list-disc">
                    <li>Create a new team for each tournament you want to enter</li>
                    <li>Manage multiple teams across different concurrent tournaments</li>
                    <li>Track your teams' performance in the My Teams section</li>
                    <li>Climb the global leaderboard with consistent strong performances</li>
                    <li>Compete with friends by comparing team scores and predictions</li>
                  </ul>
                </div>
                <p className="mt-4">
                  Each tournament is independent, so you can experiment with different strategies and learn what works best!
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Call to Action */}
        <div className="mt-8 p-5 bg-card rounded-[var(--radius)] shadow-[var(--elevation-md)] border-2 border-primary/20">
          <h3 className="mb-2">Ready to Play?</h3>
          <p className="text-card-foreground/70 mb-4">
            Head back to the home page and select a tournament to build your first team!
          </p>
          <Button 
            className="w-full bg-destructive text-destructive-foreground border-0 shadow-[var(--elevation-md)]"
            onClick={onBack}
          >
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
}
