# Fantasy Tennis Leaderboard System

## Overview
The leaderboard system tracks user performance across tournaments throughout the season. Users create teams, compete in tournaments, and earn points that contribute to their season-long standings.

## Database Structure (KV Store)

### Tournament Performances
**Key Format:** `tournament_performance:{userId}:{tournamentId}`

**Data Structure:**
```json
{
  "userId": "user-id",
  "userName": "User Name",
  "userEmail": "user@example.com",
  "avatar": "🎾",
  "tournamentId": "tournament-id",
  "tournamentName": "Tournament Name",
  "tournamentDate": "Date Range",
  "points": 2847,
  "rank": 1,
  "totalParticipants": 45,
  "team": {
    "name": "Team Name",
    "players": [
      {
        "name": "Player Name",
        "country": "🇺🇸",
        "tier": 1,
        "price": 28
      }
    ]
  }
}
```

### User Teams
**Key Format:** `teams:{userId}`

**Data Structure:**
```json
[
  {
    "id": "team-123",
    "tournamentName": "Tournament Name",
    "tournamentDate": "Date Range",
    "players": [...],
    "skillAssignments": {...},
    "createdAt": "2024-11-01T00:00:00.000Z",
    "status": "current" | "past",
    "points": 2847,
    "rank": 1
  }
]
```

## API Endpoints

### GET `/make-server-a989b36a/leaderboard`
Returns season-long standings aggregated from all tournament performances.

**Response:**
```json
{
  "leaderboard": [
    {
      "userId": "user-id",
      "name": "User Name",
      "email": "user@example.com",
      "avatar": "🎾",
      "totalPoints": 12816,
      "tournamentsPlayed": 5,
      "rank": 1,
      "tournaments": [...]
    }
  ]
}
```

### GET `/make-server-a989b36a/profile/:userId`
Returns detailed profile for a specific user including all tournament history.

**Response:**
```json
{
  "profile": {
    "userId": "user-id",
    "name": "User Name",
    "email": "user@example.com",
    "avatar": "🎾",
    "totalPoints": 12816,
    "tournamentsPlayed": 5,
    "seasonRank": 1,
    "tournaments": [...]
  }
}
```

### POST `/make-server-a989b36a/tournament-performance` (Auth Required)
Saves a completed tournament performance for a user.

**Request:**
```json
{
  "performance": {
    "tournamentId": "tournament-id",
    "tournamentName": "Tournament Name",
    "tournamentDate": "Date Range",
    "points": 2847,
    "rank": 1,
    "totalParticipants": 45,
    "team": {...}
  }
}
```

### POST `/make-server-a989b36a/complete-tournament` (Auth Required)
Simulates tournament completion by calculating points and rank for a team.

**Request:**
```json
{
  "teamId": "team-123",
  "tournamentId": "tournament-id"
}
```

**Response:**
```json
{
  "success": true,
  "performance": {...},
  "message": "Tournament completed! You ranked #1 with 2847 points"
}
```

### POST `/make-server-a989b36a/seed`
Seeds the database with test data (development only).

**Response:**
```json
{
  "success": true,
  "message": "Database seeded successfully",
  "performancesCreated": 12
}
```

## Mock Data

The system includes pre-seeded data for testing:

### Lee Wilson (lee.wilson@mailinator.com)
- **Total Points:** 12,816
- **Tournaments Played:** 5
- **Season Rank:** #1

**Tournament History:**
1. Athens Championship - Rank #1 (2,847 points)
2. Moselle Open - Rank #3 (2,243 points)
3. ATP Finals - Rank #2 (3,156 points)
4. Paris Masters - Rank #5 (2,678 points)
5. Vienna Open - Rank #8 (1,892 points)

### Other Test Users
- Sarah Johnson - 2 tournaments, 5,699 points
- Mike Chen - 2 tournaments, 4,788 points
- Emma Davis - 2 tournaments, 5,364 points
- James Smith - 2 tournaments, 4,465 points

## How to Use

### 1. Seed Test Data
Click the "Seed Test Data" button in the bottom-right corner of the landing page. This will:
- Create tournament performance records for all test users
- Populate the leaderboard with realistic data
- Show Lee Wilson at the top of the standings

### 2. View Leaderboard
- Click "View Full Leaderboard" button on the landing page
- Or select "Leaderboard" from the main menu (hamburger icon)
- Shows all users ranked by total points across all tournaments

### 3. View User Profiles
- Click on any user in the leaderboard
- See their tournament history, stats, and team compositions
- View detailed performance breakdown for each tournament

### 4. Create and Complete Tournaments (Future)
- Users create teams for tournaments
- When tournaments end, call `/complete-tournament` endpoint
- System calculates points and updates leaderboard automatically

## Scoring System

Points are currently calculated based on:
- Team composition (player prices)
- Random performance factor (70-130% multiplier)
- Skill assignments (future implementation)

In production, points would be based on:
- Actual player performance in matches
- Skill bonuses (aces, break points, etc.)
- Tournament progression
- Head-to-head matchups

## Navigation Flow

1. **Landing Page** → Shows top 5 leaderboard entries
2. **"View Full Leaderboard"** → Full season standings
3. **Click User** → User profile with tournament history
4. **Main Menu** → Quick access to leaderboard from anywhere

## Components

- `FullLeaderboard.tsx` - Season standings page
- `UserProfile.tsx` - Individual user tournament history
- `SeedButton.tsx` - Development tool to populate test data
- Backend in `/supabase/functions/server/`
  - `index.tsx` - API endpoints
  - `seed.tsx` - Test data definitions
