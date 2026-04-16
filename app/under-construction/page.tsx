"use client";

import { useState } from "react";

export default function UnderConstruction() {
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    if (password === "gm2026") {
      document.cookie = "access_granted=true; path=/";
      window.location.href = "/";
    } else {
      alert("Wrong password");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <h1 className="text-4xl mb-4">AllSports GM</h1>
      <p className="mb-6">🚧 Under Construction 🚧</p>

      <input
        type="password"
        placeholder="Enter password"
        className="p-2 text-black"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        className="mt-4 px-4 py-2 bg-orange-500"
      >
        Enter
      </button>
    </div>
  );
}