// app/protected/layout.tsx
import Header from "@/components/header/Header";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex max-w-5xl flex-1 flex-col gap-20 p-5">
        {children}
      </main>
    </>
  );
}
