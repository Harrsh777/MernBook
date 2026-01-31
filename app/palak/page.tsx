'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Page() {
  const [isMobile, setIsMobile] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isMobile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1a0d0e] text-white text-center p-6">
        <div className="max-w-sm">
          <p className="text-6xl mb-4">📱</p>
          <h1 className="text-2xl font-bold mb-2">Made for your phone</h1>
          <p className="opacity-70 text-sm">
            Open this link on your mobile for the full experience.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0f0809] text-white overflow-hidden min-h-screen select-none">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#1a0d0e] via-[#140a0c] to-[#0d0607]" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_100%_80%_at_50%_0%,rgba(190,100,120,0.12)_0%,transparent_50%)]" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_100%,rgba(120,60,80,0.08)_0%,transparent_50%)]" />

      <div className="relative z-10 min-h-screen flex flex-col items-center px-5 pt-6 pb-10">
        {/* Top chip */}
        <div
          className={`w-full flex justify-center transition-all duration-700 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3"
          }`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-rose-400/20 bg-black/20 backdrop-blur-xl">
            <span className="text-rose-400/90 text-sm">♥</span>
            <span className="text-[11px] font-medium tracking-[0.15em] uppercase text-rose-200/80">
              For my Booboo only
            </span>
          </div>
        </div>

        {/* Hero image - palak2 */}
        <div
          className={`flex-1 w-full max-w-[320px] flex flex-col items-center justify-center py-6 transition-all duration-700 delay-100 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="relative w-full aspect-[3/4] max-h-[45vh] rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10">
            <Image
              src="/palak/palak2.jpeg"
              alt=""
              fill
              className="object-cover"
              sizes="320px"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 p-4 pt-12 pointer-events-none">
              <p className="text-white/90 text-sm font-medium drop-shadow-lg">
                My Gulla, my Booboo
              </p>
            </div>
          </div>
        </div>

        {/* Copy */}
        <div
          className={`w-full max-w-[320px] text-center space-y-4 transition-all duration-700 delay-200 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <h1 className="text-2xl font-semibold leading-tight text-white/95">
            I made something{" "}
            <span className="text-rose-400 italic font-medium">for you</span>
          </h1>
          <p className="text-white/55 text-sm font-light leading-relaxed max-w-[280px] mx-auto">
            I love you with all my heart. Every word here is for you, Booba.
          </p>
        </div>

        {/* CTA */}
        <div
          className={`w-full max-w-[320px] flex flex-col items-center gap-6 pt-6 transition-all duration-700 delay-300 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <Link
            href="/palak/story"
            className="w-full flex items-center justify-center rounded-2xl h-14 px-6
              bg-gradient-to-r from-rose-500 to-rose-600 text-white text-base font-semibold
              shadow-[0_0_32px_rgba(244,63,94,0.3),0_4px_16px_rgba(0,0,0,0.25)]
              active:scale-[0.98] transition-all duration-200
              border border-rose-400/20"
          >
            <span className="flex items-center gap-2">
              Begin our story
              <span className="text-lg">♥</span>
            </span>
          </Link>

          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className={`h-1 rounded-full transition-all duration-500 ${
                    i === 1 ? "w-5 bg-rose-400/90" : "w-1 bg-white/20"
                  }`}
                />
              ))}
            </div>
            <p className="text-white/25 text-[10px] uppercase tracking-[0.2em]">
              Tap to explore
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
