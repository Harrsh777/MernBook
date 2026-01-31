'use client';

import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

import palak1 from "../palak1.jpeg";
import palak2 from "../palak2.jpeg";
import palak3 from "../palak3.jpeg";
import palak4 from "../palak4.jpeg";

const SLIDES = [
  {
    title: "Zaalima",
    caption: "You said yes to my chaos, Gulla. I love you with all my heart.",
    image: palak1,
    audioSrc: "/palak/Zaalima_Raees_Shah_Rukh_Khan_Arijit_Singh_Harshdeep_Kaur_JAM8_Pritam_256kbps.webm",
  },
  {
    title: "Lover",
    caption: "My heart’s been yours from the start, my Booboo. Every beat is for you.",
    image: palak2,
    audioSrc: "/palak/Taylor_Swift_-_Lover_Official_Music_Video_48kbps.mp4",
  },
  {
    title: "Golden Hour",
    caption: "Every moment with you feels like golden hour, Booba. You light up my world.",
    image: palak3,
    audioSrc: "/palak/JVKE_-_golden_hour_official_music_video_48kbps.mp4",
  },
  {
    title: "Jogi",
    caption: "You’re the one my soul was waiting for, Gulla. I love you with all my heart.",
    image: palak4,
    audioSrc: "/palak/Jogi_-_Lyrical_Shaadi_Mein_Zaroor_Aana_Rajkummar_Rao_Kriti_Kharbanda_Arko_ft_Aakanksha_Sharma_48kbps.mp4",
  },
];

export default function StoryPage() {
  const [slide, setSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const playTrackForIndex = useCallback((index: number) => {
    const audio = audioRef.current;
    if (!audio || index < 0 || index >= SLIDES.length) return;
    audio.src = SLIDES[index].audioSrc;
    audio.play().then(() => setIsPlaying(true)).catch(() => {});
  }, []);

  const playCurrentTrack = useCallback(() => {
    playTrackForIndex(slide);
  }, [slide, playTrackForIndex]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      playCurrentTrack();
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  }, [playCurrentTrack]);

  useEffect(() => {
    const t = setTimeout(() => {
      playTrackForIndex(0);
    }, 400);
    return () => clearTimeout(t);
  }, [playTrackForIndex]);

  const goNext = () => {
    if (slide < SLIDES.length - 1) {
      const nextIndex = slide + 1;
      setSlide(nextIndex);
      playTrackForIndex(nextIndex);
    }
  };

  const goPrev = () => {
    if (slide > 0) {
      const prevIndex = slide - 1;
      setSlide(prevIndex);
      playTrackForIndex(prevIndex);
    }
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

  const current = SLIDES[slide];
  const isLast = slide === SLIDES.length - 1;

  return (
    <div className="min-h-screen text-white overflow-hidden font-[family-name:var(--font-playfair)] bg-gradient-to-b from-[#211111] via-[#2d1214] to-[#1a0a0b]">
      {/* Background audio - plays MP3 from public/palak/ (zaalima.mp3, lover.mp3, etc.) */}
      <audio
        ref={audioRef}
        loop
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        onError={() => setIsPlaying(false)}
      />

      {/* Music toggle - minimal */}
      <button
        type="button"
        onClick={togglePlay}
        className="fixed top-5 right-5 z-20 w-10 h-10 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center text-[#b76e79]/90 shadow-lg active:scale-95 transition hover:bg-white/10"
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        <span className="text-sm">{isPlaying ? "⏸" : "▶"}</span>
      </button>

      {/* Spotlight */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(234,42,51,0.12)_0%,rgba(33,17,17,0)_70%)]" />
      <div className="pointer-events-none absolute -top-20 -left-20 h-64 w-64 rounded-full bg-red-600/5 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-[#b76e79]/10 blur-[120px]" />

      {/* App bar */}
      <div className="relative z-10 flex items-center justify-between p-4 pb-2">
        {slide > 0 ? (
          <button
            type="button"
            onClick={goPrev}
            className="text-white/60 flex size-12 items-center justify-center touch-manipulation"
            aria-label="Previous"
          >
            ←
          </button>
        ) : (
          <Link
            href="/palak"
            className="text-white/60 flex size-12 items-center justify-center touch-manipulation"
            aria-label="Back"
          >
            ←
          </Link>
        )}
        <span className="text-[#b76e79]/80 text-sm font-bold uppercase tracking-[0.2em] flex-1 text-center pr-12">
          Our Story, Booboo
        </span>
      </div>

      {/* Slide content */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pb-8 min-h-[calc(100vh-180px)]">
        <div
          key={slide}
          className="w-full max-w-sm flex flex-col items-center text-center space-y-8"
        >
          {/* Image */}
          <div className="relative w-full aspect-[3/4] max-h-[52vh] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10">
            <Image
              src={current.image}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 400px"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
          </div>
          <p className="text-white/90 text-[15px] font-medium italic leading-relaxed max-w-[280px] px-2 text-balance">
            {current.caption}
          </p>
        </div>

        {/* Progress dots */}
        <div className="flex gap-2.5 mt-8">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setSlide(i);
                playTrackForIndex(i);
              }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === slide ? "w-7 bg-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.4)]" : "w-1.5 bg-white/25 hover:bg-white/40"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Next / Continue */}
        <div className="mt-6 w-full max-w-sm space-y-3">
          {isLast && (
            <p className="text-[#b76e79]/70 text-sm italic text-center">
              I love you with all my heart, my Booboo.
            </p>
          )}
          {isLast ? (
            <Link
              href="/palak/ask"
              className="block w-full rounded-full h-14 bg-red-600 text-white text-lg font-bold flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(234,42,51,0.4)] active:scale-95 transition"
            >
              Continue to the question →
            </Link>
          ) : (
            <button
              type="button"
              onClick={goNext}
              className="w-full rounded-full h-14 bg-red-600/90 text-white text-lg font-bold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(234,42,51,0.3)] active:scale-95 transition"
            >
              Next →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
