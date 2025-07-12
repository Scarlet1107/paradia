// components/PostSkeleton.tsx
export default function PostSkeleton({ variant }: { variant?: "reply" }) {
  const isReply = variant === "reply";

  if (isReply) {
    return (
      <div className="mx-2 animate-pulse rounded-lg border border-orange-200/30 bg-gradient-to-r from-orange-50/50 to-pink-50/30 p-3 shadow-sm">
        <div className="mb-2 flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-gray-200"></div>
          <div className="h-4 w-24 rounded bg-gray-200"></div>
        </div>
        <div className="mb-2 h-4 rounded bg-gray-200"></div>
        <div className="h-4 w-3/4 rounded bg-gray-200"></div>
      </div>
    );
  }

  return (
    <div className="flex animate-pulse rounded-2xl border border-orange-500 bg-white p-4 shadow-sm">
      <div className="mr-4 h-40 w-40 flex-shrink-0 rounded-2xl bg-gray-200"></div>
      <div className="flex-1 space-y-4">
        <div className="h-4 w-1/2 rounded bg-gray-200"></div>
        <div className="h-4 rounded bg-gray-200"></div>
        <div className="h-4 w-3/4 rounded bg-gray-200"></div>
        <div className="flex gap-4">
          <div className="h-6 w-6 rounded-full bg-gray-200"></div>
          <div className="h-6 w-6 rounded-full bg-gray-200"></div>
        </div>
      </div>
    </div>
  );
}
