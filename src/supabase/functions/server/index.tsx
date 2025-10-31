import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { createClient } from "npm:@supabase/supabase-js@2";
import { seedData } from "./seed.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-a989b36a/health", (c) => {
  return c.json({ status: "ok" });
});

// Seed database endpoint (for testing)
app.post("/make-server-a989b36a/seed", async (c) => {
  try {
    // Seed Lee Wilson's performances
    for (const perf of seedData.leeWilsonPerformances) {
      const key = `tournament_performance:lee-wilson-user-id:${perf.tournamentId}`;
      await kv.set(key, JSON.stringify({
        userId: 'lee-wilson-user-id',
        userName: 'Lee Wilson',
        userEmail: 'lee.wilson@mailinator.com',
        avatar: '🎾',
        ...perf
      }));
    }

    // Seed other users' performances
    for (const perf of seedData.otherPerformances) {
      const key = `tournament_performance:${perf.userId}:${perf.tournamentId}`;
      await kv.set(key, JSON.stringify(perf));
    }

    return c.json({ 
      success: true, 
      message: 'Database seeded successfully',
      performancesCreated: seedData.leeWilsonPerformances.length + seedData.otherPerformances.length
    });
  } catch (error) {
    console.log(`Server error seeding database: ${error}`);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Clear all tournament performances (for testing)
app.delete("/make-server-a989b36a/clear-performances", async (c) => {
  try {
    const allPerformances = await kv.getByPrefix('tournament_performance:');
    const keys = [];
    
    // Extract keys from the data
    for (const perfData of allPerformances) {
      const perf = JSON.parse(perfData);
      const key = `tournament_performance:${perf.userId}:${perf.tournamentId}`;
      keys.push(key);
    }
    
    // Delete all performance records
    if (keys.length > 0) {
      await kv.mdel(keys);
    }

    return c.json({ 
      success: true, 
      message: 'All tournament performances cleared',
      deletedCount: keys.length
    });
  } catch (error) {
    console.log(`Server error clearing performances: ${error}`);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Signup endpoint
app.post("/make-server-a989b36a/signup", async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, phone, name } = body;

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      phone,
      user_metadata: { name },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true,
      phone_confirm: true,
    });

    if (error) {
      console.log(`Error creating user during signup: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ success: true, user: data.user });
  } catch (error) {
    console.log(`Server error during signup: ${error}`);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Save team endpoint (requires auth)
app.post("/make-server-a989b36a/teams", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );
    
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const body = await c.req.json();
    const { team } = body;

    // Get existing teams
    const existingTeamsData = await kv.get(`teams:${user.id}`);
    const existingTeams = existingTeamsData ? JSON.parse(existingTeamsData) : [];

    // Add new team
    existingTeams.push(team);

    // Save updated teams
    await kv.set(`teams:${user.id}`, JSON.stringify(existingTeams));

    return c.json({ success: true, teams: existingTeams });
  } catch (error) {
    console.log(`Server error saving team: ${error}`);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Get teams endpoint (requires auth)
app.get("/make-server-a989b36a/teams", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );
    
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const teamsData = await kv.get(`teams:${user.id}`);
    const teams = teamsData ? JSON.parse(teamsData) : [];

    return c.json({ teams });
  } catch (error) {
    console.log(`Server error fetching teams: ${error}`);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Save prediction endpoint (requires auth)
app.post("/make-server-a989b36a/predictions", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );
    
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const body = await c.req.json();
    const { prediction } = body;

    // Get existing predictions
    const existingPredictionsData = await kv.get(`predictions:${user.id}`);
    const existingPredictions = existingPredictionsData ? JSON.parse(existingPredictionsData) : [];

    // Update or add prediction
    const existingIndex = existingPredictions.findIndex((p: any) => p.matchId === prediction.matchId);
    if (existingIndex >= 0) {
      existingPredictions[existingIndex] = prediction;
    } else {
      existingPredictions.push(prediction);
    }

    // Save updated predictions
    await kv.set(`predictions:${user.id}`, JSON.stringify(existingPredictions));

    return c.json({ success: true, predictions: existingPredictions });
  } catch (error) {
    console.log(`Server error saving prediction: ${error}`);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Get predictions endpoint (requires auth)
app.get("/make-server-a989b36a/predictions", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );
    
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const predictionsData = await kv.get(`predictions:${user.id}`);
    const predictions = predictionsData ? JSON.parse(predictionsData) : [];

    return c.json({ predictions });
  } catch (error) {
    console.log(`Server error fetching predictions: ${error}`);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Get season leaderboard endpoint (public)
app.get("/make-server-a989b36a/leaderboard", async (c) => {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Get all user tournament performances from KV store
    const allKeys = await kv.getByPrefix('tournament_performance:');
    
    // Aggregate points by user
    const userStats: { [userId: string]: any } = {};
    
    for (const perfData of allKeys) {
      const perf = JSON.parse(perfData);
      
      if (!userStats[perf.userId]) {
        userStats[perf.userId] = {
          userId: perf.userId,
          name: perf.userName,
          email: perf.userEmail,
          avatar: perf.avatar || '🎾',
          totalPoints: 0,
          tournamentsPlayed: 0,
          tournaments: []
        };
      }
      
      userStats[perf.userId].totalPoints += perf.points;
      userStats[perf.userId].tournamentsPlayed += 1;
      userStats[perf.userId].tournaments.push(perf);
    }
    
    // Convert to array and sort by total points
    const leaderboard = Object.values(userStats)
      .sort((a: any, b: any) => b.totalPoints - a.totalPoints)
      .map((user: any, index) => ({
        ...user,
        rank: index + 1
      }));

    return c.json({ leaderboard });
  } catch (error) {
    console.log(`Server error fetching leaderboard: ${error}`);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Get user profile endpoint (public)
app.get("/make-server-a989b36a/profile/:userId", async (c) => {
  try {
    const userId = c.req.param('userId');
    
    // Get all tournament performances for this user
    const allPerformances = await kv.getByPrefix(`tournament_performance:${userId}:`);
    
    if (allPerformances.length === 0) {
      return c.json({ error: 'User not found' }, 404);
    }
    
    const tournaments = allPerformances.map(data => JSON.parse(data));
    const totalPoints = tournaments.reduce((sum, t) => sum + t.points, 0);
    
    // Get user's rank in season leaderboard
    const allKeys = await kv.getByPrefix('tournament_performance:');
    const userStats: { [userId: string]: number } = {};
    
    for (const perfData of allKeys) {
      const perf = JSON.parse(perfData);
      if (!userStats[perf.userId]) {
        userStats[perf.userId] = 0;
      }
      userStats[perf.userId] += perf.points;
    }
    
    const sortedUsers = Object.entries(userStats)
      .sort(([, a], [, b]) => b - a);
    
    const seasonRank = sortedUsers.findIndex(([id]) => id === userId) + 1;
    
    const firstTournament = tournaments[0];
    
    const profile = {
      userId,
      name: firstTournament.userName,
      email: firstTournament.userEmail,
      avatar: firstTournament.avatar || '🎾',
      totalPoints,
      tournamentsPlayed: tournaments.length,
      seasonRank,
      tournaments: tournaments.sort((a, b) => 
        new Date(b.tournamentDate).getTime() - new Date(a.tournamentDate).getTime()
      )
    };

    return c.json({ profile });
  } catch (error) {
    console.log(`Server error fetching user profile: ${error}`);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Save tournament performance endpoint (requires auth)
app.post("/make-server-a989b36a/tournament-performance", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );
    
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const body = await c.req.json();
    const { performance } = body;

    // Store tournament performance
    const key = `tournament_performance:${user.id}:${performance.tournamentId}`;
    await kv.set(key, JSON.stringify({
      userId: user.id,
      userName: user.user_metadata?.name || user.email,
      userEmail: user.email,
      avatar: performance.avatar || '🎾',
      ...performance
    }));

    return c.json({ success: true });
  } catch (error) {
    console.log(`Server error saving tournament performance: ${error}`);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Complete tournament endpoint - simulates tournament completion with scoring (requires auth)
app.post("/make-server-a989b36a/complete-tournament", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );
    
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const body = await c.req.json();
    const { teamId, tournamentId } = body;

    // Get the team
    const teamsData = await kv.get(`teams:${user.id}`);
    const teams = teamsData ? JSON.parse(teamsData) : [];
    const team = teams.find((t: any) => t.id === teamId);

    if (!team) {
      return c.json({ error: 'Team not found' }, 404);
    }

    // Calculate points (simplified - random based on team quality)
    // In a real app, this would be based on actual player performance
    const basePoints = team.players.reduce((sum: number, p: any) => sum + p.price * 20, 0);
    const randomFactor = 0.7 + (Math.random() * 0.6); // 70% to 130%
    const points = Math.floor(basePoints * randomFactor);

    // Get all performances for this tournament to determine rank
    const allTournamentPerfs = await kv.getByPrefix(`tournament_performance:`);
    const tournamentPerfs = allTournamentPerfs
      .map(data => JSON.parse(data))
      .filter((p: any) => p.tournamentId === tournamentId);
    
    // Simple ranking - higher is better
    const betterPerformances = tournamentPerfs.filter((p: any) => p.points > points);
    const rank = betterPerformances.length + 1;
    const totalParticipants = tournamentPerfs.length + 1;

    // Create performance record
    const performance = {
      userId: user.id,
      userName: user.user_metadata?.name || user.email,
      userEmail: user.email,
      avatar: '🎾',
      tournamentId,
      tournamentName: team.tournamentName,
      tournamentDate: team.tournamentDate,
      points,
      rank,
      totalParticipants,
      team: {
        name: `Team ${team.id.slice(-6)}`,
        players: team.players.map((p: any) => ({
          name: p.name,
          country: p.country,
          tier: p.tier,
          price: p.price
        }))
      }
    };

    // Store tournament performance
    const key = `tournament_performance:${user.id}:${tournamentId}`;
    await kv.set(key, JSON.stringify(performance));

    // Update team status to past
    const updatedTeams = teams.map((t: any) => 
      t.id === teamId 
        ? { ...t, status: 'past', points, rank }
        : t
    );
    await kv.set(`teams:${user.id}`, JSON.stringify(updatedTeams));

    return c.json({ 
      success: true, 
      performance,
      message: `Tournament completed! You ranked #${rank} with ${points} points` 
    });
  } catch (error) {
    console.log(`Server error completing tournament: ${error}`);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

Deno.serve(app.fetch);