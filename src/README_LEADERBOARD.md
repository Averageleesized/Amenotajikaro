# Fantasy Tennis Leaderboard - Quick Start Guide

## 🎾 What's New

The Fantasy Tennis app now has a **full leaderboard system** that tracks player performance across tournaments throughout the season!

## 🚀 Quick Start - Testing the Leaderboard

### Step 1: Seed the Database
1. Open the app
2. Look for the **"Seed Test Data"** button in the bottom-right corner
3. Click it to populate the database with mock tournament data
4. Wait for the success message
5. The page will automatically reload

### Step 2: View the Leaderboard
You have three ways to access the leaderboard:

**Option 1:** Landing Page
- Scroll to the "Season Leaderboard" section
- See the top 5 players
- Click "View Full Leaderboard"

**Option 2:** Main Menu
- Click the menu icon (top-right)
- Select "Leaderboard"

**Option 3:** Navigation
- Click any user name in the top 5 to see their full profile

### Step 3: Explore User Profiles
1. Click on any user in the leaderboard (try "Lee Wilson")
2. See their:
   - Total points and season rank
   - Tournament history
   - Team compositions for each tournament
   - Performance stats (best finish, avg points, etc.)

## 📊 Mock Data Included

The seed data includes:

### 🏆 Lee Wilson (lee.wilson@mailinator.com) - #1 Overall
- **12,816 total points** from 5 tournaments
- Athens Championship: #1 (2,847 pts)
- ATP Finals: #2 (3,156 pts)
- Moselle Open: #3 (2,243 pts)
- Paris Masters: #5 (2,678 pts)
- Vienna Open: #8 (1,892 pts)

### Other Players:
- **Sarah Johnson**: 5,699 points (#2)
- **Mike Chen**: 4,788 points (#3)
- **Emma Davis**: 5,364 points (#4)
- **James Smith**: 4,465 points (#5)

## 🔄 How It Works

### For Users:
1. **Create a Team** for an upcoming tournament
2. **Select 6 Players** within the $100 budget
3. **Assign Skills** to each player
4. **Wait for Tournament to Complete**
5. **Earn Points** based on player performance
6. **Climb the Leaderboard**!

### Behind the Scenes:
- Each tournament completion creates a **performance record**
- Performance records store: points, rank, team composition
- The leaderboard **aggregates all performances** across tournaments
- Users are ranked by **total points** earned across all tournaments
- Clicking a user shows their **complete tournament history**

## 🛠️ For Development

### Key Files Created:

**Frontend Components:**
- `/components/FullLeaderboard.tsx` - Season standings page
- `/components/UserProfile.tsx` - User tournament history
- `/components/SeedButton.tsx` - Seed test data button

**Backend:**
- `/supabase/functions/server/seed.tsx` - Mock data definitions
- `/supabase/functions/server/index.tsx` - API endpoints added

**New API Endpoints:**
```
GET  /leaderboard              - Get season standings
GET  /profile/:userId          - Get user tournament history
POST /tournament-performance   - Save tournament result (auth)
POST /complete-tournament      - Complete tournament for team (auth)
POST /seed                     - Seed test data (dev)
DELETE /clear-performances     - Clear all data (dev)
```

### Database Structure (KV Store):

**Tournament Performances:**
```
Key: tournament_performance:{userId}:{tournamentId}
Value: {
  userId, userName, userEmail, avatar,
  tournamentId, tournamentName, tournamentDate,
  points, rank, totalParticipants,
  team: { name, players: [...] }
}
```

### Testing Different Scenarios:

**Scenario 1: Fresh Start**
1. Clear browser cache
2. Click "Seed Test Data"
3. View leaderboard

**Scenario 2: Add Your Own Performance**
1. Create a team (requires login)
2. Complete a tournament
3. See yourself on the leaderboard

**Scenario 3: Clear All Data**
- Use the `/clear-performances` endpoint
- Start fresh

## 📱 Navigation Flow

```
Landing Page
    ├── View Full Leaderboard → Full Season Standings
    │                              └── Click User → User Profile
    │                                                   └── Back → Leaderboard
    └── Menu → Leaderboard → Full Season Standings
                                └── Click User → User Profile
                                                    └── Back → Leaderboard
```

## 🎨 Design System

All components use the CSS variables from your design system:
- Colors: `var(--primary)`, `var(--secondary)`, etc.
- Typography: Nunito font family
- Spacing: `var(--spacing-*)` 
- Borders: `var(--border-width-*)`, `var(--radius-*)`
- Elevation: `var(--elevation-*)`

## 🔐 Authentication Integration

The leaderboard works for both:
- **Logged-out users**: Can view leaderboard and profiles
- **Logged-in users**: Can create teams and compete

When a user completes a tournament:
1. Their performance is saved with their user ID
2. Leaderboard automatically updates
3. They can view their ranking and history

## 🧪 Next Steps

To make this production-ready:

1. **Real Scoring**: Calculate points from actual player performance
2. **Live Updates**: Use WebSockets for real-time leaderboard updates
3. **Filtering**: Filter by tournament, date range, etc.
4. **Achievements**: Add badges for milestones
5. **Social Features**: Follow users, compare stats
6. **Tournament Details**: Link to match results and highlights

## 💡 Tips

- **The leaderboard loads on app start** - no need to click anything
- **Landing page shows top 5** - full leaderboard shows everyone
- **User profiles are public** - anyone can view any player's history
- **Points accumulate** - higher total points = higher rank
- **Tournaments played matters** - shows consistency

## 🐛 Troubleshooting

**Leaderboard is empty?**
- Click "Seed Test Data" button

**Button not appearing?**
- Check bottom-right corner of the screen
- Try scrolling down

**Data not loading?**
- Check browser console for errors
- Ensure backend is running
- Try refreshing the page

**Wrong data showing?**
- Clear and reseed using the clear endpoint
- Or refresh your browser

---

**Ready to compete?** Click "Seed Test Data" and explore the leaderboard! 🎾🏆
