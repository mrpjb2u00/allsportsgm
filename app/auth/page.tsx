"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function AuthPage() {
  const images = [
    "/images/auth-basketball.jpg",
    "/images/auth-football2.jpg",
    "/images/auth-baseball.jpg",
  ];

  const [currentImage, setCurrentImage] = useState(0);
  const [mode, setMode] = useState<"signin" | "signup">("signin");

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

      <div className="relative flex min-h-screen items-center justify-center px-6">
        <div className="w-full max-w-md">
          <div className="mb-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-zinc-200 transition hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </div>

          <Card className="border border-white/10 bg-black/60 shadow-[0_0_60px_rgba(0,0,0,0.6)] backdrop-blur-md">
            <CardContent className="space-y-6 p-6 md:p-8">
              <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold text-white">
                  {mode === "signin" ? "Welcome Back" : "Create Your Account"}
                </h1>
                <p className="text-sm text-zinc-300">
                  {mode === "signin"
                    ? "Sign in to continue building your franchise"
                    : "Sign up to start building your sports dynasty"}
                </p>
              </div>

              <div className="grid grid-cols-2 rounded-xl border border-white/10 bg-black/30 p-1">
                <button
                  type="button"
                  onClick={() => setMode("signin")}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                    mode === "signin"
                      ? "bg-orange-500 text-white"
                      : "text-zinc-300 hover:text-white"
                  }`}
                >
                  Sign In
                </button>

                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                    mode === "signup"
                      ? "bg-orange-500 text-white"
                      : "text-zinc-300 hover:text-white"
                  }`}
                >
                  Sign Up
                </button>
              </div>

              <div className="space-y-4">
                {mode === "signup" && (
                  <>
                    <input
                      type="text"
                      placeholder="Username"
                      className="h-12 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 text-white focus:border-orange-500 focus:outline-none"
                    />

                    <div className="space-y-2">
                      <p className="text-sm text-zinc-400">Choose an avatar</p>

                      <div className="grid grid-cols-5 gap-3">
                        {["🏀", "🏈", "⚾", "🎾", "🏐", "🥎", "🏉", "⚽", "🎳", "🥊"].map(
                          (icon, i) => (
                            <button
                              key={i}
                              type="button"
                              className="flex h-12 w-12 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900 text-lg transition hover:border-orange-500 hover:bg-zinc-800"
                            >
                              {icon}
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  </>
                )}

                <input
                  type="email"
                  placeholder="Email"
                  className="h-12 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 text-white focus:border-orange-500 focus:outline-none"
                />

                <input
                  type="password"
                  placeholder="Password"
                  className="h-12 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 text-white focus:border-orange-500 focus:outline-none"
                />

                <Button className="h-12 w-full bg-orange-500 text-white hover:bg-orange-600">
                  {mode === "signin" ? "Sign In" : "Create Account"}
                </Button>
              </div>

              <p className="text-center text-sm text-zinc-400">
                {mode === "signin" ? "Don&apos;t have an account?" : "Already have an account?"}{" "}
                <button
                  type="button"
                  onClick={() =>
                    setMode((prev) => (prev === "signin" ? "signup" : "signin"))
                  }
                  className="cursor-pointer text-orange-400 hover:underline"
                >
                  {mode === "signin" ? "Sign up" : "Sign in"}
                </button>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}