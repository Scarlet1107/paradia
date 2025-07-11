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
  renderNoResults?: () => React.ReactNode;
  renderEndMessage?: () => React.ReactNode;
  /** サーバーから渡された初期データ */
  initialData: SupabaseTableData<TableName>[];
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
  initialData, // ← 必須化
}: InfiniteListProps<TableName>) {
  // ① クライアントからのページネーション結果
  const {
    data: clientRows,
    isFetching,
    hasMore,
    fetchNextPage,
    isSuccess,
  } = useInfiniteQuery({
    tableName,
    columns,
    pageSize,
    trailingQuery,
  });

  // ② 表示するデータを state で管理
  const [displayRows, setDisplayRows] = React.useState(initialData);

  // ③ initialData が変わったら、まずはこれを優先して表示
  React.useEffect(() => {
    setDisplayRows(initialData);
  }, [initialData]);

  // ④ clientRows が入ってきたら、こちらを優先して表示
  React.useEffect(() => {
    if (clientRows.length > 0) {
      setDisplayRows(clientRows);
    }
  }, [clientRows]);

  // ⑤ IntersectionObserver はそのまま
  const sentinelRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetching) {
          fetchNextPage();
        }
      },
      { root: null, threshold: 0.1, rootMargin: "0px 0px 100px 0px" },
    );
    if (sentinelRef.current) obs.observe(sentinelRef.current);
    return () => obs.disconnect();
  }, [hasMore, isFetching, fetchNextPage]);

  return (
    <div className="flex w-full flex-col gap-4 p-4">
      {isSuccess && displayRows.length === 0 && renderNoResults()}

      <div className="w-full space-y-4">
        {displayRows.map((item, idx) => (
          <div key={idx} className="w-full">
            {renderItem(item, idx)}
          </div>
        ))}
      </div>

      {isFetching && (
        <div className="flex justify-center py-4">
          <Loader2 className="text-muted-foreground h-5 w-5 animate-spin" />
        </div>
      )}

      <div ref={sentinelRef} style={{ height: "1px" }} />

      {!hasMore && displayRows.length > 0 && renderEndMessage()}
    </div>
  );
}
