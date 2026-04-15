"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Brain,
  HeartPulse,
  Search,
  Shield,
  Trophy,
  Users,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type StaffRole = "Head Coach" | "Assistant Coach" | "Trainer" | "Scout";

type StaffMember = {
  id: number;
  name: string;
  role: StaffRole;
  specialty: string;
  rating: number;
  salary: number;
};

const staffPool: StaffMember[] = [
  { id: 1, name: "Marcus Ellison", role: "Head Coach", specialty: "Offensive System", rating: 92, salary: 12 },
  { id: 2, name: "Darnell Price", role: "Head Coach", specialty: "Defensive Identity", rating: 88, salary: 9 },
  { id: 3, name: "Victor Hale", role: "Head Coach", specialty: "Player Development", rating: 84, salary: 6 },

  { id: 4, name: "Andre Waller", role: "Assistant Coach", specialty: "Perimeter Defense", rating: 87, salary: 5 },
  { id: 5, name: "Tobias Grant", role: "Assistant Coach", specialty: "Bench Rotation", rating: 82, salary: 4 },
  { id: 6, name: "Eli Mercer", role: "Assistant Coach", specialty: "Game Planning", rating: 79, salary: 3 },

  { id: 7, name: "Naomi Brooks", role: "Trainer", specialty: "Conditioning", rating: 91, salary: 6 },
  { id: 8, name: "Derrick Vaughn", role: "Trainer", specialty: "Recovery", rating: 85, salary: 4 },
  { id: 9, name: "Kira Sloan", role: "Trainer", specialty: "Load Management", rating: 80, salary: 3 },

  { id: 10, name: "Caleb West", role: "Scout", specialty: "College Talent", rating: 90, salary: 6 },
  { id: 11, name: "Jordan Pike", role: "Scout", specialty: "International Talent", rating: 84, salary: 4 },
  { id: 12, name: "Miles Dorsey", role: "Scout", specialty: "Value Prospects", rating: 78, salary: 2 },
];

const staffCap = 20;

export default function StaffPage() {
  const router = useRouter();

  const images = [
    "/images/auth-basketball.jpg",
    "/images/auth-football2.jpg",
    "/images/auth-baseball.jpg",
  ];

  const [currentImage, setCurrentImage] = useState(0);
  const [franchise, setFranchise] = useState<any>(null);
  const [selectedRole, setSelectedRole] = useState<"ALL" | StaffRole>("ALL");
  const [hiredStaff, setHiredStaff] = useState<StaffMember[]>([]);

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

    const savedStaff = localStorage.getItem("staff");
    if (savedStaff) {
      setHiredStaff(JSON.parse(savedStaff));
    }
  }, []);

  const filteredStaff = useMemo(() => {
    if (selectedRole === "ALL") return staffPool;
    return staffPool.filter((member) => member.role === selectedRole);
  }, [selectedRole]);

  const totalStaffSalary = hiredStaff.reduce((sum, member) => sum + member.salary, 0);
  const remainingStaffCap = staffCap - totalStaffSalary;

  const roleCounts = {
    "Head Coach": hiredStaff.filter((s) => s.role === "Head Coach").length,
    "Assistant Coach": hiredStaff.filter((s) => s.role === "Assistant Coach").length,
    Trainer: hiredStaff.filter((s) => s.role === "Trainer").length,
    Scout: hiredStaff.filter((s) => s.role === "Scout").length,
  };

  const staffReady =
    roleCounts["Head Coach"] >= 1 &&
    roleCounts["Assistant Coach"] >= 1 &&
    roleCounts.Trainer >= 1 &&
    roleCounts.Scout >= 1 &&
    totalStaffSalary <= staffCap;

  const addStaff = (member: StaffMember) => {
    const alreadyAdded = hiredStaff.some((s) => s.id === member.id);
    const roleLimitReached = roleCounts[member.role] >= 1;

    if (alreadyAdded) return;
    if (roleLimitReached) return;
    if (totalStaffSalary + member.salary > staffCap) return;

    setHiredStaff((prev) => [...prev, member]);
  };

  const removeStaff = (id: number) => {
    setHiredStaff((prev) => prev.filter((member) => member.id !== id));
  };

  const saveStaff = () => {
    localStorage.setItem("staff", JSON.stringify(hiredStaff));
    router.push("/dashboard");
  };

  const roleIcon = (role: StaffRole) => {
    switch (role) {
      case "Head Coach":
        return <Trophy className="h-4 w-4 text-orange-400" />;
      case "Assistant Coach":
        return <Users className="h-4 w-4 text-blue-400" />;
      case "Trainer":
        return <HeartPulse className="h-4 w-4 text-green-400" />;
      case "Scout":
        return <Search className="h-4 w-4 text-purple-400" />;
    }
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
              Staff Selection
            </p>

            <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              {franchise
                ? `${franchise.city} ${franchise.teamName} Staff`
                : "Build your staff"}
            </h1>

            <p className="max-w-2xl text-sm text-zinc-200 md:text-base">
              Hire the people behind the scenes. Coaching, training, and scouting
              can shape the future of your franchise.
            </p>
          </div>
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <div className="mb-3 flex items-center gap-2 text-orange-400">
              <Wallet className="h-5 w-5" />
              <span className="text-sm font-medium">Staff Budget</span>
            </div>
            <p className="text-2xl font-semibold">${remainingStaffCap}M</p>
            <p className="mt-1 text-sm text-zinc-400">
              ${totalStaffSalary}M used of ${staffCap}M
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <div className="mb-3 flex items-center gap-2 text-blue-400">
              <Users className="h-5 w-5" />
              <span className="text-sm font-medium">Staff Filled</span>
            </div>
            <p className="text-2xl font-semibold">{hiredStaff.length} / 4</p>
            <p className="mt-1 text-sm text-zinc-400">
              One Head Coach, one Assistant, one Trainer, one Scout
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <div className="mb-3 flex items-center gap-2 text-green-400">
              <Shield className="h-5 w-5" />
              <span className="text-sm font-medium">Role Coverage</span>
            </div>
            <p className="text-sm text-zinc-300">
              HC {roleCounts["Head Coach"]}/1 · AC {roleCounts["Assistant Coach"]}/1 · TR {roleCounts.Trainer}/1 · SC {roleCounts.Scout}/1
            </p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-semibold">Available Staff</h2>
                <p className="mt-1 text-sm text-zinc-400">
                  Hire staff that complements your roster-building style.
                </p>
              </div>

              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as "ALL" | StaffRole)}
                className="h-11 rounded-xl border border-white/10 bg-black/30 px-4 text-white outline-none"
              >
                <option value="ALL">All Roles</option>
                <option value="Head Coach">Head Coach</option>
                <option value="Assistant Coach">Assistant Coach</option>
                <option value="Trainer">Trainer</option>
                <option value="Scout">Scout</option>
              </select>
            </div>

            <div className="space-y-4">
              {filteredStaff.map((member) => {
                const alreadyAdded = hiredStaff.some((s) => s.id === member.id);
                const roleLimitReached = roleCounts[member.role] >= 1;
                const overCap = totalStaffSalary + member.salary > staffCap;

                return (
                  <div
                    key={member.id}
                    className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-black/30 p-4 md:flex-row md:items-center md:justify-between"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <p className="text-lg font-semibold">{member.name}</p>
                        <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-xs text-zinc-300">
                          {member.role}
                        </span>
                      </div>

                      <p className="text-sm text-zinc-400">{member.specialty}</p>

                      <div className="flex items-center gap-4 text-sm text-zinc-300">
                        <span className="flex items-center gap-1">
                          <Brain className="h-4 w-4 text-orange-400" />
                          {member.rating} Rating
                        </span>
                        <span>${member.salary}M</span>
                      </div>
                    </div>

                    <Button
                      disabled={alreadyAdded || roleLimitReached || overCap}
                      onClick={() => addStaff(member)}
                      className="bg-orange-500 text-white hover:bg-orange-600 disabled:bg-zinc-700 disabled:text-zinc-400"
                    >
                      {alreadyAdded
                        ? "Hired"
                        : overCap
                        ? "Over Cap"
                        : roleLimitReached
                        ? "Role Filled"
                        : "Hire"}
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <h2 className="text-2xl font-semibold">Your Staff</h2>
              <p className="mt-1 text-sm text-zinc-400">
                Your selected staff members will appear here.
              </p>

              <div className="mt-6 space-y-4">
                {hiredStaff.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-white/10 bg-black/20 p-6 text-center text-sm text-zinc-500">
                    No staff hired yet.
                  </div>
                ) : (
                  hiredStaff.map((member) => (
                    <div
                      key={member.id}
                      className="rounded-2xl border border-white/10 bg-black/30 p-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            {roleIcon(member.role)}
                            <p className="font-semibold">{member.name}</p>
                          </div>
                          <p className="text-sm text-zinc-400">
                            {member.role} · {member.specialty}
                          </p>
                          <p className="mt-1 text-sm text-zinc-300">
                            {member.rating} Rating · ${member.salary}M
                          </p>
                        </div>

                        <button
                          onClick={() => removeStaff(member.id)}
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
                  {staffReady ? "Staff ready" : "Staff not ready"}
                </p>
                <p className="mt-1 text-sm text-zinc-400">
                  {staffReady
                    ? "You have filled all required staff roles and stayed under budget."
                    : "To finalize, hire one Head Coach, one Assistant Coach, one Trainer, and one Scout while staying under budget."}
                </p>
              </div>

              <div className="mt-6 flex flex-wrap gap-4">
                <Button
                  className="bg-orange-500 text-white hover:bg-orange-600 disabled:bg-zinc-700 disabled:text-zinc-400"
                  onClick={saveStaff}
                  disabled={!staffReady}
                >
                  Save Staff
                </Button>

                <Button
                  className="border border-white/20 bg-black/20 text-white hover:bg-white/10 hover:border-white/40"
                  onClick={() => setHiredStaff([])}
                >
                  Clear Staff
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}