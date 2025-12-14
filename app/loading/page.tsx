"use client";

export default function Home() {
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-black relative">

      {/* XP Loading Bar (Position Adjust As Needed) */}
      <div 
        className="absolute left-1/2 -translate-x-1/2 z-10"
        style={{ top: "13cm" }}
      >
        <div className="xp-bar">
          <div className="xp-slide">
            <div className="xp-block"></div>
            <div className="xp-block"></div>
            <div className="xp-block"></div>
          </div>
        </div>
      </div>

      {/* Your centered image */}
      <img
        src="/MacinHarsh.png"
        alt="Centered Image"
        className="max-w-full max-h-full scale-[1.1]"
      />

      <style jsx>{`
        /* ------------------------------
           OUTER XP BAR (Your screenshot dimensions)
        ------------------------------ */
        .xp-bar {
          width: 230px;                 /* slightly shorter than real XP */
          height: 20px;                 /* TALLER (matches your screenshot) */
          background: #000;
          border: 1.5px solid #4d4d4d;  /* thinner & darker border */
          border-radius: 6px;           /* LESS rounded (important!) */
          overflow: hidden;
          position: relative;
          box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.9);
        }

        /* ------------------------------
           SLIDING CONTAINER
        ------------------------------ */
        .xp-slide {
          position: absolute;
          top: 5px;                     /* centers blocks vertically */
          left: -45px;                  /* correct starting position */
          display: flex;
          gap: 3px;                     /* spacing from screenshot */
          animation: xpSlide 1.9s linear infinite;
        }

        /* ------------------------------
           BLUE BLOCK (Your screenshot proportions)
        ------------------------------ */
        .xp-block {
          width: 20px;                  /* thinner */
          height: 10px;                 /* shorter blocks */
          background: linear-gradient(
            to bottom,
            #6cb8ff 0%,
            #3a82d3 50%,
            #1c4c80 100%
          );
          border-radius: 1px;           /* tiny rounding */
          box-shadow: 
            0 0 3px rgba(108,184,255,0.55),
            inset 0 0 2px rgba(255,255,255,0.35);
        }

        /* ------------------------------
           Updated SLIDE Animation Path
        ------------------------------ */
        @keyframes xpSlide {
          0%   { left: -45px; }
          100% { left: 230px; }
        }
      `}</style>
    </div>
  );
}
