'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import palak1 from "../palak1.jpeg";

const MIN_WORDS = 5000;

function countWords(text: string): number {
  return text
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0).length;
}

export default function AskPage() {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(true);
  const [showReason, setShowReason] = useState(false);
  const [reason, setReason] = useState("");
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const wordCount = countWords(reason);
  const isValidReason = wordCount >= MIN_WORDS;

  const handleYes = () => {
    router.push("/palak/yes");
  };

  const handleNo = () => {
    setShowReason(true);
    setSubmitError("");
  };

  const handleBackToQuestion = () => {
    setShowReason(false);
    setReason("");
    setSubmitError("");
  };

  const handleSubmitReason = () => {
    if (!isValidReason) {
      setSubmitError(
        `Please write at least ${MIN_WORDS} words, or go back and say Yes. You have ${wordCount} words.`
      );
      return;
    }
    setSubmitError("");
    router.push("/palak/yes");
  };

  if (!isMobile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white text-center p-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Mobile Only</h1>
          <p className="opacity-70">Open this page on a mobile device.</p>
        </div>
      </div>
    );
  }

  if (showReason) {
    return (
      <div className="min-h-screen text-white selection:bg-red-500/30 font-[family-name:var(--font-playfair)] bg-gradient-to-b from-[#211111] via-[#2d1214] to-[#1a0a0b] overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(234,42,51,0.15)_0%,rgba(33,17,17,0)_70%)]" />
        <div className="pointer-events-none absolute -top-20 -left-20 h-64 w-64 rounded-full bg-red-600/5 blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-[#b76e79]/10 blur-[120px]" />

        <div className="relative z-10 flex items-center p-4 pb-2">
          <button
            type="button"
            onClick={handleBackToQuestion}
            className="text-white/60 flex size-12 items-center justify-center"
          >
            ←
          </button>
          <h2 className="text-[#b76e79]/80 text-sm font-bold uppercase tracking-[0.2em] flex-1 text-center pr-12">
            Give a reason, Booboo
          </h2>
        </div>

        <div className="relative z-10 flex flex-1 flex-col px-6 pb-12 pt-4">
          <div className="w-full max-w-sm mx-auto rounded-xl p-6 flex flex-col bg-white/5 backdrop-blur-2xl border border-[#b76e79]/20 shadow-[0_8px_32px_rgba(0,0,0,0.8)]">
            <p className="text-[#b76e79]/80 text-sm mb-4">
              Why not, Gulla? Write at least {MIN_WORDS.toLocaleString()} words. I love you with all my heart — then you can still say Yes.
            </p>
            <textarea
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                setSubmitError("");
              }}
              placeholder="Start typing your reason here..."
              className="w-full min-h-[200px] rounded-lg bg-black/20 border border-[#b76e79]/20 text-white placeholder-white/40 p-4 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-red-500/50"
              rows={8}
            />
            <p className="text-[#b76e79]/60 text-xs mt-2">
              {wordCount.toLocaleString()} / {MIN_WORDS.toLocaleString()} words
            </p>
            {submitError && (
              <p className="text-red-400 text-sm mt-2">{submitError}</p>
            )}
            <div className="flex flex-col gap-3 mt-6">
              <button
                type="button"
                onClick={handleSubmitReason}
                className="rounded-full h-14 px-6 bg-red-600 text-white text-lg font-bold shadow-[0_0_20px_rgba(234,42,51,0.4)] active:scale-95 transition"
              >
                Submit reason ({wordCount >= MIN_WORDS ? "✓" : "need more words"})
              </button>
              <button
                type="button"
                onClick={handleBackToQuestion}
                className="rounded-full h-14 px-6 bg-white/5 hover:bg-white/10 text-[#b76e79] text-lg font-bold border border-[#b76e79]/20 active:scale-95 transition"
              >
                ← Go back and say Yes
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white selection:bg-red-500/30 font-[family-name:var(--font-playfair)] bg-gradient-to-b from-[#211111] via-[#2d1214] to-[#1a0a0b] overflow-hidden">
      {/* Spotlight */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(234,42,51,0.15)_0%,rgba(33,17,17,0)_70%)]" />
      <div className="pointer-events-none absolute -top-20 -left-20 h-64 w-64 rounded-full bg-red-600/5 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-[#b76e79]/10 blur-[120px]" />

      {/* App Bar */}
      <div className="relative z-10 flex items-center p-4 pb-2 justify-between">
        <Link
          href="/palak/story"
          className="text-white/60 flex size-12 items-center justify-center"
        >
          ←
        </Link>
        <h2 className="text-[#b76e79]/80 text-sm font-bold uppercase tracking-[0.2em] flex-1 text-center pr-12">
          The Final Question
        </h2>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pb-12">
        <div className="w-full max-w-sm rounded-xl p-8 flex flex-col items-center text-center space-y-8 bg-white/5 backdrop-blur-2xl border border-[#b76e79]/20 shadow-[0_8px_32px_rgba(0,0,0,0.8)]">
          <div className="space-y-4">
            <p className="text-[#b76e79]/60 text-lg font-medium tracking-wide">
              Out of all the people...
            </p>
            <p className="text-[#b76e79]/80 text-xl font-semibold tracking-wide">
              Out of all the days...
            </p>
          </div>

          <div className="relative py-4">
            <div className="absolute inset-0 bg-red-600/20 blur-2xl rounded-full" />
            <div className="text-red-500 text-6xl relative z-10">❤</div>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl font-extrabold leading-tight">
              Will You Be My{" "}
              <span className="text-red-500 italic">Valentine</span>, my Booboo?
            </h1>
            <p className="text-[#b76e79]/50 text-sm">
              Every heartbeat leads back to you, Gulla. I love you with all my heart.
            </p>
          </div>

          <div className="w-full">
            <div className="flex flex-col justify-end rounded-lg h-32 shadow-lg overflow-hidden border border-white/5 bg-cover bg-center relative">
              <Image
                src={palak1}
                alt="Reserved for Palak"
                fill
                className="object-cover"
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(0deg, rgba(33,17,17,0.8) 0%, rgba(33,17,17,0) 100%)",
                }}
              />
              <div className="relative p-3 mt-auto">
                <p className="text-white/80 text-[10px] font-bold uppercase tracking-widest">
                  Reserved for my Booboo
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col w-full gap-4 pt-4">
            <button
              type="button"
              onClick={handleYes}
              className="rounded-full h-14 px-6 bg-red-600 text-white text-lg font-bold shadow-[0_0_20px_rgba(234,42,51,0.4)] active:scale-95 transition"
            >
              YES 💖
            </button>
            <button
              type="button"
              onClick={handleNo}
              className="rounded-full h-14 px-6 bg-white/5 hover:bg-white/10 text-[#b76e79] text-lg font-bold border border-[#b76e79]/20 active:scale-95 transition"
            >
              No (give reason)
            </button>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-[#b76e79]/30 text-xs font-medium tracking-widest uppercase">
            I love you with all my heart, my Gulla
          </p>
        </div>
      </div>

      <div className="h-8" />
    </div>
  );
}
