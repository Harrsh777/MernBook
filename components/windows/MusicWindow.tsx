"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  Search,
  Home,
  Compass,
  Radio,
  Clock,
  User,
  Disc,
  Music2,
  Tv,
  ShoppingBag,
  ListMusic,
  Heart,
  Briefcase,
  Shuffle,
  SkipBack,
  Play,
  Pause,
  SkipForward,
  Repeat,
  MoreHorizontal,
  Volume2,
} from "lucide-react";

interface Track {
  title: string;
  artist: string;
  cover: string;
  audioUrl: string;
}

export default function MusicWindow() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [activeTab, setActiveTab] = useState("new");
  const [volume, setVolume] = useState(0.8);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(180);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const songs: Track[] = [
    {
      title: "Lo-Fi Midnight Chill",
      artist: "Lo-Fi Beats • Harsh Srivastava",
      cover: "/a.jpg",
      audioUrl: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3",
    },
    {
      title: "AWS Cloud Ambient Synth",
      artist: "Chillwave Tech",
      cover: "/a.jpg",
      audioUrl: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3",
    },
    {
      title: "Next.js 15 Flow State",
      artist: "Developer Beats",
      cover: "/a.jpg",
      audioUrl: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3",
    },
    {
      title: "Full-Stack Night Drive",
      artist: "Synthwave Digital",
      cover: "/a.jpg",
      audioUrl: "https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f792cb.mp3",
    },
  ];

  const currentTrack = songs[currentIdx];

  useEffect(() => {
    const audio = new Audio();
    audio.volume = volume;
    audioRef.current = audio;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      if (audio.duration) setDuration(audio.duration);
    };

    const handleEnded = () => {
      setCurrentIdx((prev) => (prev + 1) % songs.length);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.pause();
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.src = currentTrack.audioUrl;
    if (isPlaying) {
      audioRef.current.play().catch(() => setIsPlaying(false));
    }
  }, [currentIdx]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      if (!audioRef.current.src) {
        audioRef.current.src = currentTrack.audioUrl;
      }
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  };

  const handleVolumeChange = (v: number) => {
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
  };

  const handleSeek = (time: number) => {
    setCurrentTime(time);
    if (audioRef.current) audioRef.current.currentTime = time;
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="h-full w-full bg-transparent text-white flex select-none overflow-hidden font-sans backdrop-blur-2xl">
      {/* 1. Left Sidebar Navigation */}
      <div className="w-56 bg-white/5 p-3 border-r border-white/10 flex flex-col justify-between text-xs text-white/80 shrink-0 backdrop-blur-xl">
        <div className="flex flex-col gap-4 overflow-y-auto">
          {/* Search Input */}
          <div className="bg-[#2c2c2e] border border-white/10 rounded-lg px-2.5 py-1.5 flex items-center gap-2 text-white/60">
            <Search className="w-3.5 h-3.5" />
            <span className="text-xs">Search</span>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col gap-0.5">
            <button
              onClick={() => setActiveTab("home")}
              className={`w-full px-2.5 py-1.5 rounded-lg flex items-center gap-2.5 font-medium transition-colors ${
                activeTab === "home" ? "bg-rose-500/20 text-rose-400 font-semibold" : "hover:bg-white/5 text-white/80"
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </button>
            <button
              onClick={() => setActiveTab("new")}
              className={`w-full px-2.5 py-1.5 rounded-lg flex items-center gap-2.5 font-medium transition-colors ${
                activeTab === "new" ? "bg-rose-500/20 text-rose-400 font-semibold" : "hover:bg-white/5 text-white/80"
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>New</span>
            </button>
            <button
              onClick={() => setActiveTab("radio")}
              className={`w-full px-2.5 py-1.5 rounded-lg flex items-center gap-2.5 font-medium transition-colors ${
                activeTab === "radio" ? "bg-rose-500/20 text-rose-400 font-semibold" : "hover:bg-white/5 text-white/80"
              }`}
            >
              <Radio className="w-4 h-4" />
              <span>Radio</span>
            </button>
          </div>

          {/* Library Section */}
          <div>
            <div className="text-[10px] font-semibold text-white/40 uppercase tracking-wider px-2.5 mb-1">
              Library
            </div>
            <div className="flex flex-col gap-0.5">
              <button className="px-2.5 py-1 rounded-md hover:bg-white/5 flex items-center gap-2 text-white/70">
                <Clock className="w-3.5 h-3.5" /> Recently Added
              </button>
              <button className="px-2.5 py-1 rounded-md hover:bg-white/5 flex items-center gap-2 text-white/70">
                <User className="w-3.5 h-3.5" /> Artists
              </button>
              <button className="px-2.5 py-1 rounded-md hover:bg-white/5 flex items-center gap-2 text-white/70">
                <Disc className="w-3.5 h-3.5" /> Albums
              </button>
              <button className="px-2.5 py-1 rounded-md hover:bg-white/5 flex items-center gap-2 text-white/70">
                <Music2 className="w-3.5 h-3.5" /> Songs
              </button>
              <button className="px-2.5 py-1 rounded-md hover:bg-white/5 flex items-center gap-2 text-white/70">
                <Tv className="w-3.5 h-3.5" /> Music Videos
              </button>
            </div>
          </div>

          {/* Store Section */}
          <div>
            <div className="text-[10px] font-semibold text-white/40 uppercase tracking-wider px-2.5 mb-1">
              Store
            </div>
            <button className="w-full px-2.5 py-1 rounded-md hover:bg-white/5 flex items-center gap-2 text-white/70">
              <ShoppingBag className="w-3.5 h-3.5" /> iTunes Store
            </button>
          </div>

          {/* Playlists Section */}
          <div>
            <div className="text-[10px] font-semibold text-white/40 uppercase tracking-wider px-2.5 mb-1">
              Playlists
            </div>
            <div className="flex flex-col gap-0.5">
              <button className="px-2.5 py-1 rounded-md hover:bg-white/5 flex items-center gap-2 text-white/70">
                <ListMusic className="w-3.5 h-3.5" /> All Playlists
              </button>
              <button className="px-2.5 py-1 rounded-md hover:bg-white/5 flex items-center gap-2 text-white/70">
                <Heart className="w-3.5 h-3.5 text-rose-400" /> Favorite Songs
              </button>
              <button className="px-2.5 py-1 rounded-md hover:bg-white/5 flex items-center gap-2 text-white/70">
                <Briefcase className="w-3.5 h-3.5" /> Work focus
              </button>
            </div>
          </div>
        </div>

        {/* User Profile Footer */}
        <div className="pt-3 border-t border-white/10 flex items-center gap-2.5">
          <div className="relative w-7 h-7 rounded-full overflow-hidden shrink-0 border border-white/20">
            <Image src="/profile.jpg" alt="Profile" fill className="object-cover" />
          </div>
          <span className="text-xs font-semibold text-white truncate">Harsh Srivastava</span>
        </div>
      </div>

      {/* 2. Main Content Area */}
      <div className="flex-1 bg-[#141416] p-6 overflow-y-auto relative pb-28">
        <h1 className="text-3xl font-bold text-white mb-4 tracking-tight">New</h1>

        {/* Top Featured Hero Cards Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Hero Banner 1 */}
          <div
            onClick={togglePlay}
            className="bg-gradient-to-br from-purple-900/40 to-slate-900 border border-white/10 rounded-2xl p-4 flex flex-col justify-between h-52 relative overflow-hidden group cursor-pointer shadow-lg hover:border-white/30 transition-all"
          >
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400">
                RECOMMENDED TRACK
              </span>
              <h2 className="text-lg font-bold text-white leading-snug">{currentTrack.title}</h2>
              <p className="text-xs text-white/70">{currentTrack.artist}</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-rose-300 font-semibold">
              <Play className="w-4 h-4 fill-current" />
              <span>Click to {isPlaying ? "Pause" : "Play Music"}</span>
            </div>
          </div>

          {/* Hero Banner 2 */}
          <div className="bg-gradient-to-br from-amber-900/40 to-amber-950 border border-white/10 rounded-2xl p-4 flex flex-col justify-between h-52 relative overflow-hidden group cursor-pointer shadow-lg">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                EVERYDAY HITS
              </span>
              <h2 className="text-lg font-bold text-white leading-snug">Developer Lo-Fi Stream</h2>
              <p className="text-xs text-amber-200">Apple Music Chill Hits</p>
            </div>
            <p className="text-[11px] text-white/60">Real HTML5 Web Audio Stream.</p>
          </div>
        </div>

        {/* Latest Songs Section */}
        <div>
          <h2 className="text-base font-bold text-white mb-3 flex items-center gap-1">
            Latest Songs <span className="text-white/40 text-xs font-normal">&gt;</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {songs.map((song, idx) => {
              const isCurrent = currentIdx === idx;
              return (
                <div
                  key={idx}
                  onClick={() => {
                    setCurrentIdx(idx);
                    setIsPlaying(true);
                  }}
                  className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    isCurrent
                      ? "bg-rose-500/20 border-rose-500/40 text-white font-semibold shadow-md"
                      : "bg-white/5 border-transparent hover:border-white/10 text-white/80"
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <div className="w-10 h-10 rounded-lg bg-white/10 relative overflow-hidden shrink-0 border border-white/10">
                      <Image src={song.cover} alt={song.title} fill className="object-cover" />
                      {isCurrent && isPlaying && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <Disc className="w-5 h-5 text-rose-400 animate-spin" />
                        </div>
                      )}
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-bold text-white truncate">{song.title}</div>
                      <div className="text-[11px] text-white/50 truncate">{song.artist}</div>
                    </div>
                  </div>

                  <MoreHorizontal className="w-4 h-4 text-white/30 group-hover:text-white/80 shrink-0" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Floating Bottom Glass Now Playing Bar */}
        <div className="fixed bottom-4 left-[35%] md:left-[45%] -translate-x-1/2 w-[90%] max-w-xl bg-[#2c2c2e]/90 border border-white/20 rounded-full px-4 py-2.5 backdrop-blur-2xl shadow-2xl flex items-center justify-between text-white z-30">
          {/* Playback Controls */}
          <div className="flex items-center gap-2">
            <Shuffle className="w-3.5 h-3.5 text-white/50 cursor-pointer hover:text-white" />
            <SkipBack
              onClick={() => setCurrentIdx((prev) => (prev - 1 + songs.length) % songs.length)}
              className="w-4 h-4 cursor-pointer hover:text-white"
            />
            <button
              onClick={togglePlay}
              className="p-2 rounded-full bg-white text-black hover:scale-105 transition-transform shadow-md"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current ml-0.5" />
              )}
            </button>
            <SkipForward
              onClick={() => setCurrentIdx((prev) => (prev + 1) % songs.length)}
              className="w-4 h-4 cursor-pointer hover:text-white"
            />
            <Repeat className="w-3.5 h-3.5 text-white/50 cursor-pointer hover:text-white" />
          </div>

          {/* Track Info & Scrubber */}
          <div className="flex flex-col items-center justify-center flex-1 px-4 truncate">
            <div className="flex items-center gap-2 truncate">
              <div className="w-6 h-6 rounded-md bg-white/10 relative overflow-hidden shrink-0 border border-white/20">
                <Image src={currentTrack.cover} alt="Cover" fill className="object-cover" />
              </div>
              <div className="truncate text-center">
                <div className="text-xs font-bold text-white truncate">{currentTrack.title}</div>
                <div className="text-[10px] text-white/60 truncate">{currentTrack.artist}</div>
              </div>
            </div>

            {/* Scrubber Bar */}
            <div className="w-full flex items-center gap-2 mt-1">
              <span className="text-[9px] text-white/40 font-mono">{formatTime(currentTime)}</span>
              <input
                type="range"
                min="0"
                max={duration || 180}
                value={currentTime}
                onChange={(e) => handleSeek(Number(e.target.value))}
                className="w-full accent-rose-500 cursor-pointer h-1 bg-white/20 rounded-lg"
              />
              <span className="text-[9px] text-white/40 font-mono">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-2 text-white/70">
            <Volume2 className="w-3.5 h-3.5 shrink-0" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => handleVolumeChange(Number(e.target.value))}
              className="w-16 accent-white cursor-pointer h-1 bg-white/30 rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
