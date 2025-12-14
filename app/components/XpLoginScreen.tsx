"use client";

import React, { useState } from "react";
import Image from "next/image";

type XpLoginScreenProps = {
  onLogin: () => void;
  onRestart: () => void;
  onShutdown: () => void;
};

const XpLoginScreen: React.FC<XpLoginScreenProps> = ({
  onLogin,
  onRestart,
  onShutdown,
}) => {
  const [showOverlay, setShowOverlay] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isFading, setIsFading] = useState(false);

  const triggerRestart = () => {
    setIsFading(true);
    setTimeout(() => {
      onRestart();
      setShowModal(false);
      setShowOverlay(false);
      setIsFading(false);
    }, 650);
  };

  const triggerShutdown = () => {
    setIsFading(true);
    setTimeout(() => onShutdown(), 650);
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-[#1e4ba5] text-white font-[Tahoma] overflow-hidden flex flex-col">

      {/* ---------------- HEADER BAR ---------------- */}
      <div className="relative h-16 md:h-20 px-10 flex items-center justify-between shadow-[0_1px_0_rgba(0,0,0,0.7)]">
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#1d53c7,#0c3489)]" />

        {/* Left Logo + XP Title */}
        <div className="relative flex items-center gap-3">
          <Image src="/xp-logo.png" alt="logo" width={30} height={30} />
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold tracking-tight">Harsh</span>
            <span className="text-[11px] text-[#ff4d32] translate-y-[-0.35rem]">xp</span>
          </div>
        </div>

        <div className="relative text-[11px] opacity-80">Welcome</div>
      </div>

      {/* ---------------- MAIN PANEL ---------------- */}
      <div className="relative flex-1">

        {/* Background */}
        <div className="absolute inset-0 bg-[#245edc]" />

        {/* XP grid texture */}
        <div className="absolute inset-0 opacity-35 bg-[linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,0.18)_1px,transparent_1px)] bg-[size:4px_4px]" />

        {/* Light border line below header */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-[rgba(255,255,255,0.6)] shadow-[0_1px_0_rgba(0,0,0,0.7)]" />

        <div className="relative h-full px-14 md:px-32 flex items-center justify-between">

          {/* ------------ LEFT SIDE (Logo + Text) ------------ */}
          <div className="flex flex-col gap-4 max-w-sm">

            <Image
              src="/xp-logo.png"
              alt="xp-large"
              width={170}
              height={170}
              className="drop-shadow-[0_0_6px_rgba(255,255,255,0.65)]"
            />

            <div className="flex items-baseline gap-2">
              <span className="text-[2.2rem] font-bold tracking-[0.03em]">MitchIvin</span>
              <span className="text-sm text-[#ff3e3e] translate-y-[-0.75rem] font-bold">xp</span>
            </div>

            <div className="text-[12px] italic text-blue-100">Visual Designer</div>

            <div className="mt-6 text-[12px] text-blue-50">
              To begin, click on Mitch Ivin to log in
            </div>
          </div>

          {/* ------------ RIGHT SIDE (Profile Box) ------------ */}
          <button
            onClick={onLogin}
            className="group flex items-center gap-5 px-7 py-5 rounded-lg 
            bg-[rgba(0,0,0,0.32)] border border-white/40
            shadow-[0_0_0_2px_rgba(0,0,0,0.8),0_0_16px_rgba(0,0,0,0.6)]
            hover:bg-[rgba(0,0,0,0.45)] transition-all"
          >
            <Image
              src="/harsh-avatar.png"
              alt="avatar"
              width={60}
              height={60}
              className="rounded-md border border-white shadow-[0_0_6px_rgba(0,0,0,0.8)]"
            />

            <div>
              <div className="text-lg font-bold drop-shadow-[0_0_3px_black]">
                Mitch Ivin
              </div>
              <div className="text-[12px] text-blue-100">Visual Designer</div>
            </div>
          </button>
        </div>

        {/* ---------------- BOTTOM BAR ---------------- */}
        <div className="absolute bottom-0 left-0 right-0 h-14 md:h-16 bg-[linear-gradient(to_bottom,#0b3c86,#082665)] shadow-[0_-1px_0_rgba(0,0,0,0.8)] flex items-center justify-between px-8">

          {/* Orange XP separator line */}
          <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-[#f9a01b] via-[#fce08b] to-[#f9a01b]" />

          {/* Restart Button */}
          <button
            onClick={() => {
              setShowOverlay(true);
              setTimeout(() => setShowModal(true), 160);
            }}
            className="flex items-center gap-2 text-[12px] px-3 py-1.5 rounded-sm 
            bg-[linear-gradient(to_bottom,#42c84b,#1d7a28)]
            border border-[#0a3e14]
            shadow-[0_0_0_1px_rgba(0,0,0,0.8),0_0_6px_rgba(0,0,0,0.6)]"
          >
            <Image src="/xp-restart.png" alt="restart" width={16} height={16} />
            Restart MitchIvin XP
          </button>

          {/* Right text */}
          <div className="text-[11px] text-blue-100 text-right leading-tight">
            <div>After you log on, the system’s yours to explore.</div>
            <div>Every detail has been designed with a purpose.</div>
          </div>
        </div>

        {/* ---------------- OVERLAY + SHUTDOWN MODAL ---------------- */}
        {showOverlay && (
          <div
            className={`absolute inset-0 flex items-center justify-center transition-colors duration-700 
              ${isFading ? "bg-black" : "bg-[rgba(0,0,0,0.55)]"}`}
          >
            {showModal && !isFading && (
              <div className="w-[320px] rounded-lg overflow-hidden shadow-[0_0_0_1px_black,0_20px_40px_rgba(0,0,0,0.85)]">

                {/* Modal blue bar */}
                <div className="relative h-8 flex items-center gap-2 px-3 text-xs font-bold">
                  <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#1d63d5,#0c3c87)]" />
                  <Image src="/xp-logo.png" alt="logo" width={16} height={16} />
                  <span className="relative">Turn off MitchIvin XP</span>
                </div>

                {/* Modal body */}
                <div className="relative bg-[#e3f0ff] p-4 pb-5 text-xs">
                  <div className="relative flex justify-around pb-3 pt-3">

                    {/* Restart */}
                    <button onClick={triggerRestart} className="flex flex-col items-center gap-1">
                      <div className="w-10 h-10 flex items-center justify-center rounded-full 
                      bg-[linear-gradient(to_bottom,#5ade6a,#1b7a24)]
                      border border-[#094d17] text-white text-lg font-bold">
                        ↻
                      </div>
                      Restart
                    </button>

                    {/* Shutdown */}
                    <button onClick={triggerShutdown} className="flex flex-col items-center gap-1">
                      <div className="w-10 h-10 flex items-center justify-center rounded-full 
                      bg-[linear-gradient(to_bottom,#ff4b4b,#8c0d0d)]
                      border border-[#5e0a0a] text-white text-lg font-bold">
                        ⏻
                      </div>
                      Shut Down
                    </button>
                  </div>

                  {/* Cancel button */}
                  <div className="flex justify-end mt-1">
                    <button
                      onClick={() => {
                        setShowModal(false);
                        setShowOverlay(false);
                      }}
                      className="px-3 py-1 rounded-sm text-[11px] 
                      border border-[#707070] 
                      bg-[linear-gradient(to_bottom,#ffffff,#dcdcdc)]"
                    >
                      Cancel
                    </button>
                  </div>
                </div>

              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default XpLoginScreen;
