'use client';

export default function DecorativeShapes() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-[#1E2D6B] opacity-20" />
      <div className="absolute top-40 right-20 w-24 h-24 rounded-full bg-[#A8C8E8] opacity-30" />
      <div className="absolute bottom-32 left-1/4 w-40 h-20 rounded-full bg-[#1E2D6B] opacity-15" />
      <div className="absolute bottom-20 right-1/3 w-28 h-28 rounded-r-full bg-[#A8C8E8] opacity-25" />
      <div className="absolute top-1/3 right-1/4 w-16 h-16 rounded-full bg-[#2167AE] opacity-10" />
    </div>
  );
}
