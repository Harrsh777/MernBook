import Link from "next/link";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#070A12] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-purple-500/15 blur-[90px]" />
        <div className="absolute top-1/3 -right-24 h-80 w-80 rounded-full bg-blue-500/10 blur-[110px]" />
        <div className="absolute -bottom-24 left-1/3 h-80 w-80 rounded-full bg-fuchsia-500/10 blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.12)_0%,rgba(7,10,18,0)_55%)]" />
      </div>

      <div className="relative">
        <header className="sticky top-0 z-20 border-b border-white/10 bg-black/20 backdrop-blur-xl">
          <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
            <Link href="/dashboard" className="font-semibold tracking-tight">
              Client Dashboard
            </Link>
            <div className="text-xs text-white/50">
              Minimal • Secure • Realtime-ready
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
      </div>
    </div>
  );
}

