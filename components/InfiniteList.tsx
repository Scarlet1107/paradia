// components/InfiniteList.tsx
"use client";

import {
  SupabaseQueryHandler,
  SupabaseTableData,
  SupabaseTableName,
  useInfiniteQuery,
} from "@/hooks/use-infinite-query";
import * as React from "react";
import { Loader2 } from "lucide-react";

interface InfiniteListProps<TableName extends SupabaseTableName> {
  tableName: TableName;
  columns?: string;
  pageSize?: number;
  trailingQuery?: SupabaseQueryHandler<TableName>;
  renderItem: (
    item: SupabaseTableData<TableName>,
    index: number,
  ) => React.ReactNode;
  className?: string;
  renderNoResults?: () => React.ReactNode;
  renderEndMessage?: () => React.ReactNode;
  renderSkeleton?: (count: number) => React.ReactNode;
}

const DefaultNoResults = () => (
  <div className="text-muted-foreground py-10 text-center">No results.</div>
);

const DefaultEndMessage = () => (
  <div className="text-muted-foreground py-4 text-center text-sm">
    You&apos;ve reached the end.
  </div>
);

// const defaultSkeleton = (count: number) => (
//     <div className="flex flex-col gap-2 px-4">
//         {Array.from({ length: count }).map((_, index) => (
//             <div key={index} className="bg-muted h-4 w-full" />
//         ))}
//     </div>
// );

export function InfiniteList<TableName extends SupabaseTableName>({
  tableName,
  columns = "*",
  pageSize = 20,
  trailingQuery,
  renderItem,
  renderNoResults = DefaultNoResults,
  renderEndMessage = DefaultEndMessage,
  // renderSkeleton = defaultSkeleton,
}: InfiniteListProps<TableName>) {
  const { data, isFetching, hasMore, fetchNextPage, isSuccess } =
    useInfiniteQuery({
      tableName,
      columns,
      pageSize,
      trailingQuery,
    });

  // We no longer need a custom scroll container for IntersectionObserver:
  const sentinelRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetching) {
          fetchNextPage();
        }
      },
      {
        root: null, // ← use viewport
        threshold: 0.1,
        rootMargin: "0px 0px 100px 0px",
      },
    );
    if (sentinelRef.current) observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [isFetching, hasMore, fetchNextPage]);

  return (
    <div className="relative flex h-full w-full min-w-0 flex-1 flex-col gap-4 p-4">
      {isSuccess && data.length === 0 && renderNoResults()}

      {data.map((item, index) => renderItem(item, index))}

      {isFetching && (
        <div className="flex justify-center py-4">
          <Loader2 className="text-muted-foreground h-5 w-5 animate-spin" />
        </div>
      )}

      {/* Placed at the end of the list */}
      <div ref={sentinelRef} style={{ height: "1px" }} />

      {!hasMore && data.length > 0 && renderEndMessage()}
    </div>
  );
}
