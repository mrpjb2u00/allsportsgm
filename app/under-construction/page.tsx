"use client";

import { useEffect, useState } from "react";

export default function UnderConstructionPage() {
  const images = [
    "/images/auth-basketball.jpg",
    "/images/auth-football2.jpg",
    "/images/auth-baseball.jpg",
  ];

  const [currentImage, setCurrentImage] = useState(0);
  const [password, setPassword] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  const handleSubmit = () => {
    if (password === "gm2026") {
      document.cookie = "access_granted=true; path=/";
      window.location.href = "/";
    } else {
      alert("Wrong password");
    }
  };

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
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/30 to-black/65" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6">
        <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-black/55 p-8 text-center shadow-[0_0_60px_rgba(0,0,0,0.6)] backdrop-blur-md md:p-10">
          <div className="mb-4 inline-flex items-center rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-sm font-medium text-orange-400">
            Private Beta Access
          </div>

          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
            AllSports GM
          </h1>

          <p className="mt-4 text-lg text-zinc-200 md:text-xl">
            Build. Manage. Dominate.
          </p>

          <p className="mt-3 text-sm text-zinc-300 md:text-base">
            The ultimate multi-sport franchise simulator is currently under construction.
            Enter the access password to continue.
          </p>

          <div className="mt-8 space-y-4">
            <input
              type="password"
              placeholder="Enter access password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 w-full rounded-xl border border-white/10 bg-black/40 px-4 text-center text-white outline-none transition focus:border-orange-500"
            />

            <button
              onClick={handleSubmit}
              className="h-12 w-full rounded-xl bg-orange-500 px-6 font-semibold text-white transition hover:bg-orange-600"
            >
              Enter Site
            </button>
          </div>

          <p className="mt-8 text-xs uppercase tracking-[0.25em] text-zinc-500">
            Early Access Only
          </p>
        </div>
      </div>
    </main>
  );
}