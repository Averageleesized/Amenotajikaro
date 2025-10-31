import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient, SupabaseClient } from "npm:@supabase/supabase-js@2";

const app = new Hono();

app.use('*', logger(console.log));

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

const createSupabaseClient = () =>
  createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  );

const KNOWN_SKILLS = [
  { id: 'consecutive-games', name: 'Consecutive Games', description: 'Longest streak of consecutive games won.' },
  { id: 'return-games', name: 'Return Games Won', description: 'Performance on return games.' },
  { id: 'aces', name: 'Aces', description: 'Ability to serve aces consistently.' },
  { id: 'break-points', name: 'Break Points Saved', description: 'Skill at saving break points.' },
  { id: 'tiebreaks', name: 'Tiebreak Wins', description: 'Success rate in tiebreak situations.' },
  { id: 'winners', name: 'Winners', description: 'Capacity to hit winners under pressure.' },
];

const MONTH_INDEX: Record<string, number> = {
  jan: 1,
  feb: 2,
  mar: 3,
  apr: 4,
  may: 5,
  jun: 6,
  jul: 7,
  aug: 8,
  sep: 9,
  oct: 10,
  nov: 11,
  dec: 12,
};

let skillsSeeded = false;

interface PlayerPayload {
  id?: string | number;
  name: string;
  country?: string;
  ranking?: number;
  price?: number;
  tier?: number;
}

interface TeamPayload {
  id: string;
  tournamentId?: string;
  tournamentName?: string;
  tournamentDate?: string;
  players: PlayerPayload[];
  skillAssignments?: Record<string, string>;
  createdAt?: string | Date;
  status?: 'current' | 'past';
  points?: number;
  rank?: number;
  name?: string;
}

interface PredictionPayload {
  id: string;
  matchId: string;
  player1: string;
  player2: string;
  tournament?: string;
  selectedPlayer: string;
  date?: string;
  time?: string;
  status?: 'pending' | 'completed';
  totalVotes?: number;
  player1Votes?: number;
  player2Votes?: number;
  pointsEarned?: number;
  isCorrect?: boolean;
  round?: string;
}

interface PerformancePayload {
  tournamentId?: string;
  tournamentName?: string;
  tournamentDate?: string;
  points: number;
  rank?: number;
  totalParticipants?: number;
  team?: any;
  avatar?: string;
}

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    || `item-${crypto.randomUUID()}`;

const toDateString = (date: Date | null) => date ? date.toISOString().slice(0, 10) : null;

const parseDatePart = (text: string, year: number, fallbackMonth?: number) => {
  const trimmed = text.trim();
  const match = trimmed.match(/^([A-Za-z]+)\s+(\d{1,2})$/);
  if (match) {
    const month = MONTH_INDEX[match[1].slice(0, 3).toLowerCase()];
    if (month) {
      return new Date(Date.UTC(year, month - 1, Number(match[2])));
    }
  }
  const dayOnly = trimmed.match(/^(\d{1,2})$/);
  if (dayOnly && fallbackMonth) {
    return new Date(Date.UTC(year, fallbackMonth - 1, Number(dayOnly[1])));
  }
  return null;
};

const parseTournamentDateRange = (display?: string) => {
  if (!display) {
    return { startDate: null, endDate: null };
  }
  const yearMatch = display.match(/(\d{4})/);
  if (!yearMatch) {
    return { startDate: null, endDate: null };
  }
  const year = Number(yearMatch[1]);
  const withoutYear = display.replace(`, ${year}`, '');
  const [startRaw, endRaw] = withoutYear.split('-').map((part) => part?.trim() ?? '');
  const startDateObj = startRaw ? parseDatePart(startRaw, year) : null;
  const startMonth = startDateObj ? startDateObj.getUTCMonth() + 1 : undefined;
  const endDateObj = endRaw ? parseDatePart(endRaw, year, startMonth) : startDateObj;
  return {
    startDate: toDateString(startDateObj),
    endDate: toDateString(endDateObj),
  };
};

const parseTimeString = (timeText?: string) => {
  if (!timeText) return null;
  const match = timeText.trim().match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/i);
  if (!match) return null;
  let hours = Number(match[1]);
  const minutes = match[2] ? Number(match[2]) : 0;
  const meridiem = match[3].toUpperCase();
  if (meridiem === 'PM' && hours < 12) {
    hours += 12;
  }
  if (meridiem === 'AM' && hours === 12) {
    hours = 0;
  }
  return { hours, minutes };
};

const parseMatchSchedule = (dateText?: string, timeText?: string) => {
  if (!dateText || !timeText) return null;
  const time = parseTimeString(timeText);
  if (!time) return null;
  const lower = dateText.trim().toLowerCase();
  let baseDate: Date | null = null;
  if (lower === 'today') {
    baseDate = new Date();
  } else if (lower === 'tomorrow') {
    baseDate = new Date();
    baseDate.setDate(baseDate.getDate() + 1);
  } else {
    const parsed = new Date(dateText);
    if (!Number.isNaN(parsed.getTime())) {
      baseDate = parsed;
    }
  }
  if (!baseDate) {
    return null;
  }
  baseDate.setHours(time.hours, time.minutes, 0, 0);
  return baseDate.toISOString();
};

const ensureSkills = async (supabase: SupabaseClient) => {
  if (skillsSeeded) {
    return;
  }
  const { error } = await supabase.from('skills').upsert(KNOWN_SKILLS, { onConflict: 'id' });
  if (error) {
    throw new Error(`Failed to ensure skills: ${error.message}`);
  }
  skillsSeeded = true;
};
const upsertTournament = async (
  supabase: SupabaseClient,
  tournament: { id?: string; name?: string; displayDate?: string; location?: string; level?: string },
) => {
  const trimmedName = tournament.name?.trim() || 'Unknown Tournament';
  const id = tournament.id?.trim() || slugify(trimmedName);
  const { startDate, endDate } = parseTournamentDateRange(tournament.displayDate);
  const payload: Record<string, unknown> = {
    id,
    name: trimmedName,
    display_date: tournament.displayDate ?? null,
    updated_at: new Date().toISOString(),
  };
  if (startDate) payload.start_date = startDate;
  if (endDate) payload.end_date = endDate;
  if (tournament.location) payload.location = tournament.location;
  if (tournament.level) payload.level = tournament.level;
  const { error } = await supabase.from('tournaments').upsert(payload, { onConflict: 'id' });
  if (error) {
    throw new Error(`Failed to upsert tournament: ${error.message}`);
  }
  return id;
};

const upsertPlayers = async (supabase: SupabaseClient, players: PlayerPayload[]) => {
  const map = new Map<string, string>();
  if (!players || players.length === 0) {
    return map;
  }
  const payload = players.map((player) => {
    const key = player.id ?? player.name;
    const id = player.id !== undefined ? String(player.id) : slugify(player.name);
    map.set(String(key), id);
    return {
      id,
      name: player.name,
      country: player.country ?? null,
      ranking: player.ranking ?? null,
      updated_at: new Date().toISOString(),
    };
  });
  const { error } = await supabase.from('players').upsert(payload, { onConflict: 'id' });
  if (error) {
    throw new Error(`Failed to upsert players: ${error.message}`);
  }
  return map;
};

const saveTeamForUser = async (supabase: SupabaseClient, userId: string, team: TeamPayload) => {
  await ensureSkills(supabase);
  const tournamentId = await upsertTournament(supabase, {
    id: team.tournamentId,
    name: team.tournamentName,
    displayDate: team.tournamentDate,
  });

  const playerIdMap = await upsertPlayers(supabase, team.players ?? []);
  const nowIso = new Date().toISOString();

  const teamRecord: Record<string, unknown> = {
    id: team.id,
    user_id: userId,
    tournament_id: tournamentId,
    name: team.name ?? `Team ${team.id.slice(-6)}`,
    status: team.status ?? 'current',
    points: team.points ?? 0,
    rank: team.rank ?? null,
    updated_at: nowIso,
  };

  if (team.createdAt) {
    const created = new Date(team.createdAt);
    if (!Number.isNaN(created.getTime())) {
      teamRecord.created_at = created.toISOString();
    }
  }

  const { error: teamError } = await supabase.from('fantasy_teams').upsert(teamRecord, { onConflict: 'id' });
  if (teamError) {
    throw new Error(`Failed to save team: ${teamError.message}`);
  }

  const { error: deleteError } = await supabase
    .from('team_players')
    .delete()
    .eq('fantasy_team_id', team.id);

  if (deleteError) {
    throw new Error(`Failed to clear existing team players: ${deleteError.message}`);
  }

  const assignments = team.skillAssignments ?? {};
  const teamPlayersPayload = (team.players ?? [])
    .map((player) => {
      const key = String(player.id ?? player.name);
      const storedId = playerIdMap.get(key);
      if (!storedId) {
        return null;
      }
      const skillId = assignments[key] ?? null;
      return {
        fantasy_team_id: team.id,
        player_id: storedId,
        skill_id: skillId,
        price: player.price ?? null,
        tier: player.tier ?? null,
        updated_at: nowIso,
      };
    })
    .filter((row): row is { fantasy_team_id: string; player_id: string; skill_id: string | null; price: number | null; tier: number | null; updated_at: string } => row !== null);

  if (teamPlayersPayload.length > 0) {
    const { error: playersError } = await supabase
      .from('team_players')
      .upsert(teamPlayersPayload, { onConflict: 'fantasy_team_id,player_id' });
    if (playersError) {
      throw new Error(`Failed to save team players: ${playersError.message}`);
    }
  }
};

const formatTeamRow = (row: any) => {
  const players = (row.team_players ?? []).map((teamPlayer: any) => {
    const playerData = teamPlayer.players ?? {};
    const rawId = playerData.id ?? teamPlayer.player_id;
    const numericId = Number(rawId);
    const idValue = Number.isFinite(numericId) ? numericId : rawId;
    return {
      id: idValue,
      name: playerData.name ?? '',
      country: playerData.country ?? '',
      ranking: playerData.ranking ?? 0,
      price: teamPlayer.price !== null && teamPlayer.price !== undefined ? Number(teamPlayer.price) : 0,
      tier: teamPlayer.tier ?? 0,
    };
  });

  const skillAssignments: Record<string, string> = {};
  for (const teamPlayer of row.team_players ?? []) {
    if (!teamPlayer.skill_id) continue;
    const playerId = teamPlayer.players?.id ?? teamPlayer.player_id;
    if (playerId) {
      skillAssignments[String(playerId)] = teamPlayer.skill_id;
    }
  }

  return {
    id: row.id,
    tournamentName: row.tournaments?.name ?? '',
    tournamentDate: row.tournaments?.display_date ?? '',
    players,
    skillAssignments,
    createdAt: row.created_at ? new Date(row.created_at) : new Date(),
    status: (row.status ?? 'current') as 'current' | 'past',
    points: row.points ?? undefined,
    rank: row.rank ?? undefined,
  };
};

const getUserTeams = async (supabase: SupabaseClient, userId: string) => {
  const { data, error } = await supabase
    .from('fantasy_teams')
    .select(`
      id,
      tournament_id,
      status,
      points,
      rank,
      created_at,
      tournaments ( id, name, display_date ),
      team_players (
        player_id,
        skill_id,
        price,
        tier,
        players ( id, name, country, ranking )
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch teams: ${error.message}`);
  }

  return (data ?? []).map(formatTeamRow);
};
const savePredictionForUser = async (supabase: SupabaseClient, userId: string, prediction: PredictionPayload) => {
  const tournamentId = await upsertTournament(supabase, {
    name: prediction.tournament,
    displayDate: prediction.date,
  });

  const player1Id = slugify(prediction.player1);
  const player2Id = slugify(prediction.player2);

  await upsertPlayers(supabase, [
    { id: player1Id, name: prediction.player1 },
    { id: player2Id, name: prediction.player2 },
  ]);

  const nowIso = new Date().toISOString();
  const entryPayload = [
    { tournament_id: tournamentId, player_id: player1Id, updated_at: nowIso },
    { tournament_id: tournamentId, player_id: player2Id, updated_at: nowIso },
  ];

  const { error: entryError } = await supabase
    .from('tournament_entries')
    .upsert(entryPayload, { onConflict: 'tournament_id,player_id' });
  if (entryError) {
    throw new Error(`Failed to upsert tournament entries: ${entryError.message}`);
  }

  const { data: entries, error: entriesError } = await supabase
    .from('tournament_entries')
    .select('id, player_id')
    .eq('tournament_id', tournamentId)
    .in('player_id', [player1Id, player2Id]);
  if (entriesError) {
    throw new Error(`Failed to fetch tournament entries: ${entriesError.message}`);
  }

  const player1EntryId = entries?.find((entry: any) => entry.player_id === player1Id)?.id ?? null;
  const player2EntryId = entries?.find((entry: any) => entry.player_id === player2Id)?.id ?? null;

  const matchPayload: Record<string, unknown> = {
    id: prediction.matchId,
    tournament_id: tournamentId,
    round: prediction.round ?? null,
    scheduled_at: parseMatchSchedule(prediction.date, prediction.time),
    display_date: prediction.date ?? null,
    display_time: prediction.time ?? null,
    player1_entry_id: player1EntryId,
    player2_entry_id: player2EntryId,
    player1_name: prediction.player1,
    player2_name: prediction.player2,
    player1_votes: prediction.player1Votes ?? null,
    player2_votes: prediction.player2Votes ?? null,
    updated_at: nowIso,
  };

  const { error: matchError } = await supabase.from('matches').upsert(matchPayload, { onConflict: 'id' });
  if (matchError) {
    throw new Error(`Failed to save match: ${matchError.message}`);
  }

  const { error: predictionError } = await supabase.from('predictions').upsert(
    {
      id: prediction.id,
      user_id: userId,
      match_id: prediction.matchId,
      selected_player: prediction.selectedPlayer,
      status: prediction.status ?? 'pending',
      points_earned: prediction.pointsEarned ?? null,
      is_correct: prediction.isCorrect ?? null,
      total_votes: prediction.totalVotes ?? null,
      player1_votes: prediction.player1Votes ?? null,
      player2_votes: prediction.player2Votes ?? null,
      updated_at: nowIso,
    },
    { onConflict: 'id' },
  );

  if (predictionError) {
    throw new Error(`Failed to save prediction: ${predictionError.message}`);
  }
};

const formatPredictionRow = (row: any) => {
  const match = row.matches ?? {};
  const tournament = match.tournaments ?? {};
  return {
    id: row.id,
    matchId: row.match_id,
    player1: match.player1_name ?? '',
    player2: match.player2_name ?? '',
    tournament: tournament.name ?? predictionTournamentNameFallback(match, row),
    selectedPlayer: row.selected_player,
    date: match.display_date ?? '',
    time: match.display_time ?? '',
    totalVotes: row.total_votes ?? undefined,
    player1Votes: row.player1_votes ?? match.player1_votes ?? undefined,
    player2Votes: row.player2_votes ?? match.player2_votes ?? undefined,
    pointsEarned: row.points_earned ?? undefined,
    isCorrect: row.is_correct ?? undefined,
    status: (row.status ?? 'pending') as 'pending' | 'completed',
  };
};

const predictionTournamentNameFallback = (match: any, row: any) => {
  if (row.tournaments?.name) {
    return row.tournaments.name;
  }
  if (row.tournament_name) {
    return row.tournament_name;
  }
  return match.tournament_name ?? '';
};

const getUserPredictions = async (supabase: SupabaseClient, userId: string) => {
  const { data, error } = await supabase
    .from('predictions')
    .select(`
      id,
      match_id,
      selected_player,
      status,
      points_earned,
      is_correct,
      total_votes,
      player1_votes,
      player2_votes,
      created_at,
      matches (
        id,
        tournament_id,
        round,
        display_date,
        display_time,
        player1_name,
        player2_name,
        player1_votes,
        player2_votes,
        tournaments ( id, name, display_date )
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch predictions: ${error.message}`);
  }

  return (data ?? []).map((row: any) => {
    const formatted = formatPredictionRow(row);
    if (!formatted.tournament) {
      const match = row.matches ?? {};
      const tournament = match.tournaments ?? {};
      formatted.tournament = tournament.name ?? '';
    }
    return formatted;
  });
};
const parseKvValue = (value: any) => {
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch (_error) {
      return null;
    }
  }
  return value;
};

const parseTeamSnapshot = (snapshot: any) => {
  if (!snapshot) {
    return null;
  }
  const parsed = parseKvValue(snapshot);
  return parsed ?? null;
};

const formatTournamentPerformanceRow = (row: any) => {
  const tournament = row.tournaments ?? {};
  const snapshot = parseTeamSnapshot(row.team_snapshot);
  const team = snapshot ?? (row.team_name ? { name: row.team_name, players: [] } : { name: '', players: [] });
  return {
    userId: row.user_id,
    userName: row.user_name ?? '',
    userEmail: row.user_email ?? '',
    avatar: row.avatar ?? '🎾',
    tournamentId: row.tournament_id,
    tournamentName: row.tournament_name ?? tournament.name ?? '',
    tournamentDate: row.tournament_date ?? tournament.display_date ?? '',
    points: row.points ?? 0,
    rank: row.rank ?? undefined,
    totalParticipants: row.total_participants ?? undefined,
    team,
    createdAt: row.created_at,
  };
};

const fetchTournamentPerformances = async (supabase: SupabaseClient, userId?: string) => {
  let query = supabase
    .from('tournament_performances')
    .select(`
      user_id,
      user_name,
      user_email,
      avatar,
      tournament_id,
      tournament_name,
      tournament_date,
      team_name,
      team_snapshot,
      points,
      rank,
      total_participants,
      created_at,
      tournaments ( id, name, display_date )
    `)
    .order('created_at', { ascending: false });

  if (userId) {
    query = query.eq('user_id', userId);
  }

  const { data, error } = await query;
  if (error) {
    throw new Error(`Failed to fetch tournament performances: ${error.message}`);
  }

  return (data ?? []).map(formatTournamentPerformanceRow);
};

const saveTournamentPerformanceRecord = async (
  supabase: SupabaseClient,
  performance: PerformancePayload,
  metadata: { userId: string; userName?: string; userEmail?: string; avatar?: string; fantasyTeamId?: string | null },
) => {
  const tournamentId = await upsertTournament(supabase, {
    id: performance.tournamentId,
    name: performance.tournamentName,
    displayDate: performance.tournamentDate,
  });

  const snapshot = parseTeamSnapshot(performance.team);

  const { error } = await supabase.from('tournament_performances').upsert(
    {
      user_id: metadata.userId,
      user_name: metadata.userName ?? null,
      user_email: metadata.userEmail ?? null,
      avatar: metadata.avatar ?? performance.avatar ?? null,
      tournament_id: tournamentId,
      tournament_name: performance.tournamentName ?? null,
      tournament_date: performance.tournamentDate ?? null,
      fantasy_team_id: metadata.fantasyTeamId ?? null,
      team_name: snapshot?.name ?? null,
      team_snapshot: snapshot,
      points: performance.points,
      rank: performance.rank ?? null,
      total_participants: performance.totalParticipants ?? null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id,tournament_id' },
  );

  if (error) {
    throw new Error(`Failed to save tournament performance: ${error.message}`);
  }
};

const buildLeaderboard = async (supabase: SupabaseClient) => {
  const performances = await fetchTournamentPerformances(supabase);
  const stats: Record<string, {
    userId: string;
    name: string;
    email: string;
    avatar: string;
    totalPoints: number;
    tournamentsPlayed: number;
    tournaments: ReturnType<typeof formatTournamentPerformanceRow>[];
  }> = {};

  for (const perf of performances) {
    if (!stats[perf.userId]) {
      stats[perf.userId] = {
        userId: perf.userId,
        name: perf.userName,
        email: perf.userEmail,
        avatar: perf.avatar ?? '🎾',
        totalPoints: 0,
        tournamentsPlayed: 0,
        tournaments: [],
      };
    }

    stats[perf.userId].totalPoints += perf.points ?? 0;
    stats[perf.userId].tournamentsPlayed += 1;
    stats[perf.userId].tournaments.push(perf);
  }

  return Object.values(stats)
    .sort((a, b) => b.totalPoints - a.totalPoints)
    .map((user, index) => ({
      ...user,
      rank: index + 1,
    }));
};

const getProfileData = async (supabase: SupabaseClient, userId: string) => {
  const performances = await fetchTournamentPerformances(supabase, userId);
  if (performances.length === 0) {
    return null;
  }

  const totalPoints = performances.reduce((sum, perf) => sum + (perf.points ?? 0), 0);
  const leaderboard = await buildLeaderboard(supabase);
  const seasonRank = leaderboard.findIndex((entry) => entry.userId === userId) + 1;
  const referencePerf = performances[0];

  const tournaments = [...performances].sort((a, b) => {
    const dateA = new Date(a.tournamentDate ?? a.createdAt ?? 0).getTime();
    const dateB = new Date(b.tournamentDate ?? b.createdAt ?? 0).getTime();
    return dateB - dateA;
  });

  return {
    userId,
    name: referencePerf.userName,
    email: referencePerf.userEmail,
    avatar: referencePerf.avatar ?? '🎾',
    totalPoints,
    tournamentsPlayed: performances.length,
    seasonRank: seasonRank > 0 ? seasonRank : undefined,
    tournaments,
  };
};
app.get("/make-server-a989b36a/health", (c) => {
  return c.json({ status: "ok" });
});

app.post("/make-server-a989b36a/signup", async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, phone, name } = body;

    const supabase = createSupabaseClient();

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      phone,
      user_metadata: { name },
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

app.post("/make-server-a989b36a/teams", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const supabase = createSupabaseClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (!user?.id || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const body = await c.req.json();
    const { team } = body as { team: TeamPayload };

    if (!team?.id) {
      return c.json({ error: 'Invalid team payload' }, 400);
    }

    await saveTeamForUser(supabase, user.id, team);
    const teams = await getUserTeams(supabase, user.id);

    return c.json({ success: true, teams });
  } catch (error) {
    console.log(`Server error saving team: ${error}`);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

app.get("/make-server-a989b36a/teams", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const supabase = createSupabaseClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (!user?.id || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const teams = await getUserTeams(supabase, user.id);
    return c.json({ teams });
  } catch (error) {
    console.log(`Server error fetching teams: ${error}`);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

app.post("/make-server-a989b36a/predictions", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const supabase = createSupabaseClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (!user?.id || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const body = await c.req.json();
    const { prediction } = body as { prediction: PredictionPayload };

    if (!prediction?.id) {
      return c.json({ error: 'Invalid prediction payload' }, 400);
    }

    await savePredictionForUser(supabase, user.id, prediction);
    const predictions = await getUserPredictions(supabase, user.id);

    return c.json({ success: true, predictions });
  } catch (error) {
    console.log(`Server error saving prediction: ${error}`);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

app.get("/make-server-a989b36a/predictions", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const supabase = createSupabaseClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (!user?.id || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const predictions = await getUserPredictions(supabase, user.id);
    return c.json({ predictions });
  } catch (error) {
    console.log(`Server error fetching predictions: ${error}`);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

app.get("/make-server-a989b36a/leaderboard", async (c) => {
  try {
    const supabase = createSupabaseClient();
    const leaderboard = await buildLeaderboard(supabase);
    return c.json({ leaderboard });
  } catch (error) {
    console.log(`Server error fetching leaderboard: ${error}`);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

app.get("/make-server-a989b36a/profile/:userId", async (c) => {
  try {
    const supabase = createSupabaseClient();
    const userId = c.req.param('userId');

    const profile = await getProfileData(supabase, userId);
    if (!profile) {
      return c.json({ error: 'User not found' }, 404);
    }

    return c.json({ profile });
  } catch (error) {
    console.log(`Server error fetching user profile: ${error}`);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

app.post("/make-server-a989b36a/tournament-performance", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const supabase = createSupabaseClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (!user?.id || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const body = await c.req.json();
    const { performance } = body as { performance: PerformancePayload };

    if (!performance || typeof performance.points !== 'number') {
      return c.json({ error: 'Invalid performance payload' }, 400);
    }

    await saveTournamentPerformanceRecord(supabase, performance, {
      userId: user.id,
      userName: user.user_metadata?.name ?? user.email ?? '',
      userEmail: user.email ?? '',
      avatar: performance.avatar ?? user.user_metadata?.avatar ?? '🎾',
      fantasyTeamId: null,
    });

    return c.json({ success: true });
  } catch (error) {
    console.log(`Server error saving tournament performance: ${error}`);
    return c.json({ error: 'Internal server error' }, 500);
  }
});
app.post("/make-server-a989b36a/complete-tournament", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const supabase = createSupabaseClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (!user?.id || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const body = await c.req.json();
    const { teamId, tournamentId } = body as { teamId: string; tournamentId: string };

    if (!teamId || !tournamentId) {
      return c.json({ error: 'Invalid payload' }, 400);
    }

    const { data: teamRow, error: teamError } = await supabase
      .from('fantasy_teams')
      .select(`
        id,
        name,
        status,
        points,
        rank,
        tournaments ( id, name, display_date ),
        team_players (
          price,
          tier,
          players ( id, name, country, ranking )
        )
      `)
      .eq('id', teamId)
      .eq('user_id', user.id)
      .maybeSingle();

    if (teamError) {
      throw new Error(teamError.message);
    }

    if (!teamRow) {
      return c.json({ error: 'Team not found' }, 404);
    }

    const teamPlayers = (teamRow.team_players ?? []).map((teamPlayer: any) => ({
      name: teamPlayer.players?.name ?? '',
      country: teamPlayer.players?.country ?? '',
      tier: teamPlayer.tier ?? 0,
      price: teamPlayer.price !== null && teamPlayer.price !== undefined ? Number(teamPlayer.price) : 0,
    }));

    const basePoints = teamPlayers.reduce((sum: number, player: any) => sum + (player.price ?? 0) * 20, 0);
    const randomFactor = 0.7 + Math.random() * 0.6;
    const points = Math.floor(basePoints * randomFactor);

    const { data: existingPerformances, error: performancesError } = await supabase
      .from('tournament_performances')
      .select('points')
      .eq('tournament_id', tournamentId);

    if (performancesError) {
      throw new Error(performancesError.message);
    }

    const betterPerformances = (existingPerformances ?? []).filter((perf: any) => (perf.points ?? 0) > points).length;
    const rank = betterPerformances + 1;
    const totalParticipants = (existingPerformances?.length ?? 0) + 1;

    const performanceDetails: PerformancePayload = {
      tournamentId,
      tournamentName: teamRow.tournaments?.name ?? '',
      tournamentDate: teamRow.tournaments?.display_date ?? '',
      points,
      rank,
      totalParticipants,
      team: {
        name: teamRow.name ?? `Team ${teamRow.id.slice(-6)}`,
        players: teamPlayers,
      },
      avatar: '🎾',
    };

    const responsePerformance = {
      userId: user.id,
      userName: user.user_metadata?.name ?? user.email ?? '',
      userEmail: user.email ?? '',
      avatar: performanceDetails.avatar,
      ...performanceDetails,
    };

    await saveTournamentPerformanceRecord(supabase, performanceDetails, {
      userId: user.id,
      userName: responsePerformance.userName,
      userEmail: responsePerformance.userEmail,
      avatar: responsePerformance.avatar,
      fantasyTeamId: teamRow.id,
    });

    const { error: updateTeamError } = await supabase
      .from('fantasy_teams')
      .update({
        status: 'past',
        points,
        rank,
        updated_at: new Date().toISOString(),
      })
      .eq('id', teamRow.id);

    if (updateTeamError) {
      throw new Error(updateTeamError.message);
    }

    return c.json({
      success: true,
      performance: responsePerformance,
      message: `Tournament completed! You ranked #${rank} with ${points} points`,
    });
  } catch (error) {
    console.log(`Server error completing tournament: ${error}`);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

app.post("/make-server-a989b36a/migrate-kv", async (c) => {
  try {
    const supabase = createSupabaseClient();
    await ensureSkills(supabase);

    const { data: teamRows, error: teamError } = await supabase
      .from('kv_store_a989b36a')
      .select('key, value')
      .like('key', 'teams:%');

    if (teamError) {
      throw new Error(teamError.message);
    }

    let teamsMigrated = 0;
    for (const row of teamRows ?? []) {
      const keyParts = row.key?.split(':') ?? [];
      const userId = keyParts[1];
      if (!userId) continue;
      const value = parseKvValue(row.value);
      if (!Array.isArray(value)) continue;
      for (const team of value) {
        await saveTeamForUser(supabase, userId, team);
        teamsMigrated += 1;
      }
    }

    const { data: predictionRows, error: predictionError } = await supabase
      .from('kv_store_a989b36a')
      .select('key, value')
      .like('key', 'predictions:%');

    if (predictionError) {
      throw new Error(predictionError.message);
    }

    let predictionsMigrated = 0;
    for (const row of predictionRows ?? []) {
      const keyParts = row.key?.split(':') ?? [];
      const userId = keyParts[1];
      if (!userId) continue;
      const value = parseKvValue(row.value);
      if (!Array.isArray(value)) continue;
      for (const prediction of value) {
        await savePredictionForUser(supabase, userId, prediction);
        predictionsMigrated += 1;
      }
    }

    const { data: performanceRows, error: performanceError } = await supabase
      .from('kv_store_a989b36a')
      .select('key, value')
      .like('key', 'tournament_performance:%');

    if (performanceError) {
      throw new Error(performanceError.message);
    }

    let performancesMigrated = 0;
    for (const row of performanceRows ?? []) {
      const keyParts = row.key?.split(':') ?? [];
      const userIdFromKey = keyParts[1];
      const value = parseKvValue(row.value);
      if (!value) continue;
      const userId = value.userId ?? userIdFromKey;
      if (!userId) continue;
      await saveTournamentPerformanceRecord(supabase, value, {
        userId,
        userName: value.userName ?? '',
        userEmail: value.userEmail ?? '',
        avatar: value.avatar ?? '🎾',
        fantasyTeamId: value.fantasyTeamId ?? null,
      });
      performancesMigrated += 1;
    }

    return c.json({
      success: true,
      teamsMigrated,
      predictionsMigrated,
      performancesMigrated,
    });
  } catch (error) {
    console.log(`Server error migrating KV data: ${error}`);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

Deno.serve(app.fetch);
