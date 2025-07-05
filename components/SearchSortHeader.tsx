"use client";

import { motion } from "framer-motion";
import ExpandableSearch from "./ExpandableSearch";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Clock,
  Sparkles,
  Heart,
  HeartOff,
} from "lucide-react";

type SortOrder = "desc" | "asc" | "most_liked" | "least_liked";

interface SearchSortHeaderProps {
  sortOrder: SortOrder;
  onSortChange: (order: SortOrder) => void;
  onSearch?: (query: string) => void;
  searchPlaceholder?: string;
  isRealTimeEnabled?: boolean;
  onRealTimeToggle?: () => void;
}

export default function SearchSortHeader({
  sortOrder,
  onSortChange,
  onSearch,
  searchPlaceholder = "投稿を検索...",
  isRealTimeEnabled = false,
  onRealTimeToggle,
}: SearchSortHeaderProps) {
  const getSortLabel = () => {
    switch (sortOrder) {
      case "desc":
        return "新着順";
      case "asc":
        return "古い順";
      case "most_liked":
        return "いいねが多い順";
      case "least_liked":
        return "いいねが少ない順";
      default:
        return "新着順";
    }
  };

  const getSortIcon = () => {
    switch (sortOrder) {
      case "desc":
        return <ArrowDown className="h-4 w-4" />;
      case "asc":
        return <ArrowUp className="h-4 w-4" />;
      case "most_liked":
        return <Heart className="h-4 w-4 text-red-500" />;
      case "least_liked":
        return <HeartOff className="h-4 w-4 text-gray-500" />;
      default:
        return <ArrowDown className="h-4 w-4" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-10 flex w-full items-center justify-between gap-3 bg-white px-4"
    >
      <div className="min-w-0 flex-1">
        <ExpandableSearch onSearch={onSearch} placeholder={searchPlaceholder} />
      </div>

      <div className="flex flex-shrink-0 items-center gap-2">
        {onRealTimeToggle && (
          <Button
            variant={isRealTimeEnabled ? "default" : "outline"}
            size="sm"
            onClick={onRealTimeToggle}
            className={`rounded-md px-2 py-1 text-xs transition-all duration-200 ${
              isRealTimeEnabled
                ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md"
                : "border-green-200 text-green-600 hover:bg-green-50"
            } `}
          >
            <div
              className={`mr-1 h-2 w-2 rounded-full ${isRealTimeEnabled ? "animate-pulse bg-white" : "bg-green-500"}`}
            />
            {isRealTimeEnabled ? "Live" : "Static"}
          </Button>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center gap-2 rounded-lg border border-orange-200/50 bg-gradient-to-r from-white/80 to-gray-50/80 px-3 py-2 text-sm text-gray-700 shadow-sm transition-all duration-200 hover:border-orange-300/70 hover:from-orange-50 hover:to-amber-50 hover:text-amber-700 hover:shadow-md sm:px-4 sm:text-base"
            >
              <ArrowUpDown className="h-4 w-4 text-amber-600" />
              <span className="hidden font-medium sm:inline">
                {getSortLabel()}
              </span>
              <span className="font-medium sm:hidden">Sort</span>
              {getSortIcon()}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="min-w-[180px] rounded-xl border border-orange-200/50 bg-gradient-to-br from-white/95 to-orange-50/95 p-1 shadow-xl backdrop-blur-lg"
            align="end"
          >
            <DropdownMenuItem
              onClick={() => onSortChange("desc")}
              className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                sortOrder === "desc"
                  ? "bg-gradient-to-r from-orange-100 to-amber-100 text-amber-800 shadow-sm"
                  : "text-gray-700 hover:bg-gradient-to-r hover:from-orange-50 hover:to-amber-50 hover:text-amber-700"
              } `}
            >
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-600" />
                <span>新着順</span>
              </div>
              {sortOrder === "desc" && (
                <ArrowDown className="ml-auto h-4 w-4 text-amber-600" />
              )}
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => onSortChange("asc")}
              className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                sortOrder === "asc"
                  ? "bg-gradient-to-r from-orange-100 to-amber-100 text-amber-800 shadow-sm"
                  : "text-gray-700 hover:bg-gradient-to-r hover:from-orange-50 hover:to-amber-50 hover:text-amber-700"
              } `}
            >
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-600" />
                <span>古い順</span>
              </div>
              {sortOrder === "asc" && (
                <ArrowUp className="ml-auto h-4 w-4 text-amber-600" />
              )}
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => onSortChange("most_liked")}
              className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                sortOrder === "most_liked"
                  ? "bg-gradient-to-r from-orange-100 to-amber-100 text-amber-800 shadow-sm"
                  : "text-gray-700 hover:bg-gradient-to-r hover:from-orange-50 hover:to-amber-50 hover:text-amber-700"
              } `}
            >
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-red-500" />
                <span>いいねが多い順</span>
              </div>
              {sortOrder === "most_liked" && (
                <Heart className="ml-auto h-4 w-4 text-red-500" />
              )}
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => onSortChange("least_liked")}
              className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                sortOrder === "least_liked"
                  ? "bg-gradient-to-r from-orange-100 to-amber-100 text-amber-800 shadow-sm"
                  : "text-gray-700 hover:bg-gradient-to-r hover:from-orange-50 hover:to-amber-50 hover:text-amber-700"
              } `}
            >
              <div className="flex items-center gap-2">
                <HeartOff className="h-4 w-4 text-gray-500" />
                <span>いいねが少ない順</span>
              </div>
              {sortOrder === "least_liked" && (
                <HeartOff className="ml-auto h-4 w-4 text-gray-500" />
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.div>
  );
}
