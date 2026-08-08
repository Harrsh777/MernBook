"use client";

import React from "react";
import { Trash2, RotateCcw, Folder, FileText } from "lucide-react";
import { DesktopItem } from "@/lib/windowStore";

interface TrashWindowProps {
  trashedItems: DesktopItem[];
  onRestoreItem: (id: string) => void;
  onEmptyTrash: () => void;
}

export default function TrashWindow({
  trashedItems,
  onRestoreItem,
  onEmptyTrash,
}: TrashWindowProps) {
  return (
    <div className="h-full w-full bg-transparent p-6 text-white flex flex-col justify-between select-none backdrop-blur-2xl">
      {/* Header */}
      <div className="pb-4 border-b border-white/10 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-rose-400" />
            <span>Trash Bin</span>
          </h2>
          <p className="text-xs text-white/60 mt-1">
            Items in Trash can be put back or recovered anytime
          </p>
        </div>

        {trashedItems.length > 0 && (
          <button
            onClick={onEmptyTrash}
            className="text-xs px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 transition-colors font-medium"
          >
            Empty Trash
          </button>
        )}
      </div>

      {/* Trashed Items List */}
      <div className="flex-1 my-4 overflow-y-auto">
        {trashedItems.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-white/40 text-xs gap-2">
            <Trash2 className="w-12 h-12 stroke-1 opacity-50" />
            <span>Trash is Empty</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {trashedItems.map((item) => (
              <div
                key={item.id}
                className="bg-[#252528] rounded-xl p-4 border border-white/10 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  {item.iconType === "folder" ? (
                    <Folder className="w-8 h-8 text-blue-400" />
                  ) : (
                    <FileText className="w-8 h-8 text-cyan-400" />
                  )}
                  <div>
                    <div className="text-sm font-semibold text-white">{item.label}</div>
                    <div className="text-[11px] text-white/50">In Trash</div>
                  </div>
                </div>

                <button
                  onClick={() => onRestoreItem(item.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Put Back</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-white/10 text-center text-xs text-white/40">
        Refreshing the page resets the desktop to default state
      </div>
    </div>
  );
}
