"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Palette, Shield, Trophy } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CreateFranchisePage() {
  const router = useRouter();

  const images = [
    "/images/auth-basketball.jpg",
    "/images/auth-football2.jpg",
    "/images/auth-baseball.jpg",
  ];

  const [currentImage, setCurrentImage] = useState(0);

  const [city, setCity] = useState("Atlanta");
  const [teamName, setTeamName] = useState("Pulse");
  const [conference, setConference] = useState("Eastern Conference");
  const [gmUsername, setGmUsername] = useState("GM_Jordan");
  const [primaryColor, setPrimaryColor] = useState("#F97316");
  const [secondaryColor, setSecondaryColor] = useState("#E4E4E7");

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  const teamInitial = teamName.trim()
    ? teamName.trim().charAt(0).toUpperCase()
    : "A";

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

      <div className="relative h-[340px] w-full overflow-hidden">
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
              Franchise Setup
            </p>

            <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              Create your franchise
            </h1>

            <p className="max-w-2xl text-sm text-zinc-200 md:text-base">
              Choose your city, team name, conference, and colors to establish
              the identity of your future dynasty.
            </p>
          </div>
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <div className="mb-6 space-y-2">
              <h2 className="text-2xl font-semibold">Franchise Details</h2>
              <p className="text-sm text-zinc-400">
                Start with the basics. You can refine branding and deeper team
                details later.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm text-zinc-300">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Atlanta"
                  className="h-12 w-full rounded-xl border border-white/10 bg-black/30 px-4 text-white outline-none transition focus:border-orange-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-zinc-300">Team Name</label>
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="Pulse"
                  className="h-12 w-full rounded-xl border border-white/10 bg-black/30 px-4 text-white outline-none transition focus:border-orange-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-zinc-300">Conference</label>
                <select
                  value={conference}
                  onChange={(e) => setConference(e.target.value)}
                  className="h-12 w-full rounded-xl border border-white/10 bg-black/30 px-4 text-white outline-none transition focus:border-orange-500"
                >
                  <option>Eastern Conference</option>
                  <option>Western Conference</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-zinc-300">GM Username</label>
                <input
                  type="text"
                  value={gmUsername}
                  onChange={(e) => setGmUsername(e.target.value)}
                  placeholder="GM_Jordan"
                  className="h-12 w-full rounded-xl border border-white/10 bg-black/30 px-4 text-white outline-none transition focus:border-orange-500"
                />
              </div>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm text-zinc-300">Primary Color</label>
                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/30 px-4 py-3">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="h-8 w-10 cursor-pointer rounded border-0 bg-transparent p-0"
                  />
                  <input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-full bg-transparent text-white outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-zinc-300">Secondary Color</label>
                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/30 px-4 py-3">
                  <input
                    type="color"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="h-8 w-10 cursor-pointer rounded border-0 bg-transparent p-0"
                  />
                  <input
                    type="text"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="w-full bg-transparent text-white outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <Button
  className="h-12 bg-orange-500 px-6 text-white hover:bg-orange-600"
  onClick={() => {
    const franchiseData = {
      city,
      teamName,
      conference,
      gmUsername,
      primaryColor,
      secondaryColor,
    };

    localStorage.setItem("franchise", JSON.stringify(franchiseData));
    router.push("/dashboard");
  }}
>
  Save Franchise
</Button>

              <Button
                variant="outline"
                className="h-12 border-white/15 bg-black/20 px-6 text-white hover:bg-black/40"
                onClick={() => {
                  setCity("Atlanta");
                  setTeamName("Pulse");
                  setConference("Eastern Conference");
                  setGmUsername("GM_Jordan");
                  setPrimaryColor("#F97316");
                  setSecondaryColor("#E4E4E7");
                }}
              >
                Reset
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <div className="mb-4 flex items-center gap-2 text-orange-400">
                <Shield className="h-5 w-5" />
                <span className="text-sm font-medium">Preview</span>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/30 p-6">
                <div className="mb-6 flex items-center gap-4">
                  <div
                    className="flex h-16 w-16 items-center justify-center rounded-2xl text-2xl font-bold"
                    style={{
                      backgroundColor: primaryColor,
                      color: secondaryColor,
                    }}
                  >
                    {teamInitial}
                  </div>

                  <div>
                    <p className="text-2xl font-bold">
                      {city || "Your City"} {teamName || "Your Team"}
                    </p>
                    <p className="text-sm text-zinc-400">{conference}</p>
                    <p className="text-xs text-zinc-500">
                      GM: {gmUsername || "Your GM Name"}
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                      Salary Cap
                    </p>
                    <p className="mt-2 text-lg font-semibold">$150M</p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                      Roster Size
                    </p>
                    <p className="mt-2 text-lg font-semibold">15 Players</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <div className="mb-4 flex items-center gap-2 text-blue-400">
                <Palette className="h-5 w-5" />
                <span className="text-sm font-medium">Setup Notes</span>
              </div>

              <div className="space-y-3 text-sm text-zinc-400">
                <p>
                  Pick a strong city and team name combination that feels modern
                  and memorable.
                </p>
                <p>
                  Your colors will shape the look of your dashboard, franchise
                  identity, and future team branding.
                </p>
                <p>
                  Once your franchise is saved, the next step will be building
                  your roster under the salary cap.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}