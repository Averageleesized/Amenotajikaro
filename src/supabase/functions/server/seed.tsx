// Seed data for testing leaderboard
export const seedData = {
  users: [
    {
      userId: 'lee-wilson-user-id',
      email: 'lee.wilson@mailinator.com',
      name: 'Lee Wilson',
      avatar: '🎾'
    },
    {
      userId: 'user-2',
      email: 'sarah.johnson@example.com',
      name: 'Sarah Johnson',
      avatar: '🏆'
    },
    {
      userId: 'user-3',
      email: 'mike.chen@example.com',
      name: 'Mike Chen',
      avatar: '⚡'
    },
    {
      userId: 'user-4',
      email: 'emma.davis@example.com',
      name: 'Emma Davis',
      avatar: '💪'
    },
    {
      userId: 'user-5',
      email: 'james.smith@example.com',
      name: 'James Smith',
      avatar: '🔥'
    }
  ],
  
  tournaments: [
    {
      tournamentId: 'athens-2024',
      tournamentName: 'Vanda Pharmaceuticals Hellenic Championship',
      tournamentDate: 'Nov 2-8, 2024',
      size: 32,
      level: '250'
    },
    {
      tournamentId: 'metz-2024',
      tournamentName: 'Moselle Open',
      tournamentDate: 'Nov 2-8, 2024',
      size: 32,
      level: '250'
    },
    {
      tournamentId: 'atp-finals-2024',
      tournamentName: 'ATP Finals',
      tournamentDate: 'Nov 9-16, 2024',
      size: 128,
      level: '500'
    },
    {
      tournamentId: 'paris-masters-2024',
      tournamentName: 'Paris Masters',
      tournamentDate: 'Oct 28-Nov 3, 2024',
      size: 64,
      level: '1000'
    },
    {
      tournamentId: 'vienna-2024',
      tournamentName: 'Erste Bank Open',
      tournamentDate: 'Oct 21-27, 2024',
      size: 32,
      level: '500'
    }
  ],

  // Lee Wilson's tournament performances
  leeWilsonPerformances: [
    {
      tournamentId: 'athens-2024',
      tournamentName: 'Vanda Pharmaceuticals Hellenic Championship',
      tournamentDate: 'Nov 2-8, 2024',
      points: 2847,
      rank: 1,
      totalParticipants: 45,
      team: {
        name: 'Athens Warriors',
        players: [
          { name: 'N. Djokovic', country: '🇷🇸', tier: 1, price: 28 },
          { name: 'C. Alcaraz', country: '🇪🇸', tier: 1, price: 26 },
          { name: 'D. Medvedev', country: '🇷🇺', tier: 2, price: 18 },
          { name: 'S. Tsitsipas', country: '🇬🇷', tier: 3, price: 12 },
          { name: 'A. Rublev', country: '🇷🇺', tier: 4, price: 9 },
          { name: 'T. Fritz', country: '🇺🇸', tier: 5, price: 7 }
        ]
      }
    },
    {
      tournamentId: 'metz-2024',
      tournamentName: 'Moselle Open',
      tournamentDate: 'Nov 2-8, 2024',
      points: 2243,
      rank: 3,
      totalParticipants: 52,
      team: {
        name: 'Metz Masters',
        players: [
          { name: 'J. Sinner', country: '🇮🇹', tier: 1, price: 27 },
          { name: 'D. Medvedev', country: '🇷🇺', tier: 1, price: 25 },
          { name: 'A. Zverev', country: '🇩🇪', tier: 2, price: 17 },
          { name: 'H. Rune', country: '🇩🇰', tier: 3, price: 13 },
          { name: 'F. Auger-Aliassime', country: '🇨🇦', tier: 4, price: 10 },
          { name: 'C. Ruud', country: '🇳🇴', tier: 5, price: 8 }
        ]
      }
    },
    {
      tournamentId: 'atp-finals-2024',
      tournamentName: 'ATP Finals',
      tournamentDate: 'Nov 9-16, 2024',
      points: 3156,
      rank: 2,
      totalParticipants: 128,
      team: {
        name: 'Finals Force',
        players: [
          { name: 'C. Alcaraz', country: '🇪🇸', tier: 1, price: 29 },
          { name: 'N. Djokovic', country: '🇷🇸', tier: 1, price: 28 },
          { name: 'J. Sinner', country: '🇮🇹', tier: 2, price: 16 },
          { name: 'S. Tsitsipas', country: '🇬🇷', tier: 3, price: 11 },
          { name: 'A. Rublev', country: '🇷🇺', tier: 4, price: 9 },
          { name: 'H. Hurkacz', country: '🇵🇱', tier: 5, price: 7 }
        ]
      }
    },
    {
      tournamentId: 'paris-masters-2024',
      tournamentName: 'Paris Masters',
      tournamentDate: 'Oct 28-Nov 3, 2024',
      points: 2678,
      rank: 5,
      totalParticipants: 87,
      team: {
        name: 'Paris Power',
        players: [
          { name: 'D. Medvedev', country: '🇷🇺', tier: 1, price: 27 },
          { name: 'A. Zverev', country: '🇩🇪', tier: 1, price: 26 },
          { name: 'S. Tsitsipas', country: '🇬🇷', tier: 2, price: 15 },
          { name: 'T. Fritz', country: '🇺🇸', tier: 3, price: 12 },
          { name: 'H. Rune', country: '🇩🇰', tier: 4, price: 11 },
          { name: 'G. Dimitrov', country: '🇧🇬', tier: 5, price: 9 }
        ]
      }
    },
    {
      tournamentId: 'vienna-2024',
      tournamentName: 'Erste Bank Open',
      tournamentDate: 'Oct 21-27, 2024',
      points: 1892,
      rank: 8,
      totalParticipants: 64,
      team: {
        name: 'Vienna Victors',
        players: [
          { name: 'J. Sinner', country: '🇮🇹', tier: 1, price: 28 },
          { name: 'C. Alcaraz', country: '🇪🇸', tier: 1, price: 27 },
          { name: 'A. Rublev', country: '🇷🇺', tier: 2, price: 14 },
          { name: 'C. Ruud', country: '🇳🇴', tier: 3, price: 13 },
          { name: 'F. Auger-Aliassime', country: '🇨🇦', tier: 4, price: 10 },
          { name: 'B. Shelton', country: '🇺🇸', tier: 5, price: 8 }
        ]
      }
    }
  ],

  // Other users' performances
  otherPerformances: [
    // Sarah Johnson
    {
      userId: 'user-2',
      userName: 'Sarah Johnson',
      userEmail: 'sarah.johnson@example.com',
      avatar: '🏆',
      tournamentId: 'athens-2024',
      tournamentName: 'Vanda Pharmaceuticals Hellenic Championship',
      tournamentDate: 'Nov 2-8, 2024',
      points: 2765,
      rank: 2,
      totalParticipants: 45,
      team: {
        name: 'Greek Gods',
        players: [
          { name: 'C. Alcaraz', country: '🇪🇸', tier: 1, price: 26 },
          { name: 'J. Sinner', country: '🇮🇹', tier: 1, price: 27 },
          { name: 'A. Zverev', country: '🇩🇪', tier: 2, price: 17 },
          { name: 'S. Tsitsipas', country: '🇬🇷', tier: 3, price: 12 },
          { name: 'H. Rune', country: '🇩🇰', tier: 4, price: 10 },
          { name: 'T. Fritz', country: '🇺🇸', tier: 5, price: 8 }
        ]
      }
    },
    {
      userId: 'user-2',
      userName: 'Sarah Johnson',
      userEmail: 'sarah.johnson@example.com',
      avatar: '🏆',
      tournamentId: 'atp-finals-2024',
      tournamentName: 'ATP Finals',
      tournamentDate: 'Nov 9-16, 2024',
      points: 2934,
      rank: 4,
      totalParticipants: 128,
      team: {
        name: 'Finals Fury',
        players: [
          { name: 'N. Djokovic', country: '🇷🇸', tier: 1, price: 28 },
          { name: 'C. Alcaraz', country: '🇪🇸', tier: 1, price: 29 },
          { name: 'D. Medvedev', country: '🇷🇺', tier: 2, price: 18 },
          { name: 'A. Rublev', country: '🇷🇺', tier: 3, price: 11 },
          { name: 'H. Hurkacz', country: '🇵🇱', tier: 4, price: 8 },
          { name: 'C. Ruud', country: '🇳🇴', tier: 5, price: 6 }
        ]
      }
    },
    // Mike Chen
    {
      userId: 'user-3',
      userName: 'Mike Chen',
      userEmail: 'mike.chen@example.com',
      avatar: '⚡',
      tournamentId: 'metz-2024',
      tournamentName: 'Moselle Open',
      tournamentDate: 'Nov 2-8, 2024',
      points: 2601,
      rank: 1,
      totalParticipants: 52,
      team: {
        name: 'Lightning Strike',
        players: [
          { name: 'J. Sinner', country: '🇮🇹', tier: 1, price: 27 },
          { name: 'N. Djokovic', country: '🇷🇸', tier: 1, price: 28 },
          { name: 'A. Zverev', country: '🇩🇪', tier: 2, price: 17 },
          { name: 'S. Tsitsipas', country: '🇬🇷', tier: 3, price: 13 },
          { name: 'T. Fritz', country: '🇺🇸', tier: 4, price: 9 },
          { name: 'H. Rune', country: '🇩🇰', tier: 5, price: 6 }
        ]
      }
    },
    {
      userId: 'user-3',
      userName: 'Mike Chen',
      userEmail: 'mike.chen@example.com',
      avatar: '⚡',
      tournamentId: 'vienna-2024',
      tournamentName: 'Erste Bank Open',
      tournamentDate: 'Oct 21-27, 2024',
      points: 2187,
      rank: 3,
      totalParticipants: 64,
      team: {
        name: 'Vienna Veterans',
        players: [
          { name: 'C. Alcaraz', country: '🇪🇸', tier: 1, price: 27 },
          { name: 'D. Medvedev', country: '🇷🇺', tier: 1, price: 26 },
          { name: 'S. Tsitsipas', country: '🇬🇷', tier: 2, price: 15 },
          { name: 'A. Rublev', country: '🇷🇺', tier: 3, price: 14 },
          { name: 'F. Auger-Aliassime', country: '🇨🇦', tier: 4, price: 10 },
          { name: 'C. Ruud', country: '🇳🇴', tier: 5, price: 8 }
        ]
      }
    },
    // Emma Davis
    {
      userId: 'user-4',
      userName: 'Emma Davis',
      userEmail: 'emma.davis@example.com',
      avatar: '💪',
      tournamentId: 'paris-masters-2024',
      tournamentName: 'Paris Masters',
      tournamentDate: 'Oct 28-Nov 3, 2024',
      points: 2543,
      rank: 2,
      totalParticipants: 87,
      team: {
        name: 'Paris Predators',
        players: [
          { name: 'N. Djokovic', country: '🇷🇸', tier: 1, price: 28 },
          { name: 'J. Sinner', country: '🇮🇹', tier: 1, price: 27 },
          { name: 'D. Medvedev', country: '🇷🇺', tier: 2, price: 16 },
          { name: 'A. Zverev', country: '🇩🇪', tier: 3, price: 12 },
          { name: 'S. Tsitsipas', country: '🇬🇷', tier: 4, price: 10 },
          { name: 'H. Rune', country: '🇩🇰', tier: 5, price: 7 }
        ]
      }
    },
    {
      userId: 'user-4',
      userName: 'Emma Davis',
      userEmail: 'emma.davis@example.com',
      avatar: '💪',
      tournamentId: 'atp-finals-2024',
      tournamentName: 'ATP Finals',
      tournamentDate: 'Nov 9-16, 2024',
      points: 2821,
      rank: 6,
      totalParticipants: 128,
      team: {
        name: 'Finals Fighters',
        players: [
          { name: 'C. Alcaraz', country: '🇪🇸', tier: 1, price: 29 },
          { name: 'D. Medvedev', country: '🇷🇺', tier: 1, price: 25 },
          { name: 'A. Zverev', country: '🇩🇪', tier: 2, price: 18 },
          { name: 'A. Rublev', country: '🇷🇺', tier: 3, price: 11 },
          { name: 'T. Fritz', country: '🇺🇸', tier: 4, price: 10 },
          { name: 'C. Ruud', country: '🇳🇴', tier: 5, price: 7 }
        ]
      }
    },
    // James Smith
    {
      userId: 'user-5',
      userName: 'James Smith',
      userEmail: 'james.smith@example.com',
      avatar: '🔥',
      tournamentId: 'athens-2024',
      tournamentName: 'Vanda Pharmaceuticals Hellenic Championship',
      tournamentDate: 'Nov 2-8, 2024',
      points: 2498,
      rank: 4,
      totalParticipants: 45,
      team: {
        name: 'Athens Aces',
        players: [
          { name: 'D. Medvedev', country: '🇷🇺', tier: 1, price: 27 },
          { name: 'A. Zverev', country: '🇩🇪', tier: 1, price: 26 },
          { name: 'S. Tsitsipas', country: '🇬🇷', tier: 2, price: 16 },
          { name: 'A. Rublev', country: '🇷🇺', tier: 3, price: 13 },
          { name: 'H. Rune', country: '🇩🇰', tier: 4, price: 11 },
          { name: 'T. Fritz', country: '🇺🇸', tier: 5, price: 7 }
        ]
      }
    },
    {
      userId: 'user-5',
      userName: 'James Smith',
      userEmail: 'james.smith@example.com',
      avatar: '🔥',
      tournamentId: 'vienna-2024',
      tournamentName: 'Erste Bank Open',
      tournamentDate: 'Oct 21-27, 2024',
      points: 1967,
      rank: 7,
      totalParticipants: 64,
      team: {
        name: 'Vienna Venom',
        players: [
          { name: 'J. Sinner', country: '🇮🇹', tier: 1, price: 28 },
          { name: 'N. Djokovic', country: '🇷🇸', tier: 1, price: 27 },
          { name: 'D. Medvedev', country: '🇷🇺', tier: 2, price: 15 },
          { name: 'S. Tsitsipas', country: '🇬🇷', tier: 3, price: 12 },
          { name: 'A. Rublev', country: '🇷🇺', tier: 4, price: 10 },
          { name: 'F. Auger-Aliassime', country: '🇨🇦', tier: 5, price: 8 }
        ]
      }
    }
  ]
};
