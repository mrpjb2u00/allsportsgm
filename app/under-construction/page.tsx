"use client";

import { useState, useEffect } from "react";

export default function UnderConstruction() {
  const [password, setPassword] = useState("");
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setFadeIn(true);
  }, []);

  const handleSubmit = () => {
    if (password === "gm2026") {
      document.cookie = "access_granted=true; path=/";
      window.location.href = "/";
    } else {
      alert("Wrong password");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black text-white overflow-hidden">

      {/* 🔥 Animated Background */}
      <div className="absolute inset-0 bg-[url('/images/auth-basketball.jpg')] bg-cover bg-center opacity-20 animate-pulse" />

      {/* 🔥 Dark overlay */}
      <div className="absolute inset-0 bg-black/80" />

      {/* 🔥 Content */}
      <div
        className={`relative z-10 text-center px-6 transition-all duration-1000 ${
          fadeIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <h1 className="text-5xl font-bold mb-4 tracking-wide">
          AllSports GM
        </h1>

        <p className="text-xl mb-2 text-gray-300">
          Build. Manage. Dominate.
        </p>

        <p className="mb-8 text-gray-400">
          🚧 Private Beta — Under Construction 🚧
        </p>

        {/* 🔐 Password Input */}
        <div className="flex flex-col items-center gap-4">
          <input
            type="password"
            placeholder="Enter access password"
            className="px-4 py-2 rounded bg-white text-black w-64 text-center"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-orange-500 hover:bg-orange-600 transition rounded font-semibold"
          >
            Enter
          </button>
        </div>

        {/* 🔥 Subtle footer */}
        <p className="mt-10 text-sm text-gray-500">
          Early access only
        </p>
      </div>
    </div>
  );
}