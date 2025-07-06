// components/DynamicBackground.tsx
"use client";

export default function DynamicBackground() {
  return (
    <div className="fixed inset-0 -z-10 bg-[url('/background.png')] bg-cover bg-center bg-no-repeat" />
  );
}
