"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  ClipboardList,
  DollarSign,
  Lock,
  LogOut,
  Trophy,
  Users,
  UserCog,
  Zap,
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

type LoggedInUser = {
  name: string;
  email: string;
  tier: "Rookie" | "Pro" | "Veteran";
};

type MembershipTier = "Rookie" | "Pro" | "Veteran";

export default function DashboardPage() {
  const images = [
    "/images/auth-basketball.jpg",
    "/images/auth-football2.jpg",
    "/images/auth-baseball.jpg",
  ];

  const [currentImage, setCurrentImage] = useState(0);
  const [franchise, setFranchise] = useState<FranchiseData | null>(null);
  const [roster, setRoster] = useState<Player[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loggedInUser, setLoggedInUser] = useState<LoggedInUser | null>(null);
  const [tier, setTier] = useState<MembershipTier>("Rookie");

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

    const savedStaff = localStorage.getItem("staff");
    if (savedStaff) {
      setStaff(JSON.parse(savedStaff));
    }

    const savedUser = localStorage.getItem("logged_in_user");
    if (savedUser) {
      setLoggedInUser(JSON.parse(savedUser));
    }

    const tierMatch = document.cookie.match(/(?:^|;\s*)membership_tier=([^;]+)/);
    if (tierMatch?.[1]) {
      const decodedTier = decodeURIComponent(tierMatch[1]) as MembershipTier;
      if (decodedTier === "Rookie" || decodedTier === "Pro" || decodedTier === "Veteran") {
        setTier(decodedTier);
      }
    }
  }, []);

  const totalSalary = roster.reduce((sum, player) => sum + player.salary, 0);
  const salaryCap = 150;
  const remainingCap = salaryCap - totalSalary;

  const totalStaffSalary = staff.reduce((sum, member) => sum + member.salary, 0);
  const staffCap = 20;
  const remainingStaffCap = staffCap - totalStaffSalary;

  const handleLogout = () => {
    document.cookie = "logged_in=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    document.cookie = "membership_tier=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    localStorage.removeItem("logged_in_user");
    window.location.href = "/auth";
  };

  const resetAll = () => {
    localStorage.removeItem("franchise");
    localStorage.removeItem("roster");
    localStorage.removeItem("staff");
    location.reload();
  };

  const hasFranchise = !!franchise;
  const hasRoster = roster.length > 0;
  const fullRoster = roster.length === 15;
  const hasStaff = staff.length > 0;
  const fullStaff = staff.length === 4;

  const tierClasses =
    tier === "Rookie"
      ? "bg-zinc-700 text-zinc-200"
      : tier === "Pro"
      ? "bg-blue-500/20 text-blue-300"
      : "bg-orange-500/20 text-orange-300";

  const canUseRosterBuilder = tier === "Pro" || tier === "Veteran";
  const canUseStaff = tier === "Veteran";
  const canUseSimulation = tier === "Veteran";

  const renderFeatureButton = ({
    href,
    label,
    icon,
    isLocked,
    lockedText,
  }: {
    href: string;
    label: string;
    icon: React.ReactNode;
    isLocked: boolean;
    lockedText: string;
  }) => {
    if (isLocked) {
      return (
        <div className="group relative">
          <button
            disabled
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-zinc-900/60 px-6 text-sm font-medium text-zinc-500 md:w-auto"
          >
            <Lock className="h-4 w-4" />
            {label}
          </button>

          <p className="mt-2 text-xs text-zinc-500">{lockedText}</p>
        </div>
      );
    }

    return (
      <Link href={href}>
        <Button className="h-11 border border-white/20 bg-black/20 px-6 text-white hover:border-white/40 hover:bg-white/10">
          <span className="flex items-center gap-2">
            {label}
            {icon}
          </span>
        </Button>
      </Link>
    );
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/60 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:px-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2 font-semibold">
            <Trophy className="h-5 w-5 shrink-0 text-orange-400" />
            <span className="text-lg leading-none">AllSports GM</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-300">
            <span className="text-sm text-zinc-300">
              {loggedInUser?.name || franchise?.gmUsername || "GM"}
            </span>

            <span className={`rounded-full px-3 py-1 text-xs font-medium ${tierClasses}`}>
              {tier}
            </span>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-zinc-200 transition hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-300"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>

            {franchise && (
              <button
                onClick={resetAll}
                className="text-xs text-red-400 hover:text-red-300"
              >
                Reset Franchise
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="relative h-[360px] w-full overflow-hidden">
        <div className="absolute inset-0">
          {images.map((img, index) => (
            <div
              key={img}
              className={`absolute inset-0 bg-cover bg-center transition-all duration-[6000ms] ${
                index === currentImage ? "opacity-100" : "opacity-0"
              }`}
              style={{
                backgroundImage: `url(${img})`,
                transform: index === currentImage ? "scale(1.08)" : "scale(1)",
              }}
            />
          ))}
        </div>

        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60" />

        <div className="relative z-10 mx-auto flex h-full max-w-7xl items-end px-6 pb-10">
          <div className="max-w-3xl space-y-3">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-orange-400">
              Dashboard
            </p>

            <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              {franchise
                ? `${franchise.city} ${franchise.teamName}`
                : "Build your first franchise"}
            </h1>

            <p className="max-w-2xl text-sm text-zinc-200 md:text-base">
              {franchise
                ? `Your franchise is ready. Manage your roster, build your staff, and prepare to compete in the ${franchise.conference}.`
                : "Start your front office journey by creating a team, building your roster, and managing your staff and budget across every season."}
            </p>
          </div>
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
              Front Office Overview
            </h2>
            <p className="max-w-2xl text-sm text-zinc-400 md:text-base">
              {franchise
                ? "Your franchise identity is set. Keep building your roster and staff to prepare for the season."
                : "Set your identity, manage your budget, and build a championship-ready organization."}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/create-franchise">
              <Button className="h-11 bg-orange-500 px-6 text-white hover:bg-orange-600">
                <span className="flex items-center gap-2">
                  {franchise ? "Edit Franchise" : "Create Franchise"}
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Button>
            </Link>

            {renderFeatureButton({
              href: "/roster-builder",
              label: "Build Roster",
              icon: <ClipboardList className="h-4 w-4" />,
              isLocked: !canUseRosterBuilder,
              lockedText: "Upgrade to Pro or Veteran to unlock roster building.",
            })}

            {renderFeatureButton({
              href: "/staff",
              label: "Manage Staff",
              icon: <UserCog className="h-4 w-4" />,
              isLocked: !canUseStaff,
              lockedText: "Upgrade to Veteran to unlock staff management.",
            })}

            {renderFeatureButton({
              href: "/simulate",
              label: "Simulate Games",
              icon: <Zap className="h-4 w-4" />,
              isLocked: !canUseSimulation,
              lockedText: "Upgrade to Veteran to unlock live simulation.",
            })}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <div className="mb-4 flex items-center gap-2 text-orange-400">
              <Trophy className="h-5 w-5" />
              <span className="text-sm font-medium">Franchise</span>
            </div>

            {hasFranchise ? (
              <>
                <p className="text-xl font-semibold">
                  {franchise.city} {franchise.teamName}
                </p>
                <p className="mt-2 text-sm text-zinc-400">{franchise.conference}</p>
              </>
            ) : (
              <>
                <p className="text-xl font-semibold">Not created yet</p>
                <p className="mt-2 text-sm text-zinc-400">
                  Claim your team name, city, and colors to begin your dynasty.
                </p>
              </>
            )}
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <div className="mb-4 flex items-center gap-2 text-blue-400">
              <Users className="h-5 w-5" />
              <span className="text-sm font-medium">Roster</span>
            </div>

            <p className="text-xl font-semibold">{roster.length} / 15 Players</p>
            <p className="mt-2 text-sm text-zinc-400">
              {hasRoster
                ? "Your roster is taking shape. Keep building depth and balance."
                : "Build a balanced roster with stars, role players, and depth."}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <div className="mb-4 flex items-center gap-2 text-green-400">
              <DollarSign className="h-5 w-5" />
              <span className="text-sm font-medium">Player Budget</span>
            </div>

            <p className="text-xl font-semibold">${remainingCap}M Remaining</p>
            <p className="mt-2 text-sm text-zinc-400">
              ${totalSalary}M used of ${salaryCap}M cap
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <div className="mb-4 flex items-center gap-2 text-purple-400">
              <UserCog className="h-5 w-5" />
              <span className="text-sm font-medium">Staff</span>
            </div>

            <p className="text-xl font-semibold">{staff.length} / 4 Staff</p>
            <p className="mt-2 text-sm text-zinc-400">
              ${totalStaffSalary}M used · ${remainingStaffCap}M left
            </p>
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <h2 className="text-xl font-semibold">Membership Access</h2>

            <div className="mt-6 space-y-4">
              <div className="rounded-xl border border-white/10 bg-black/30 p-4">
                <p className="font-medium text-white">Rookie</p>
                <p className="mt-1 text-sm text-zinc-400">
                  Create a franchise and explore the basic front office experience.
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-black/30 p-4">
                <p className="font-medium text-white">Pro</p>
                <p className="mt-1 text-sm text-zinc-400">
                  Unlock roster building and deeper franchise setup tools.
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-black/30 p-4">
                <p className="font-medium text-white">Veteran</p>
                <p className="mt-1 text-sm text-zinc-400">
                  Unlock the full experience including staff management and game simulation.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <h2 className="text-xl font-semibold">Season Snapshot</h2>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-black/30 px-4 py-3">
                <span className="text-sm text-zinc-400">Current season</span>
                <span className="font-medium">Not started</span>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-black/30 px-4 py-3">
                <span className="text-sm text-zinc-400">Roster progress</span>
                <span className="font-medium">{roster.length} / 15</span>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-black/30 px-4 py-3">
                <span className="text-sm text-zinc-400">Staff progress</span>
                <span className="font-medium">{staff.length} / 4</span>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-black/30 px-4 py-3">
                <span className="text-sm text-zinc-400">Membership tier</span>
                <span className="font-medium">{tier}</span>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-black/30 px-4 py-3">
                <span className="text-sm text-zinc-400">Cap space left</span>
                <span className="font-medium">${remainingCap}M</span>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-black/30 px-4 py-3">
                <span className="text-sm text-zinc-400">Staff budget left</span>
                <span className="font-medium">${remainingStaffCap}M</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 rounded-2xl border border-orange-500/20 bg-orange-500/5 p-6">
          <h3 className="text-lg font-semibold text-orange-300">Current Tier Permissions</h3>
          <p className="mt-2 text-sm text-zinc-300">
            {tier === "Rookie" &&
              "Rookie can create a franchise, but roster building, staff management, and simulation are locked."}
            {tier === "Pro" &&
              "Pro can create a franchise and build a roster, but staff management and simulation are still locked."}
            {tier === "Veteran" &&
              "Veteran has full access to franchise creation, roster building, staff management, and simulation."}
          </p>
        </div>
      </section>
    </main>
  );
}