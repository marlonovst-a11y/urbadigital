'use client';

export default function Header() {
  return (
    <header className="fixed top-0 w-full z-50 bg-[#1E2D6B]">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <span className="font-bold text-[#1E2D6B] text-sm">Z</span>
          </div>
          <span className="text-white font-bold text-lg">ZURICH</span>
        </div>

        <div className="flex-1 h-px bg-white mx-8 opacity-30" />

        <div className="text-white text-xs font-medium">
          Plan International
        </div>
      </div>
    </header>
  );
}
