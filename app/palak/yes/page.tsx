'use client';

import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import palak1 from "../palak1.jpeg";

const ZAALIMA_AUDIO = "/palak/Zaalima_Raees_Shah_Rukh_Khan_Arijit_Singh_Harshdeep_Kaur_JAM8_Pritam_256kbps.webm";

export default function YesPage() {
  const [isMobile, setIsMobile] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      const audio = audioRef.current;
      if (audio) audio.play().then(() => setIsPlaying(true)).catch(() => {});
    }, 300);
    return () => clearTimeout(t);
  }, []);

  const playZaalima = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.play().then(() => setIsPlaying(true)).catch(() => {});
  }, []);

  const toggleMusic = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      playZaalima();
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  }, [playZaalima]);

  if (!isMobile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white text-center p-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Mobile Only Page</h1>
          <p className="opacity-70">Please open this on a mobile device 📱</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-[family-name:var(--font-playfair)] text-white overflow-x-hidden bg-gradient-to-b from-[#211111] via-[#3a1a1a] to-[#211111]">
      <audio
        ref={audioRef}
        src={ZAALIMA_AUDIO}
        loop
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        onError={() => setIsPlaying(false)}
      />

      {/* Music toggle - floating */}
      <button
        type="button"
        onClick={toggleMusic}
        className="fixed top-4 right-4 z-20 w-11 h-11 rounded-full bg-white/10 backdrop-blur border border-red-500/30 flex items-center justify-center text-red-400 shadow-lg active:scale-95 transition"
        aria-label={isPlaying ? "Pause music" : "Play Zaalima"}
        title={isPlaying ? "Pause" : "Play Zaalima"}
      >
        {isPlaying ? "⏸" : "▶"}
      </button>

      {/* Background Effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-red-600/20 blur-[80px] rounded-full" />
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-yellow-400/10 blur-[100px] rounded-full" />
        <div className="absolute inset-0 opacity-60 bg-[radial-gradient(circle_at_center,rgba(234,42,51,0.2)_0%,transparent_70%)]" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center p-6 justify-between">
        <div className="text-red-500 flex size-12 items-center justify-center rounded-full bg-red-500/10 text-2xl">
          ❤️
        </div>

        <div className="flex-1 text-center">
          <h2 className="text-white/80 text-sm font-medium tracking-widest uppercase">
            To: My Booboo
          </h2>
          <p className="text-rose-400/80 text-xs mt-1 italic">I love you with all my heart, Gulla</p>
          <div className="h-0.5 w-8 bg-yellow-400/50 mx-auto mt-1 rounded-full" />
        </div>

        <div className="w-12 flex justify-end" />
      </header>

      {/* Main */}
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pb-12">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-red-600 blur-3xl opacity-20 scale-150 animate-pulse" />
          <div className="relative w-48 h-48 bg-gradient-to-br from-red-600 via-red-600 to-[#B76E79] rounded-full flex items-center justify-center shadow-2xl border-4 border-yellow-400/20">
            <span className="text-[90px]">🎉</span>
          </div>

          <div className="absolute -top-4 -right-2 text-yellow-400 animate-bounce text-2xl">
            ✨
          </div>
        </div>

        <div className="text-center space-y-4 max-w-sm">
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight drop-shadow-lg">
            Best Decision <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-400 to-[#B76E79]">
              Ever Made ❤️
            </span>
          </h1>

          <p className="text-white/70 text-lg font-light px-4 leading-relaxed">
            Screenshot this — it&apos;s official now, Booboo. You and me, forever. I love you with all my heart.
          </p>
        </div>

        <div className="w-full max-w-sm mt-12">
          <div className="rounded-xl p-6 flex items-center justify-between border border-yellow-400/20 shadow-xl bg-red-500/10 backdrop-blur-xl">
            <div className="flex flex-col">
              <span className="text-xs text-yellow-400/80 font-bold uppercase tracking-widest mb-1">
                Current Status
              </span>
              <span className="font-semibold text-lg flex items-center gap-2">
                Forever & Always ✔
              </span>
            </div>
            <div className="h-12 w-12 bg-white/10 rounded-full flex items-center justify-center">
              🔓
            </div>
          </div>
        </div>

        <div className="mt-8 w-full max-w-sm rounded-xl overflow-hidden shadow-2xl relative h-48">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
          <Image
            src={palak1}
            alt="A new chapter"
            fill
            className="object-cover"
          />
          <div className="absolute bottom-4 left-4 right-4 z-20 flex justify-between items-end">
            <div>
              <p className="text-xs uppercase opacity-70">A new chapter</p>
              <p className="font-bold italic">January 2024</p>
            </div>
            <div className="flex -space-x-3">
              <div className="h-10 w-10 rounded-full border-2 border-red-500 bg-black flex items-center justify-center text-xs font-bold">
                P
              </div>
              <div className="h-10 w-10 rounded-full border-2 border-yellow-400 bg-black flex items-center justify-center text-xs font-bold">
                U
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="relative z-10 p-8 flex flex-col items-center gap-4">
        <button
          type="button"
          onClick={() => window.print()}
          className="bg-red-600 hover:bg-red-600/90 w-full max-w-sm py-4 rounded-full font-bold text-lg shadow-xl shadow-red-600/20 transition flex items-center justify-center gap-2"
        >
          📸 Save the Moment
        </button>

        <p className="text-white/40 text-[10px] uppercase tracking-[0.2em] text-center">
          I love you with all my heart — for my Gulla, my Booboo
        </p>
      </footer>

      <div className="h-6" />
    </div>
  );
}
