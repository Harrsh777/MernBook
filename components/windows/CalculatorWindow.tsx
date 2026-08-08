"use client";

import React, { useState } from "react";

export default function CalculatorWindow() {
  const [display, setDisplay] = useState("0");
  const [prevVal, setPrevVal] = useState<number | null>(null);
  const [op, setOp] = useState<string | null>(null);
  const [resetNext, setResetNext] = useState(false);

  const handleNum = (n: string) => {
    if (display === "0" || resetNext) {
      setDisplay(n);
      setResetNext(false);
    } else {
      if (display.length < 10) {
        setDisplay(display + n);
      }
    }
  };

  const handleOp = (nextOp: string) => {
    setPrevVal(parseFloat(display));
    setOp(nextOp);
    setResetNext(true);
  };

  const handleEqual = () => {
    if (prevVal === null || op === null) return;
    const current = parseFloat(display);
    let res = 0;
    if (op === "+") res = prevVal + current;
    if (op === "-") res = prevVal - current;
    if (op === "×") res = prevVal * current;
    if (op === "÷") res = current !== 0 ? prevVal / current : 0;

    const resStr = Number.isInteger(res) ? String(res) : String(parseFloat(res.toFixed(6)));
    setDisplay(resStr);
    setPrevVal(null);
    setOp(null);
    setResetNext(true);
  };

  const handleClear = () => {
    setDisplay("0");
    setPrevVal(null);
    setOp(null);
    setResetNext(false);
  };

  const handleToggleSign = () => {
    setDisplay(String(parseFloat(display) * -1));
  };

  const handlePercent = () => {
    setDisplay(String(parseFloat(display) / 100));
  };

  return (
    <div className="h-full w-full bg-black text-white p-4 font-sans flex flex-col justify-between overflow-hidden select-none">
      {/* Display Screen */}
      <div className="flex-1 flex flex-col justify-end text-right px-2 pb-3">
        <div className="text-5xl md:text-6xl font-extralight tracking-tight text-white truncate">
          {display}
        </div>
      </div>

      {/* Button Keypad Grid (Full Height, No Scroll) */}
      <div className="flex flex-col gap-2.5">
        {/* Row 1: AC, +/-, %, ÷ */}
        <div className="grid grid-cols-4 gap-2.5">
          <button
            onClick={handleClear}
            className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#a5a5a5] hover:bg-[#d4d4d2] text-black text-xl font-normal flex items-center justify-center transition-colors active:opacity-70"
          >
            {display !== "0" || prevVal !== null ? "C" : "AC"}
          </button>
          <button
            onClick={handleToggleSign}
            className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#a5a5a5] hover:bg-[#d4d4d2] text-black text-xl font-normal flex items-center justify-center transition-colors active:opacity-70"
          >
            <sup>+</sup>/<sub>-</sub>
          </button>
          <button
            onClick={handlePercent}
            className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#a5a5a5] hover:bg-[#d4d4d2] text-black text-xl font-normal flex items-center justify-center transition-colors active:opacity-70"
          >
            %
          </button>
          <button
            onClick={() => handleOp("÷")}
            className={`w-13 h-13 sm:w-14 sm:h-14 rounded-full text-3xl font-medium flex items-center justify-center transition-colors active:opacity-70 ${
              op === "÷" ? "bg-white text-[#ff9f0a]" : "bg-[#ff9f0a] hover:bg-[#ffb340] text-white"
            }`}
          >
            ÷
          </button>
        </div>

        {/* Row 2: 7, 8, 9, × */}
        <div className="grid grid-cols-4 gap-2.5">
          <button
            onClick={() => handleNum("7")}
            className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#333333] hover:bg-[#4a4a4a] text-white text-2xl font-light flex items-center justify-center transition-colors active:opacity-70"
          >
            7
          </button>
          <button
            onClick={() => handleNum("8")}
            className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#333333] hover:bg-[#4a4a4a] text-white text-2xl font-light flex items-center justify-center transition-colors active:opacity-70"
          >
            8
          </button>
          <button
            onClick={() => handleNum("9")}
            className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#333333] hover:bg-[#4a4a4a] text-white text-2xl font-light flex items-center justify-center transition-colors active:opacity-70"
          >
            9
          </button>
          <button
            onClick={() => handleOp("×")}
            className={`w-13 h-13 sm:w-14 sm:h-14 rounded-full text-2xl font-medium flex items-center justify-center transition-colors active:opacity-70 ${
              op === "×" ? "bg-white text-[#ff9f0a]" : "bg-[#ff9f0a] hover:bg-[#ffb340] text-white"
            }`}
          >
            ×
          </button>
        </div>

        {/* Row 3: 4, 5, 6, - */}
        <div className="grid grid-cols-4 gap-2.5">
          <button
            onClick={() => handleNum("4")}
            className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#333333] hover:bg-[#4a4a4a] text-white text-2xl font-light flex items-center justify-center transition-colors active:opacity-70"
          >
            4
          </button>
          <button
            onClick={() => handleNum("5")}
            className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#333333] hover:bg-[#4a4a4a] text-white text-2xl font-light flex items-center justify-center transition-colors active:opacity-70"
          >
            5
          </button>
          <button
            onClick={() => handleNum("6")}
            className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#333333] hover:bg-[#4a4a4a] text-white text-2xl font-light flex items-center justify-center transition-colors active:opacity-70"
          >
            6
          </button>
          <button
            onClick={() => handleOp("-")}
            className={`w-13 h-13 sm:w-14 sm:h-14 rounded-full text-3xl font-medium flex items-center justify-center transition-colors active:opacity-70 ${
              op === "-" ? "bg-white text-[#ff9f0a]" : "bg-[#ff9f0a] hover:bg-[#ffb340] text-white"
            }`}
          >
            −
          </button>
        </div>

        {/* Row 4: 1, 2, 3, + */}
        <div className="grid grid-cols-4 gap-2.5">
          <button
            onClick={() => handleNum("1")}
            className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#333333] hover:bg-[#4a4a4a] text-white text-2xl font-light flex items-center justify-center transition-colors active:opacity-70"
          >
            1
          </button>
          <button
            onClick={() => handleNum("2")}
            className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#333333] hover:bg-[#4a4a4a] text-white text-2xl font-light flex items-center justify-center transition-colors active:opacity-70"
          >
            2
          </button>
          <button
            onClick={() => handleNum("3")}
            className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#333333] hover:bg-[#4a4a4a] text-white text-2xl font-light flex items-center justify-center transition-colors active:opacity-70"
          >
            3
          </button>
          <button
            onClick={() => handleOp("+")}
            className={`w-13 h-13 sm:w-14 sm:h-14 rounded-full text-3xl font-medium flex items-center justify-center transition-colors active:opacity-70 ${
              op === "+" ? "bg-white text-[#ff9f0a]" : "bg-[#ff9f0a] hover:bg-[#ffb340] text-white"
            }`}
          >
            +
          </button>
        </div>

        {/* Row 5: 0 (wide), ., = */}
        <div className="grid grid-cols-4 gap-2.5">
          <button
            onClick={() => handleNum("0")}
            className="col-span-2 h-13 sm:h-14 rounded-full bg-[#333333] hover:bg-[#4a4a4a] text-white text-2xl font-light flex items-center justify-start pl-6 transition-colors active:opacity-70"
          >
            0
          </button>
          <button
            onClick={() => handleNum(".")}
            className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#333333] hover:bg-[#4a4a4a] text-white text-2xl font-light flex items-center justify-center transition-colors active:opacity-70"
          >
            .
          </button>
          <button
            onClick={handleEqual}
            className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#ff9f0a] hover:bg-[#ffb340] text-white text-3xl font-medium flex items-center justify-center transition-colors active:opacity-70"
          >
            =
          </button>
        </div>
      </div>
    </div>
  );
}
