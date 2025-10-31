import { Trophy, Zap, Target, TrendingUp, User, LogOut, Award } from 'lucide-react';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { Card } from './components/ui/card';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import { TeamCreation } from './components/TeamCreation';
import { SkillsSelection } from './components/SkillsSelection';
import { MyTeams, Team } from './components/MyTeams';
import { Predictions, Prediction } from './components/Predictions';
import { Matches } from './components/Matches';
import { Login } from './components/Login';
import { HowToPlay } from './components/HowToPlay';
import { Terms } from './components/Terms';
import { FullLeaderboard, LeaderboardUser } from './components/FullLeaderboard';
import { UserProfile, UserProfileData } from './components/UserProfile';
import { SeedButton } from './components/SeedButton';
import { Toaster } from './components/ui/sonner';
import { useState, useEffect } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './components/ui/dropdown-menu';
import { createClient } from './utils/supabase/client';
import { projectId, publicAnonKey } from './utils/supabase/info';
import athensImage from 'figma:asset/579ec9b52431c2ed8c27acd062ac8e07456d1d0e.png';
import metzImage from 'figma:asset/4e3e96dbf6ab89125c4ff15f68af47ff70704cd0.png';
import atpFinalsImage from 'figma:asset/0b9bedfe9513fe4fc61a76c9918a6b3ed0eb1d22.png';
import australianOpenImage from 'figma:asset/68ad8d2ab2df80227232e0183792d097ae64fff4.png';

// Mock data for matches
const liveMatch = {
  player1: 'D. Djokovic',
  player2: 'B. Shelton',
  score1: [6, 7, 1],
  score2: [7, 6, 1],
  status: 'Live',
  tournament: 'ATP Finals'
};

const completedMatches = [
  {
    player1: 'C. Alcaraz',
    player2: 'J. Sinner',
    score1: '6 <b>7⁵</b> 6',
    score2: '<b>7</b> 6⁷ <b>7</b>',
    time: '2 hours ago',
    winner: 2
  }
];

const upcomingMatches = [
  {
    player1: 'I. Swiatek',
    player2: 'A. Sabalenka',
    time: 'Tomorrow 2:00 PM',
    tournament: 'WTA Finals'
  },
  {
    player1: 'R. Nadal',
    player2: 'C. Ruud',
    time: 'Tomorrow 5:30 PM',
    tournament: 'ATP Finals'
  }
];

const tournaments = [
  { name: 'Vanda Pharmaceuticals Hellenic Championship', location: 'Athens, Greece', date: 'Nov 2-8', size: 32 as const, level: '250' as const },
  { name: 'Moselle Open', location: 'Metz, France', date: 'Nov 2-8', size: 32 as const, level: '250' as const },
  { name: 'ATP Finals', location: 'Turin, Italy', date: 'Nov 9-16', size: 128 as const, level: '500' as const },
  { name: 'Australian Open', location: 'Melbourne, Australia', date: 'Jan 12-25, 2026', size: 128 as const, level: 'Grand Slam' as const }
];

const leaderboard = [
  { rank: 1, name: 'Ace Warriors', points: 2847, avatar: '🎾' },
  { rank: 2, name: 'Net Masters', points: 2765, avatar: '🏆' },
  { rank: 3, name: 'Baseline Kings', points: 2601, avatar: '⚡' },
  { rank: 4, name: 'Smash Squad', points: 2543, avatar: '💪' },
  { rank: 5, name: 'Court Crushers', points: 2498, avatar: '🔥' }
];

type Page = 'landing' | 'teamCreation' | 'skills' | 'myTeams' | 'predictions' | 'matches' | 'howToPlay' | 'terms' | 'leaderboard' | 'userProfile';

interface SelectedPlayer {
  id: number;
  name: string;
  country: string;
  ranking: number;
  price: number;
  tier: number;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [selectedTournament, setSelectedTournament] = useState<typeof tournaments[0] | null>(null);
  const [selectedPlayers, setSelectedPlayers] = useState<SelectedPlayer[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [showLogin, setShowLogin] = useState(false);
  const [loginMode, setLoginMode] = useState<'login' | 'signup'>('signup');
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [userProfileData, setUserProfileData] = useState<UserProfileData | null>(null);

  const supabase = createClient();

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (data && data.session) {
          setAccessToken(data.session.access_token);
          setUser(data.session.user);
          // Load user data
          await loadUserData(data.session.access_token);
        }
      } catch (error) {
        console.error('Error checking session:', error);
      }
    };
    checkSession();
    
    // Load leaderboard data on initial load
    loadLeaderboard();
  }, []);

  // Load user teams and predictions from backend
  const loadUserData = async (token: string) => {
    try {
      // Load teams
      const teamsResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a989b36a/teams`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      
      if (teamsResponse.ok) {
        const teamsData = await teamsResponse.json();
        setTeams(teamsData.teams || []);
      }

      // Load predictions
      const predictionsResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a989b36a/predictions`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      
      if (predictionsResponse.ok) {
        const predictionsData = await predictionsResponse.json();
        setPredictions(predictionsData.predictions || []);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleLoginSuccess = async (token: string, userData: any) => {
    setAccessToken(token);
    setUser(userData);
    setShowLogin(false);
    await loadUserData(token);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setAccessToken(null);
    setUser(null);
    setTeams([]);
    setPredictions([]);
    setCurrentPage('landing');
  };

  const requireAuth = (action: () => void) => {
    if (!accessToken) {
      setLoginMode('signup');
      setShowLogin(true);
    } else {
      action();
    }
  };

  // Load leaderboard data
  const loadLeaderboard = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a989b36a/leaderboard`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setLeaderboardData(data.leaderboard || []);
      }
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    }
  };

  // Load user profile data
  const loadUserProfile = async (userId: string) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a989b36a/profile/${userId}`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setUserProfileData(data.profile);
        setSelectedUserId(userId);
        setCurrentPage('userProfile');
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const handleViewLeaderboard = () => {
    loadLeaderboard();
    setCurrentPage('leaderboard');
  };

  const handleUserClick = (userId: string) => {
    loadUserProfile(userId);
  };

  if (currentPage === 'terms') {
    return (
      <Terms
        onBack={() => setCurrentPage('landing')}
      />
    );
  }

  if (currentPage === 'howToPlay') {
    return (
      <HowToPlay
        onBack={() => setCurrentPage('landing')}
      />
    );
  }

  if (currentPage === 'leaderboard') {
    return (
      <FullLeaderboard
        onBack={() => setCurrentPage('landing')}
        onUserClick={handleUserClick}
        leaderboardData={leaderboardData}
      />
    );
  }

  if (currentPage === 'userProfile' && userProfileData) {
    return (
      <UserProfile
        onBack={() => setCurrentPage('leaderboard')}
        profileData={userProfileData}
      />
    );
  }

  if (currentPage === 'matches') {
    return (
      <Matches
        predictions={predictions}
        onBack={() => setCurrentPage('landing')}
      />
    );
  }

  if (currentPage === 'predictions') {
    return (
      <Predictions
        predictions={predictions}
        onBack={() => setCurrentPage('landing')}
        onAddPrediction={async (prediction) => {
          const newPrediction: Prediction = {
            ...prediction,
            id: `pred-${Date.now()}`,
            status: 'pending'
          };
          const updatedPredictions = [...predictions, newPrediction];
          setPredictions(updatedPredictions);

          // Save to backend if authenticated
          if (accessToken) {
            try {
              await fetch(
                `https://${projectId}.supabase.co/functions/v1/make-server-a989b36a/predictions`,
                {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                  },
                  body: JSON.stringify({ prediction: newPrediction }),
                }
              );
            } catch (error) {
              console.error('Error saving prediction:', error);
            }
          }
        }}
      />
    );
  }

  if (currentPage === 'myTeams') {
    return (
      <MyTeams
        teams={teams}
        onBack={() => setCurrentPage('landing')}
        onCreateTeam={() => {
          setCurrentPage('landing');
          setTimeout(() => {
            const element = document.getElementById('tournaments-section');
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 100);
        }}
      />
    );
  }

  if (currentPage === 'skills' && selectedTournament && selectedPlayers.length > 0) {
    return (
      <SkillsSelection
        players={selectedPlayers}
        tournamentName={selectedTournament.name}
        onBack={() => setCurrentPage('teamCreation')}
        onComplete={async (assignments) => {
          // Create a new team
          const newTeam: Team = {
            id: `team-${Date.now()}`,
            tournamentName: selectedTournament.name,
            tournamentDate: selectedTournament.date,
            players: selectedPlayers,
            skillAssignments: assignments,
            createdAt: new Date(),
            status: 'current',
            points: 0,
            rank: teams.filter(t => t.status === 'current').length + 1
          };
          
          const updatedTeams = [...teams, newTeam];
          setTeams(updatedTeams);

          // Save to backend if authenticated
          if (accessToken) {
            try {
              await fetch(
                `https://${projectId}.supabase.co/functions/v1/make-server-a989b36a/teams`,
                {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                  },
                  body: JSON.stringify({ team: newTeam }),
                }
              );
            } catch (error) {
              console.error('Error saving team:', error);
            }
          }
          
          // Navigate to My Teams page to show the created team
          setCurrentPage('myTeams');
          setSelectedTournament(null);
          setSelectedPlayers([]);
        }}
      />
    );
  }

  if (currentPage === 'teamCreation' && selectedTournament) {
    return (
      <TeamCreation
        tournament={selectedTournament}
        onBack={() => {
          setCurrentPage('landing');
          setSelectedTournament(null);
        }}
        onContinue={(players) => {
          setSelectedPlayers(players);
          setCurrentPage('skills');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Skip Navigation */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-[var(--radius)]"
      >
        Skip to main content
      </a>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-lg border-b border-border/50 shadow-sm">
        <div className="flex items-center justify-between p-4 max-w-2xl mx-auto">
          <h1 className="text-foreground">Fantasy Tennis</h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-foreground hover:bg-primary-foreground/10 transition-colors" aria-label="Open main menu">
                {user ? (
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline">{(user.user_metadata && user.user_metadata.name) || user.email || 'User'}</span>
                  </div>
                ) : (
                  'Menu'
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {user ? (
                <>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              ) : (
                <>
                  <DropdownMenuItem onClick={() => {
                    setLoginMode('login');
                    setShowLogin(true);
                  }}>
                    Login
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => {
                    setLoginMode('signup');
                    setShowLogin(true);
                  }}>
                    Sign Up
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuItem onClick={handleViewLeaderboard}>
                <Award className="w-4 h-4 mr-2" />
                Leaderboard
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCurrentPage('howToPlay')}>How to Play</DropdownMenuItem>
              <DropdownMenuItem onClick={() => window.open('https://givebutter.com/xy27TW', '_blank')}>Donate</DropdownMenuItem>
              <DropdownMenuItem>Affiliates</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setCurrentPage('terms')}>Privacy, Terms & Conditions</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Hero Section */}
      <section id="main-content" aria-label="Hero" className="relative bg-background p-4 pb-8">
        <div className="max-w-2xl mx-auto">
          <div className="relative aspect-video bg-card rounded-[var(--radius)] overflow-hidden mb-4 shadow-[var(--elevation-md)]">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&q=80"
              alt="Tennis player in action"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <h2 className="text-card mb-2 drop-shadow-lg">Build Your Dream Team</h2>
              <p className="text-card/90 drop-shadow-md">Compete with friends and win big!</p>
            </div>
          </div>
          <Button 
            className="w-full bg-secondary text-secondary-foreground shadow-[var(--elevation-md)] hover:shadow-[var(--elevation-hover)] transition-all duration-300 hover:scale-[1.02] border-0"
            onClick={() => {
              const element = document.getElementById('tournaments-section');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
          >
            Create Your Team
          </Button>
        </div>
      </section>

      {/* How to Play */}
      <section aria-labelledby="how-to-play-heading" className="bg-card py-8 px-4">
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="flex justify-center mb-6">
            <h2 id="how-to-play-heading" className="bg-primary/10 rounded-full px-6 py-2 text-center">How to Play</h2>
          </div>
        
        <Card className="bg-card border-0 p-5 rounded-[var(--radius)] shadow-[var(--elevation-sm)] hover:shadow-[var(--elevation-md)] transition-all duration-300">
          <div className="flex items-start gap-4">
            <div className="bg-primary rounded-[calc(var(--radius)-4px)] p-3 shrink-0 shadow-sm" aria-hidden="true">
              <Trophy className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="mb-2">Pick your team</h3>
              <p className="text-card-foreground/70">
                Select the best players within your budget to create a winning lineup
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-card border-0 p-5 rounded-[var(--radius)] shadow-[var(--elevation-sm)] hover:shadow-[var(--elevation-md)] transition-all duration-300">
          <div className="flex items-start gap-4">
            <div className="bg-secondary rounded-[calc(var(--radius)-4px)] p-3 shrink-0 shadow-sm" aria-hidden="true">
              <Zap className="w-5 h-5 text-secondary-foreground" />
            </div>
            <div>
              <h3 className="mb-2">Assign skills</h3>
              <p className="text-card-foreground/70">
                Boost your players with special skills to maximize your team's potential
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-card border-0 p-5 rounded-[var(--radius)] shadow-[var(--elevation-sm)] hover:shadow-[var(--elevation-md)] transition-all duration-300">
          <div className="flex items-start gap-4">
            <div className="bg-chart-1 rounded-[calc(var(--radius)-4px)] p-3 shrink-0 shadow-sm" aria-hidden="true">
              <Target className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="mb-2">Make predictions</h3>
              <p className="text-card-foreground/70">
                Predict match outcomes to earn bonus points and climb the leaderboard
              </p>
            </div>
          </div>
        </Card>
        </div>
      </section>

      {/* Today's Matches */}
      <section aria-labelledby="todays-schedule-heading" className="p-4 max-w-2xl mx-auto">
        <div className="flex justify-center mb-6">
          <h2 id="todays-schedule-heading" className="bg-card rounded-full px-6 py-2 text-center">Today's Schedule</h2>
        </div>
        
        <div className="space-y-4">
          {/* Live Match */}
          <Card className="bg-card border-0 rounded-[var(--radius)] p-5 shadow-[var(--elevation-md)] ring-2 ring-destructive/20" aria-live="polite" aria-atomic="true">
            <div className="flex items-center justify-between mb-3">
              <Badge className="bg-destructive text-destructive-foreground border border-border">
                Live
              </Badge>
              <p className="text-card-foreground/60">{liveMatch.tournament}</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="flex-1">{liveMatch.player1}</p>
                <div className="flex gap-2" aria-label={`${liveMatch.player1} score`}>
                  {liveMatch.score1.map((score, i) => (
                    <span key={i} className="w-6 text-center">{score}</span>
                  ))}
                </div>
              </div>
              <div className="h-px bg-border" aria-hidden="true" />
              <div className="flex items-center justify-between">
                <p className="flex-1">{liveMatch.player2}</p>
                <div className="flex gap-2" aria-label={`${liveMatch.player2} score`}>
                  {liveMatch.score2.map((score, i) => (
                    <span key={i} className="w-6 text-center">{score}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-card-foreground/60 mb-2">Watch on:</p>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 border-border"
                  onClick={() => window.open('https://www.tennistv.com', '_blank')}
                >
                  Tennis TV
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 border-border"
                  onClick={() => window.open('https://www.tennischannel.com/', '_blank')}
                >
                  Tennis Channel Plus
                </Button>
              </div>
            </div>
          </Card>

          {/* Completed Match */}
          {completedMatches.map((match, idx) => (
            <Card key={idx} className="bg-accent/50 border-0 rounded-[var(--radius)] p-5 shadow-[var(--elevation-sm)]">
              <div className="flex items-center justify-between mb-3">
                <Badge variant="outline" className="border-border/50 bg-accent">
                  Completed
                </Badge>
                <p className="text-card-foreground/60">{match.time}</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="flex-1">{match.player1}</p>
                  <p dangerouslySetInnerHTML={{ __html: match.score1 }} />
                </div>
                <div className="h-px bg-border/30" />
                <div className="flex items-center justify-between">
                  <p className="flex-1 font-[var(--font-weight-bold)]">{match.player2}</p>
                  <p className="font-[var(--font-weight-bold)]" dangerouslySetInnerHTML={{ __html: match.score2 }} />
                </div>
              </div>
            </Card>
          ))}

          {/* Upcoming Matches */}
          {upcomingMatches.map((match, idx) => (
            <Card key={idx} className="bg-card border-0 rounded-[var(--radius)] p-5 shadow-[var(--elevation-sm)] hover:shadow-[var(--elevation-md)] transition-shadow duration-300">
              <div className="flex items-center justify-between mb-3">
                <Badge variant="outline" className="border-secondary/30 text-secondary bg-secondary/10">
                  Upcoming
                </Badge>
                <p className="text-card-foreground/60">{match.tournament}</p>
              </div>
              
              <div className="space-y-2">
                <p>{match.player1}</p>
                <p className="text-card-foreground/50 text-center">vs</p>
                <p>{match.player2}</p>
                <div className="pt-2 border-t border-border/30">
                  <p className="text-card-foreground/80">{match.time}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Button variant="outline" className="w-full mt-6 border-0 bg-card/50 shadow-[var(--elevation-sm)] hover:shadow-[var(--elevation-md)] transition-all duration-300" onClick={() => setCurrentPage('matches')}>
          View All Matches
        </Button>
      </section>

      {/* Upcoming Tournaments */}
      <section id="tournaments-section" aria-labelledby="tournaments-heading" className="bg-card py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-center mb-6">
            <h2 id="tournaments-heading" className="bg-primary/10 rounded-full px-6 py-2 text-center">Upcoming Tournaments</h2>
          </div>
        
          <div className="grid grid-cols-2 gap-4">
          {tournaments.map((tournament, idx) => (
            <button
              key={idx} 
              className="bg-card border-0 rounded-[var(--radius)] overflow-hidden hover:scale-[1.02] active:scale-95 transition-all duration-300 text-left shadow-[var(--elevation-md)] hover:shadow-[var(--elevation-hover)] group flex flex-col"
              onClick={() => requireAuth(() => {
                setSelectedTournament(tournament);
                setCurrentPage('teamCreation');
              })}
              aria-label={`Create team for ${tournament.name} tournament in ${tournament.location}, ${tournament.date}`}
            >
              <div className="aspect-square bg-primary/10 flex items-center justify-center relative overflow-hidden">
                <ImageWithFallback
                  src={
                    tournament.name === 'Vanda Pharmaceuticals Hellenic Championship' 
                      ? athensImage
                      : tournament.name === 'Moselle Open'
                      ? metzImage
                      : tournament.name === 'ATP Finals'
                      ? atpFinalsImage
                      : tournament.name === 'Australian Open'
                      ? australianOpenImage
                      : 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=400&q=80'
                  }
                  alt=""
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Badge 
                  className={`absolute top-3 right-3 ${
                    tournament.level === 'Grand Slam' ? 'bg-chart-5 text-white border-0 shadow-lg' :
                    tournament.level === '1000' ? 'bg-chart-2 text-white border-0 shadow-lg' :
                    tournament.level === '500' ? 'bg-secondary text-secondary-foreground border-0 shadow-lg' :
                    tournament.level === '250' ? 'bg-chart-1 text-white border-0 shadow-lg' :
                    'bg-accent text-accent-foreground border-border shadow-lg'
                  }`}
                >
                  {tournament.level}
                </Badge>
              </div>
              <div className="p-4">
                <h3 className="mb-1">{tournament.name}</h3>
                <p className="text-card-foreground/60 mb-1">{tournament.location}</p>
                <p className="text-card-foreground/70">{tournament.date}</p>
              </div>
            </button>
          ))}
          </div>
        </div>
      </section>

      {/* Leaderboard */}
      <section aria-labelledby="leaderboard-heading" className="p-4 pb-24 max-w-2xl mx-auto">
        <div className="flex justify-center mb-6">
          <h2 id="leaderboard-heading" className="bg-card rounded-full px-6 py-2 text-center">Leaderboard</h2>
        </div>
        
        <Card className="bg-card border-0 rounded-[var(--radius)] overflow-hidden shadow-[var(--elevation-md)]" role="table" aria-label="Team leaderboard">
          <div className="bg-accent/50 p-4 flex items-center" role="row">
            <div className="w-10" role="columnheader">
              <span className="sr-only">Rank</span>
            </div>
            <p className="flex-1" role="columnheader">Team Name</p>
            <p role="columnheader">Points</p>
          </div>
          
          {(leaderboardData.length > 0 ? leaderboardData.slice(0, 5) : leaderboard).map((user) => (
            <div
              key={user.rank}
              role="row"
              className={`p-4 flex items-center transition-colors hover:bg-accent/20 ${
                user.rank <= 3 ? 'bg-secondary/5' : ''
              }`}
            >
              <div className="w-10 flex items-center gap-2" role="cell">
                <div className={`flex items-center justify-center w-7 h-7 rounded-full ${
                  user.rank === 1 ? 'bg-chart-5 text-white' :
                  user.rank === 2 ? 'bg-secondary/30 text-secondary-foreground' :
                  user.rank === 3 ? 'bg-chart-1/30 text-primary-foreground' :
                  ''
                }`}>
                  <span className="font-[var(--font-weight-bold)]">{user.rank}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-1" role="cell">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-sm" aria-hidden="true">
                  <span className="text-[12px]">{user.avatar}</span>
                </div>
                <p className={user.rank <= 3 ? 'font-[var(--font-weight-bold)]' : ''}>
                  {'totalPoints' in user ? user.name : user.name}
                </p>
              </div>
              <p className="font-[var(--font-weight-bold)]" role="cell">{('totalPoints' in user ? user.totalPoints : user.points).toLocaleString()}</p>
            </div>
          ))}
        </Card>

        <Button 
          onClick={handleViewLeaderboard}
          className="w-full mt-6 bg-secondary text-secondary-foreground border-0 min-h-[44px] shadow-[var(--elevation-md)] hover:shadow-[var(--elevation-hover)] transition-all duration-300 hover:scale-[1.02]"
        >
          View Full Leaderboard
        </Button>
      </section>

      {/* Bottom Navigation */}
      <nav aria-label="Main navigation" className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border/50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <div className="flex">
          <button 
            className={`flex-1 flex flex-col items-center gap-1 py-3 transition-all duration-200 min-h-[44px] ${
              currentPage === 'landing' ? 'text-primary scale-105' : 'text-card-foreground/60 hover:text-primary'
            }`}
            aria-label="Home"
            aria-current={currentPage === 'landing' ? 'page' : undefined}
          >
            <Trophy className="w-5 h-5" aria-hidden="true" />
            <span className="text-[10px]">Home</span>
          </button>
          <button 
            className={`flex-1 flex flex-col items-center gap-1 py-3 relative transition-all duration-200 min-h-[44px] ${
              currentPage === 'myTeams' ? 'text-primary scale-105' : 'text-card-foreground/60 hover:text-primary'
            }`}
            onClick={() => requireAuth(() => setCurrentPage('myTeams'))}
            aria-label={teams.length > 0 ? `My Teams (${teams.length} team${teams.length !== 1 ? 's' : ''})` : 'My Teams'}
            aria-current={currentPage === 'myTeams' ? 'page' : undefined}
          >
            <Target className="w-5 h-5" aria-hidden="true" />
            <span className="text-[10px]">My Teams</span>
            {teams.length > 0 && (
              <div className="absolute top-2 right-1/4 w-2 h-2 bg-destructive rounded-full shadow-sm animate-pulse" aria-hidden="true" />
            )}
          </button>
          <button 
            className={`flex-1 flex flex-col items-center gap-1 py-3 transition-all duration-200 min-h-[44px] ${
              currentPage === 'matches' ? 'text-secondary scale-105' : 'text-card-foreground/60 hover:text-primary'
            }`}
            onClick={() => setCurrentPage('matches')}
            aria-label="Matches"
            aria-current={currentPage === 'matches' ? 'page' : undefined}
          >
            <Zap className="w-5 h-5" aria-hidden="true" />
            <span className="text-[10px]">Matches</span>
          </button>
          <button 
            className={`flex-1 flex flex-col items-center gap-1 py-3 relative transition-all duration-200 min-h-[44px] ${
              currentPage === 'predictions' ? 'text-primary scale-105' : 'text-card-foreground/60 hover:text-primary'
            }`}
            onClick={() => requireAuth(() => setCurrentPage('predictions'))}
            aria-label={predictions.filter(p => p.status === 'pending').length > 0 ? `Predictions (${predictions.filter(p => p.status === 'pending').length} pending)` : 'Predictions'}
            aria-current={currentPage === 'predictions' ? 'page' : undefined}
          >
            <TrendingUp className="w-5 h-5" aria-hidden="true" />
            <span className="text-[10px]">Predictions</span>
            {predictions.filter(p => p.status === 'pending').length > 0 && (
              <div className="absolute top-2 right-1/4 w-2 h-2 bg-secondary rounded-full shadow-sm animate-pulse" aria-hidden="true" />
            )}
          </button>
        </div>
        <div className="h-1 bg-primary/20 mx-auto" style={{ width: '120px', borderRadius: 'var(--radius)' }} />
      </nav>

      {/* Login Modal */}
      {showLogin && (
        <Login
          onLoginSuccess={handleLoginSuccess}
          onClose={() => setShowLogin(false)}
          initialMode={loginMode}
        />
      )}

      {/* Seed Button for Testing */}
      <SeedButton />

      {/* Toast Notifications */}
      <Toaster />
    </div>
  );
}
