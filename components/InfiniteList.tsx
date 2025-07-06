"use client";

import {
  type SupabaseQueryHandler,
  type SupabaseTableData,
  type SupabaseTableName,
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
  <div className="text-muted-foreground py-10 text-center">
    該当する投稿がありません。
  </div>
);

const DefaultEndMessage = () => (
  <div className="text-muted-foreground py-4 text-center text-sm">
    オルディナ様降臨
  </div>
);

export function InfiniteList<TableName extends SupabaseTableName>({
  tableName,
  columns = "*",
  pageSize = 20,
  trailingQuery,
  renderItem,
  renderNoResults = DefaultNoResults,
  renderEndMessage = DefaultEndMessage,
}: InfiniteListProps<TableName>) {
  const { data, isFetching, hasMore, fetchNextPage, isSuccess } =
    useInfiniteQuery({
      tableName,
      columns,
      pageSize,
      trailingQuery,
    });

  const sentinelRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetching) {
          fetchNextPage();
        }
      },
      {
        root: null,
        threshold: 0.1,
        rootMargin: "0px 0px 100px 0px",
      },
    );
    if (sentinelRef.current) observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [isFetching, hasMore, fetchNextPage]);

  return (
    <div
      className="flex w-full flex-col gap-4 p-4"
      style={{ width: "100%", minWidth: "100%", maxWidth: "100%" }}
    >
      {isSuccess && data.length === 0 && renderNoResults()}

      <div className="w-full space-y-4" style={{ width: "100%" }}>
        {data.map((item, index) => (
          <div key={index} className="w-full" style={{ width: "100%" }}>
            {renderItem(item, index)}
          </div>
        ))}
      </div>

      {isFetching && (
        <div className="flex justify-center py-4">
          <Loader2 className="text-muted-foreground h-5 w-5 animate-spin" />
        </div>
      )}

      <div ref={sentinelRef} style={{ height: "1px" }} />

      {!hasMore && data.length > 0 && renderEndMessage()}
    </div>
  );
}
