"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const images = [
    "/images/auth-basketball.jpg",
    "/images/auth-football2.jpg",
    "/images/auth-baseball.jpg",
  ];

  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <main className="relative min-h-screen overflow-hidden text-white">
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

      <div className="absolute inset-0 bg-black/15" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/35 to-black/65" />

      <header className="fixed top-0 left-0 z-50 flex w-full items-center justify-between border-b border-white/10 bg-black/60 px-6 py-4 backdrop-blur-md">
        <div className="flex items-center gap-2 font-semibold text-white">
          <Trophy className="h-5 w-5 text-orange-400" />
          <span>AllSports GM</span>
        </div>

        <div className="flex items-center gap-6">
          <nav className="hidden items-center gap-6 text-sm text-zinc-300 md:flex">
            <span className="cursor-pointer transition hover:text-white">Features</span>
            <span className="cursor-pointer transition hover:text-white">Leagues</span>
            <span className="cursor-pointer transition hover:text-white">About</span>
          </nav>

          <Link
            href="/auth"
            className="text-sm text-zinc-200 transition hover:text-white"
          >
            Sign In
          </Link>

          <Link href="/auth">
            <Button className="h-10 bg-orange-500 px-4 text-white hover:bg-orange-600">
              Get Started
            </Button>
          </Link>
        </div>
      </header>

      <div className="relative flex min-h-screen items-center justify-center px-6">
        <div className="max-w-4xl space-y-6 pt-16 text-center">
          <div className="flex justify-center">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-sm font-medium text-orange-400">
              <Trophy className="h-4 w-4" />
              <span>AllSports GM</span>
            </div>
          </div>

          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl xl:text-8xl">
            Build. Manage. Dominate.
          </h1>

          <p className="text-xl text-zinc-100 sm:text-2xl lg:text-3xl">
            The ultimate multi-sport franchise simulator.
          </p>

          <p className="mx-auto max-w-3xl text-sm text-zinc-200 sm:text-base lg:text-lg">
            Create your franchise, manage your roster, and compete across multiple
            sports in one modern GM experience.
          </p>

          <div className="flex justify-center gap-4 pt-4">
            <Link href="/auth">
              <Button className="h-12 bg-orange-500 px-8 text-base text-white hover:bg-orange-600">
                <span className="flex items-center gap-2">
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Button>
            </Link>

            <Button
              variant="outline"
              className="h-12 border-zinc-500/60 bg-black/20 px-8 text-base text-white hover:bg-black/40"
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}