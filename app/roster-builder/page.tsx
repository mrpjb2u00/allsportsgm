"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Shield,
  Star,
  Trophy,
  Users,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type Player = {
  id: number;
  name: string;
  position: "PG" | "SG" | "SF" | "PF" | "C";
  archetype: string;
  overall: number;
  salary: number;
};

const playerPool: Player[] = [
  { id: 1, name: "Jalen Cross", position: "PG", archetype: "Floor General", overall: 88, salary: 24 },
  { id: 2, name: "Marcus Vale", position: "SG", archetype: "Shot Creator", overall: 91, salary: 31 },
  { id: 3, name: "Darius Rowe", position: "SF", archetype: "Two-Way Wing", overall: 87, salary: 22 },
  { id: 4, name: "Andre Mercer", position: "PF", archetype: "Stretch Four", overall: 85, salary: 18 },
  { id: 5, name: "Malik Stanton", position: "C", archetype: "Rim Protector", overall: 89, salary: 26 },

  { id: 6, name: "Ty Voss", position: "PG", archetype: "Sharpshooter", overall: 82, salary: 13 },
  { id: 7, name: "Keenan Price", position: "SG", archetype: "Microwave Scorer", overall: 80, salary: 11 },
  { id: 8, name: "Elijah Knox", position: "SF", archetype: "3-and-D Wing", overall: 83, salary: 14 },
  { id: 9, name: "Noah Banks", position: "PF", archetype: "Glass Cleaner", overall: 81, salary: 10 },
  { id: 10, name: "Isaiah Flint", position: "C", archetype: "Interior Scorer", overall: 84, salary: 16 },

  { id: 11, name: "Cam Rivers", position: "PG", archetype: "Slashing Guard", overall: 79, salary: 9 },
  { id: 12, name: "Zion Holt", position: "SG", archetype: "Defensive Stopper", overall: 78, salary: 8 },
  { id: 13, name: "Trey Holloway", position: "SF", archetype: "Athletic Finisher", overall: 82, salary: 12 },
  { id: 14, name: "Luca Bennett", position: "PF", archetype: "Stretch Four", overall: 77, salary: 7 },
  { id: 15, name: "Miles Keaton", position: "C", archetype: "Switchable Big", overall: 80, salary: 11 },

  { id: 16, name: "Jay Mercer", position: "PG", archetype: "Backup Playmaker", overall: 76, salary: 6 },
  { id: 17, name: "Devon Pike", position: "PG", archetype: "Tempo Guard", overall: 74, salary: 4 },
  { id: 18, name: "Rico Vance", position: "SG", archetype: "Bench Shooter", overall: 75, salary: 5 },
  { id: 19, name: "Khalil West", position: "SG", archetype: "Defensive Guard", overall: 74, salary: 4 },
  { id: 20, name: "Bryson Tate", position: "SF", archetype: "Wing Defender", overall: 76, salary: 6 },
  { id: 21, name: "Mason Reed", position: "SF", archetype: "Glue Guy", overall: 73, salary: 3 },
  { id: 22, name: "Jeremiah Cole", position: "PF", archetype: "Energy Big", overall: 75, salary: 5 },
  { id: 23, name: "Owen Strickland", position: "PF", archetype: "Rebounder", overall: 74, salary: 4 },
  { id: 24, name: "Corey Hines", position: "C", archetype: "Rim Runner", overall: 76, salary: 6 },
  { id: 25, name: "Brandon York", position: "C", archetype: "Reserve Big", overall: 73, salary: 3 },

  { id: 26, name: "Terrence Lowe", position: "PG", archetype: "Young Prospect", overall: 72, salary: 3 },
  { id: 27, name: "Micah Boone", position: "SG", archetype: "Spark Plug", overall: 73, salary: 3 },
  { id: 28, name: "Nate Calloway", position: "SF", archetype: "Transition Wing", overall: 74, salary: 4 },
  { id: 29, name: "Derrick Sloan", position: "PF", archetype: "Tough Forward", overall: 72, salary: 3 },
  { id: 30, name: "Aaron Peak", position: "C", archetype: "Paint Body", overall: 74, salary: 4 },
];

const salaryCap = 150;
const minRequirements = {
  PG: 2,
  SG: 2,
  SF: 2,
  PF: 2,
  C: 2,
};

export default function RosterBuilderPage() {
  const router = useRouter();

  const images = [
    "/images/auth-basketball.jpg",
    "/images/auth-football2.jpg",
    "/images/auth-baseball.jpg",
  ];

  const [currentImage, setCurrentImage] = useState(0);
  const [franchise, setFranchise] = useState<any>(null);
  const [selectedPosition, setSelectedPosition] = useState("ALL");
  const [roster, setRoster] = useState<Player[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  useEffect(() => {
    const savedFranchise = localStorage.getItem("franchise");
    if (savedFranchise) {
      setFranchise(JSON.parse(savedFranchise));
    }

    const savedRoster = localStorage.getItem("roster");
    if (savedRoster) {
      setRoster(JSON.parse(savedRoster));
    }
  }, []);

  const filteredPlayers = useMemo(() => {
    if (selectedPosition === "ALL") return playerPool;
    return playerPool.filter((player) => player.position === selectedPosition);
  }, [selectedPosition]);

  const totalSalary = roster.reduce((sum, player) => sum + player.salary, 0);
  const remainingCap = salaryCap - totalSalary;

  const rosterCounts = {
    PG: roster.filter((p) => p.position === "PG").length,
    SG: roster.filter((p) => p.position === "SG").length,
    SF: roster.filter((p) => p.position === "SF").length,
    PF: roster.filter((p) => p.position === "PF").length,
    C: roster.filter((p) => p.position === "C").length,
  };

  const requirementsMet =
    rosterCounts.PG >= minRequirements.PG &&
    rosterCounts.SG >= minRequirements.SG &&
    rosterCounts.SF >= minRequirements.SF &&
    rosterCounts.PF >= minRequirements.PF &&
    rosterCounts.C >= minRequirements.C;

  const rosterReady =
    roster.length === 15 && requirementsMet && totalSalary <= salaryCap;

  const addPlayer = (player: Player) => {
    const alreadyAdded = roster.some((p) => p.id === player.id);
    if (alreadyAdded) return;
    if (roster.length >= 15) return;
    if (totalSalary + player.salary > salaryCap) return;

    setRoster((prev) => [...prev, player]);
  };

  const removePlayer = (id: number) => {
    setRoster((prev) => prev.filter((player) => player.id !== id));
  };

  const saveRoster = () => {
    localStorage.setItem("roster", JSON.stringify(roster));
    router.push("/dashboard");
  };

  const requirementColor = (count: number, needed: number) =>
    count >= needed ? "text-green-400" : "text-zinc-300";

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
              Roster Builder
            </p>

            <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              {franchise
                ? `${franchise.city} ${franchise.teamName} Roster`
                : "Build your roster"}
            </h1>

            <p className="max-w-2xl text-sm text-zinc-200 md:text-base">
              Add players by position, stay under the salary cap, and build a team that can compete for a title.
            </p>
          </div>
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <div className="mb-3 flex items-center gap-2 text-orange-400">
              <Wallet className="h-5 w-5" />
              <span className="text-sm font-medium">Salary Cap</span>
            </div>
            <p className="text-2xl font-semibold">${remainingCap}M</p>
            <p className="mt-1 text-sm text-zinc-400">
              ${totalSalary}M used of ${salaryCap}M
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <div className="mb-3 flex items-center gap-2 text-blue-400">
              <Users className="h-5 w-5" />
              <span className="text-sm font-medium">Roster Count</span>
            </div>
            <p className="text-2xl font-semibold">{roster.length} / 15</p>
            <p className="mt-1 text-sm text-zinc-400">
              Fill all roster spots before moving on
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <div className="mb-3 flex items-center gap-2 text-green-400">
              <Shield className="h-5 w-5" />
              <span className="text-sm font-medium">Position Minimums</span>
            </div>
            <p className="text-sm">
              <span className={requirementColor(rosterCounts.PG, minRequirements.PG)}>
                PG {rosterCounts.PG}/2
              </span>
              {" · "}
              <span className={requirementColor(rosterCounts.SG, minRequirements.SG)}>
                SG {rosterCounts.SG}/2
              </span>
              {" · "}
              <span className={requirementColor(rosterCounts.SF, minRequirements.SF)}>
                SF {rosterCounts.SF}/2
              </span>
              {" · "}
              <span className={requirementColor(rosterCounts.PF, minRequirements.PF)}>
                PF {rosterCounts.PF}/2
              </span>
              {" · "}
              <span className={requirementColor(rosterCounts.C, minRequirements.C)}>
                C {rosterCounts.C}/2
              </span>
            </p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-semibold">Available Players</h2>
                <p className="mt-1 text-sm text-zinc-400">
                  Choose players that fit your budget and roster strategy.
                </p>
              </div>

              <select
                value={selectedPosition}
                onChange={(e) => setSelectedPosition(e.target.value)}
                className="h-11 rounded-xl border border-white/10 bg-black/30 px-4 text-white outline-none"
              >
                <option value="ALL">All Positions</option>
                <option value="PG">PG</option>
                <option value="SG">SG</option>
                <option value="SF">SF</option>
                <option value="PF">PF</option>
                <option value="C">C</option>
              </select>
            </div>

            <div className="space-y-4">
              {filteredPlayers.map((player) => {
                const alreadyAdded = roster.some((p) => p.id === player.id);
                const cantAfford = totalSalary + player.salary > salaryCap;
                const rosterFull = roster.length >= 15;

                return (
                  <div
                    key={player.id}
                    className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-black/30 p-4 md:flex-row md:items-center md:justify-between"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <p className="text-lg font-semibold">{player.name}</p>
                        <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-xs text-zinc-300">
                          {player.position}
                        </span>
                      </div>

                      <p className="text-sm text-zinc-400">{player.archetype}</p>

                      <div className="flex items-center gap-4 text-sm text-zinc-300">
                        <span className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-orange-400" />
                          {player.overall} OVR
                        </span>
                        <span>${player.salary}M</span>
                      </div>
                    </div>

                    <Button
                      disabled={alreadyAdded || cantAfford || rosterFull}
                      onClick={() => addPlayer(player)}
                      className="bg-orange-500 text-white hover:bg-orange-600 disabled:bg-zinc-700 disabled:text-zinc-400"
                    >
                      {alreadyAdded
                        ? "Added"
                        : cantAfford
                        ? "Over Cap"
                        : rosterFull
                        ? "Roster Full"
                        : "Add Player"}
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <h2 className="text-2xl font-semibold">Your Roster</h2>
              <p className="mt-1 text-sm text-zinc-400">
                Your selected players will appear here.
              </p>

              <div className="mt-6 space-y-4">
                {roster.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-white/10 bg-black/20 p-6 text-center text-sm text-zinc-500">
                    No players added yet.
                  </div>
                ) : (
                  roster.map((player) => (
                    <div
                      key={player.id}
                      className="rounded-2xl border border-white/10 bg-black/30 p-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-semibold">{player.name}</p>
                          <p className="text-sm text-zinc-400">
                            {player.position} · {player.archetype}
                          </p>
                          <p className="mt-1 text-sm text-zinc-300">
                            {player.overall} OVR · ${player.salary}M
                          </p>
                        </div>

                        <button
                          onClick={() => removePlayer(player.id)}
                          className="text-sm text-red-400 transition hover:text-red-300"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-sm font-medium text-white">
                  {rosterReady ? "Roster ready" : "Roster not ready"}
                </p>
                <p className="mt-1 text-sm text-zinc-400">
                  {rosterReady
                    ? "You have 15 players, meet all position minimums, and are under the salary cap."
                    : "To finalize, you need 15 players, at least 2 at each position, and to stay under the cap."}
                </p>
              </div>

              <div className="mt-6 flex flex-wrap gap-4">
                <Button
                  className="bg-orange-500 text-white hover:bg-orange-600 disabled:bg-zinc-700 disabled:text-zinc-400"
                  onClick={saveRoster}
                  disabled={!rosterReady}
                >
                  Save Roster
                </Button>

                <Button
                  className="border border-white/20 bg-black/20 text-white hover:bg-white/10 hover:border-white/40"
                  onClick={() => setRoster([])}
                >
                  Clear Roster
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}