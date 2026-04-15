"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Brain,
  PlayCircle,
  Shield,
  Trophy,
  Users,
  PauseCircle,
  ClipboardList,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type FranchiseData = {
  city: string;
  teamName: string;
  conference: string;
  gmUsername: string;
  primaryColor: string;
  secondaryColor: string;
};

type Player = {
  id: number;
  name: string;
  position: "PG" | "SG" | "SF" | "PF" | "C";
  archetype: string;
  overall: number;
  salary: number;
};

type StaffMember = {
  id: number;
  name: string;
  role: "Head Coach" | "Assistant Coach" | "Trainer" | "Scout";
  specialty: string;
  rating: number;
  salary: number;
};

type GameResult = {
  opponent: string;
  userScore: number;
  opponentScore: number;
  result: "W" | "L";
  summary: string;
};

type SimPhase = "pregame" | "live" | "halftime" | "final";

const opponents = [
  "Brooklyn Phantoms",
  "Chicago Steel",
  "Las Vegas Gold",
  "Seattle Sound",
  "Miami Tide",
  "Austin Blaze",
  "Toronto North",
  "Phoenix Storm",
];

export default function SimulatePage() {
  const images = [
    "/images/auth-basketball.jpg",
    "/images/auth-football2.jpg",
    "/images/auth-baseball.jpg",
  ];

  const [currentImage, setCurrentImage] = useState(0);
  const [franchise, setFranchise] = useState<FranchiseData | null>(null);
  const [roster, setRoster] = useState<Player[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [games, setGames] = useState<GameResult[]>([]);

  const [phase, setPhase] = useState<SimPhase>("pregame");
  const [quarter, setQuarter] = useState(1);
  const [score, setScore] = useState({ user: 0, opp: 0 });
  const [liveEvents, setLiveEvents] = useState<string[]>([]);
  const [halftimeChoice, setHalftimeChoice] = useState<"pace" | "defense" | "star" | null>(null);
  const [currentOpponent, setCurrentOpponent] = useState("Chicago Steel");
  const [opponentRating, setOpponentRating] = useState(84);
  const [lastSummary, setLastSummary] = useState("");
  const [lastResult, setLastResult] = useState<"W" | "L" | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  useEffect(() => {
    const savedFranchise = localStorage.getItem("franchise");
    if (savedFranchise) setFranchise(JSON.parse(savedFranchise));

    const savedRoster = localStorage.getItem("roster");
    if (savedRoster) setRoster(JSON.parse(savedRoster));

    const savedStaff = localStorage.getItem("staff");
    if (savedStaff) setStaff(JSON.parse(savedStaff));

    const savedGames = localStorage.getItem("games");
    if (savedGames) setGames(JSON.parse(savedGames));
  }, []);

  const playerRating = useMemo(() => {
    if (roster.length === 0) return 0;
    return Math.round(roster.reduce((sum, p) => sum + p.overall, 0) / roster.length);
  }, [roster]);

  const staffRating = useMemo(() => {
    if (staff.length === 0) return 0;
    return Math.round(staff.reduce((sum, s) => sum + s.rating, 0) / staff.length);
  }, [staff]);

  const rosterCounts = {
    PG: roster.filter((p) => p.position === "PG").length,
    SG: roster.filter((p) => p.position === "SG").length,
    SF: roster.filter((p) => p.position === "SF").length,
    PF: roster.filter((p) => p.position === "PF").length,
    C: roster.filter((p) => p.position === "C").length,
  };

  const positionBalanceBonus =
    rosterCounts.PG >= 2 &&
    rosterCounts.SG >= 2 &&
    rosterCounts.SF >= 2 &&
    rosterCounts.PF >= 2 &&
    rosterCounts.C >= 2
      ? 3
      : 0;

  const starPlayers = roster.filter((p) => p.overall >= 88);
  const starBonus = starPlayers.length >= 2 ? 2 : 0;

  const teamRating = useMemo(() => {
    if (playerRating === 0) return 0;
    return Math.round(playerRating * 0.8 + staffRating * 0.2 + positionBalanceBonus + starBonus);
  }, [playerRating, staffRating, positionBalanceBonus, starBonus]);

  const wins = games.filter((g) => g.result === "W").length;
  const losses = games.filter((g) => g.result === "L").length;

  const readyToSim = !!franchise && roster.length === 15 && staff.length === 4;

  const randomPlayer = () => {
    if (roster.length === 0) return "Your star player";
    return roster[Math.floor(Math.random() * roster.length)].name;
  };

  const generateQuarterEvent = (q: number, userPts: number, oppPts: number) => {
    const player = randomPlayer();
    const eventTemplates = [
      `Q${q}: ${player} knocks down a big shot during a ${userPts}-${oppPts} quarter.`,
      `Q${q}: ${player} picks up two quick fouls and the rotation gets tested.`,
      `Q${q}: Your bench unit sparks momentum and helps swing the tempo.`,
      `Q${q}: ${player} starts finding rhythm and puts pressure on ${currentOpponent}.`,
      `Q${q}: Defensive communication improves and your team forces tough possessions.`,
      `Q${q}: ${currentOpponent} responds with a run, and the game tightens.`,
      `Q${q}: ${player} attacks the paint and keeps the offense alive.`,
      `Q${q}: Coaching adjustments begin to show in the matchup.`,
    ];
    return eventTemplates[Math.floor(Math.random() * eventTemplates.length)];
  };

  const startNewGame = () => {
    const possibleOpponents = opponents.filter(
      (name) => name !== `${franchise?.city} ${franchise?.teamName}`
    );
    const selectedOpponent =
      possibleOpponents[Math.floor(Math.random() * possibleOpponents.length)];
    const selectedOpponentRating = 78 + Math.floor(Math.random() * 15);

    setCurrentOpponent(selectedOpponent);
    setOpponentRating(selectedOpponentRating);
    setPhase("pregame");
    setQuarter(1);
    setScore({ user: 0, opp: 0 });
    setLiveEvents([]);
    setHalftimeChoice(null);
    setLastSummary("");
    setLastResult(null);
  };

  useEffect(() => {
    if (franchise) startNewGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [franchise]);

  const simulateQuarter = async (q: number, adjustment?: "pace" | "defense" | "star" | null) => {
    setQuarter(q);
    setPhase("live");

    await new Promise((r) => setTimeout(r, 1200));

    const baseUser = Math.floor(Math.random() * 19) + 20;
    const baseOpp = Math.floor(Math.random() * 19) + 19;

    let adjustmentBonusUser = 0;
    let adjustmentBonusOpp = 0;

    if (adjustment === "pace") adjustmentBonusUser += 4;
    if (adjustment === "defense") adjustmentBonusOpp -= 4;
    if (adjustment === "star") adjustmentBonusUser += 3;

    const edge = Math.round((teamRating - opponentRating) / 3);

    const quarterUser = Math.max(16, baseUser + edge + adjustmentBonusUser);
    const quarterOpp = Math.max(16, baseOpp - edge + adjustmentBonusOpp);

    setScore((prev) => ({
      user: prev.user + quarterUser,
      opp: prev.opp + quarterOpp,
    }));

    const event = generateQuarterEvent(q, quarterUser, quarterOpp);
    setLiveEvents((prev) => [event, ...prev]);

    await new Promise((r) => setTimeout(r, 1200));
  };

  const runGame = async () => {
    if (!readyToSim) return;

    setScore({ user: 0, opp: 0 });
    setLiveEvents([]);
    setLastSummary("");
    setLastResult(null);

    await simulateQuarter(1, null);
    await simulateQuarter(2, null);

    setPhase("halftime");
  };

  const finishSecondHalf = async (choice: "pace" | "defense" | "star") => {
    setHalftimeChoice(choice);

    await simulateQuarter(3, choice);
    await simulateQuarter(4, choice);

    setPhase("final");

    setScore((finalScore) => {
      const result: "W" | "L" = finalScore.user >= finalScore.opp ? "W" : "L";

      let summary = "";
      if (result === "W" && choice === "star") {
        summary = `${randomPlayer()} took over after halftime and pushed your team to a win.`;
      } else if (result === "W" && choice === "defense") {
        summary = `Your halftime defensive adjustment slowed ${currentOpponent} and closed out the win.`;
      } else if (result === "W" && choice === "pace") {
        summary = `Your team sped the game up in the second half and wore down ${currentOpponent}.`;
      } else if (result === "W") {
        summary = `Your team made the key plays late and secured the win.`;
      } else if (result === "L" && choice === "star") {
        summary = `${randomPlayer()} carried the offense, but the supporting cast could not hold up.`;
      } else if (result === "L" && choice === "defense") {
        summary = `The defensive game plan helped, but ${currentOpponent} still found answers late.`;
      } else if (result === "L" && choice === "pace") {
        summary = `The faster pace created chances, but your team could not capitalize enough.`;
      } else {
        summary = `${currentOpponent} controlled too many key moments in the second half.`;
      }

      const newGame: GameResult = {
        opponent: currentOpponent,
        userScore: finalScore.user,
        opponentScore: finalScore.opp,
        result,
        summary,
      };

      const updatedGames = [newGame, ...games];
      setGames(updatedGames);
      localStorage.setItem("games", JSON.stringify(updatedGames));
      setLastSummary(summary);
      setLastResult(result);

      return finalScore;
    });
  };

  const clearResults = () => {
    setGames([]);
    localStorage.removeItem("games");
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/60 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2 font-semibold">
            <Trophy className="h-5 w-5 text-orange-400" />
            <span>AllSports GM</span>
          </div>

          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-sm text-zinc-300 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>
      </header>

      <div className="relative h-[320px] w-full overflow-hidden">
        <div className="absolute inset-0">
          {images.map((img, index) => (
            <div
              key={img}
              className={`absolute inset-0 bg-cover bg-center transition-all duration-[6000ms] ${
                index === currentImage ? "opacity-100" : "opacity-0"
              }`}
              style={{
                backgroundImage: `url(${img})`,
                transform: index === currentImage ? "scale(1.05)" : "scale(1)",
              }}
            />
          ))}
        </div>

        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/70" />

        <div className="relative z-10 mx-auto flex h-full max-w-7xl items-end px-6 pb-10">
          <div className="max-w-3xl space-y-3">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-orange-400">
              Simulation
            </p>

            <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              {franchise
                ? `${franchise.city} ${franchise.teamName} Game Center`
                : "Simulate games"}
            </h1>

            <p className="max-w-2xl text-sm text-zinc-200 md:text-base">
              Turn your front office decisions into results. Watch the matchup unfold, make a halftime adjustment, and see if your team can close.
            </p>
          </div>
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 grid gap-6 md:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <div className="mb-3 flex items-center gap-2 text-orange-400">
              <Trophy className="h-5 w-5" />
              <span className="text-sm font-medium">Team Rating</span>
            </div>
            <p className="text-2xl font-semibold">{teamRating || "—"}</p>
            <p className="mt-1 text-sm text-zinc-400">
              Based on roster, staff, and roster balance
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <div className="mb-3 flex items-center gap-2 text-blue-400">
              <Users className="h-5 w-5" />
              <span className="text-sm font-medium">Roster Ready</span>
            </div>
            <p className="text-2xl font-semibold">{roster.length} / 15</p>
            <p className="mt-1 text-sm text-zinc-400">
              {roster.length === 15 ? "Roster complete" : "Need full roster"}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <div className="mb-3 flex items-center gap-2 text-green-400">
              <Shield className="h-5 w-5" />
              <span className="text-sm font-medium">Staff Ready</span>
            </div>
            <p className="text-2xl font-semibold">{staff.length} / 4</p>
            <p className="mt-1 text-sm text-zinc-400">
              {staff.length === 4 ? "Staff complete" : "Need full staff"}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <div className="mb-3 flex items-center gap-2 text-purple-400">
              <Brain className="h-5 w-5" />
              <span className="text-sm font-medium">Record</span>
            </div>
            <p className="text-2xl font-semibold">
              {wins}-{losses}
            </p>
            <p className="mt-1 text-sm text-zinc-400">
              Wins and losses from simulated games
            </p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <h2 className="text-2xl font-semibold">Matchup Center</h2>
              <p className="mt-1 text-sm text-zinc-400">
                Upcoming game and live simulation controls.
              </p>

              <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">
                      Next Game
                    </p>
                    <p className="mt-2 text-xl font-semibold">
                      {franchise ? `${franchise.city} ${franchise.teamName}` : "Your Team"} vs. {currentOpponent}
                    </p>
                    <p className="mt-1 text-sm text-zinc-400">
                      Team Rating {teamRating} · Opponent Rating {opponentRating}
                    </p>
                  </div>

                  <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-zinc-300">
                    {teamRating >= opponentRating ? "Slight Edge" : "Underdog"}
                  </div>
                </div>

                <div className="mt-6 rounded-xl border border-white/10 bg-black/20 p-4">
                  <p className="text-sm font-medium text-white">
                    {readyToSim ? "Ready to simulate" : "Not ready to simulate"}
                  </p>
                  <p className="mt-1 text-sm text-zinc-400">
                    {readyToSim
                      ? "Your organization is ready. Start the game and make a halftime call."
                      : "You need a franchise, a full 15-player roster, and 4 staff members before simulating."}
                  </p>
                </div>

                <div className="mt-6 flex flex-wrap gap-4">
                  {phase === "pregame" && (
                    <Button
                      className="bg-orange-500 text-white hover:bg-orange-600 disabled:bg-zinc-700 disabled:text-zinc-400"
                      onClick={runGame}
                      disabled={!readyToSim}
                    >
                      <span className="flex items-center gap-2">
                        Start Game
                        <PlayCircle className="h-4 w-4" />
                      </span>
                    </Button>
                  )}

                  {phase === "live" && (
                    <Button className="bg-zinc-700 text-zinc-200" disabled>
                      <span className="flex items-center gap-2">
                        Game In Progress
                        <PauseCircle className="h-4 w-4" />
                      </span>
                    </Button>
                  )}

                  {phase === "final" && (
                    <>
                      <Button
                        className="bg-orange-500 text-white hover:bg-orange-600"
                        onClick={startNewGame}
                      >
                        Sim Next Game
                      </Button>

                      <Button
                        className="border border-white/20 bg-black/20 text-white hover:bg-white/10 hover:border-white/40"
                        onClick={clearResults}
                      >
                        Clear Results
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <h2 className="text-2xl font-semibold">Live Game View</h2>
              <p className="mt-1 text-sm text-zinc-400">
                Watch the score build as the game unfolds.
              </p>

              <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-6 text-center">
                <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">
                  {phase === "pregame"
                    ? "Pregame"
                    : phase === "live"
                    ? `Quarter ${quarter}`
                    : phase === "halftime"
                    ? "Halftime"
                    : "Final"}
                </p>

                <div className="mt-6 flex items-center justify-center gap-6">
                  <div>
                    <p className="text-sm text-zinc-400">
                      {franchise ? `${franchise.city} ${franchise.teamName}` : "Your Team"}
                    </p>
                    <p className="text-5xl font-bold">{score.user}</p>
                  </div>

                  <div className="text-2xl text-zinc-500">-</div>

                  <div>
                    <p className="text-sm text-zinc-400">{currentOpponent}</p>
                    <p className="text-5xl font-bold">{score.opp}</p>
                  </div>
                </div>

                {phase === "halftime" && (
                  <div className="mt-8">
                    <p className="mb-4 text-lg font-semibold">Choose your halftime adjustment</p>
                    <div className="flex flex-wrap justify-center gap-3">
                      <Button
                        className="bg-orange-500 text-white hover:bg-orange-600"
                        onClick={() => finishSecondHalf("pace")}
                      >
                        Push the Pace
                      </Button>
                      <Button
                        className="bg-orange-500 text-white hover:bg-orange-600"
                        onClick={() => finishSecondHalf("defense")}
                      >
                        Lock In Defense
                      </Button>
                      <Button
                        className="bg-orange-500 text-white hover:bg-orange-600"
                        onClick={() => finishSecondHalf("star")}
                      >
                        Feed the Star
                      </Button>
                    </div>
                  </div>
                )}

                {phase === "final" && (
                  <div className="mt-6">
                    <div
                      className={`inline-flex rounded-full px-4 py-2 text-sm font-medium ${
                        lastResult === "W"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {lastResult === "W" ? "Win" : "Loss"}
                    </div>
                    <p className="mx-auto mt-4 max-w-xl text-sm text-zinc-300">
                      {lastSummary}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <h2 className="text-2xl font-semibold">How rating is built</h2>
              <div className="mt-6 space-y-4 text-sm text-zinc-300">
                <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                  <p className="font-medium">Player Average</p>
                  <p className="mt-1 text-zinc-400">
                    Average roster overall: {playerRating || "—"}
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                  <p className="font-medium">Staff Impact</p>
                  <p className="mt-1 text-zinc-400">
                    Average staff rating: {staffRating || "—"}
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                  <p className="font-medium">Bonuses</p>
                  <p className="mt-1 text-zinc-400">
                    Position balance: +{positionBalanceBonus} · Star bonus: +{starBonus}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <h2 className="text-2xl font-semibold">Live Event Feed</h2>
              <p className="mt-1 text-sm text-zinc-400">
                Key moments and turning points from the game.
              </p>

              <div className="mt-6 space-y-3">
                {liveEvents.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-white/10 bg-black/20 p-6 text-center text-sm text-zinc-500">
                    No live events yet. Start a game to see momentum swing.
                  </div>
                ) : (
                  liveEvents.map((event, index) => (
                    <div
                      key={`${event}-${index}`}
                      className="rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-zinc-300"
                    >
                      {event}
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <h2 className="text-2xl font-semibold">Recent Results</h2>
              <p className="mt-1 text-sm text-zinc-400">
                Your latest completed games.
              </p>

              <div className="mt-6 space-y-4">
                {games.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-white/10 bg-black/20 p-6 text-center text-sm text-zinc-500">
                    No games simulated yet.
                  </div>
                ) : (
                  games.map((game, index) => (
                    <div
                      key={`${game.opponent}-${index}`}
                      className="rounded-2xl border border-white/10 bg-black/30 p-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-semibold">vs. {game.opponent}</p>
                          <p className="mt-1 text-sm text-zinc-300">
                            Score: {game.userScore} - {game.opponentScore}
                          </p>
                          <p className="mt-2 text-sm text-zinc-400">
                            {game.summary}
                          </p>
                        </div>

                        <div
                          className={`rounded-full px-3 py-1 text-sm font-medium ${
                            game.result === "W"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {game.result}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <h2 className="text-2xl font-semibold">What’s next</h2>
              <div className="mt-6 space-y-3">
                <div className="rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-zinc-300">
                  Add star player identities and postgame MVPs.
                </div>
                <div className="rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-zinc-300">
                  Build a season schedule and standings.
                </div>
                <div className="rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-zinc-300">
                  Add richer quarter-by-quarter stat lines and matchup visuals.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}