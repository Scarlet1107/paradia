"use client";

import type React from "react";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ExpandableSearchProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
}

export default function ExpandableSearch({
  onSearch,
  placeholder = "投稿を検索...",
}: ExpandableSearchProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleToggle = () => {
    if (isExpanded && searchQuery) {
      setSearchQuery("");
      onSearch?.("");
    } else {
      setIsExpanded(!isExpanded);
    }
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onSearch?.(value);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSearch?.(searchQuery);
    }
    if (e.key === "Escape") {
      setIsExpanded(false);
      setSearchQuery("");
      onSearch?.("");
    }
  };

  return (
    <div className="flex items-center">
      <AnimatePresence mode="wait">
        {!isExpanded ? (
          <motion.div
            key="collapsed"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              variant="outline"
              size="sm"
              onClick={handleToggle}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-orange-300/50 bg-gradient-to-r from-white/80 to-gray-50/80 p-0 text-gray-700 shadow-sm transition-all duration-200 hover:border-orange-400/70 hover:from-amber-50 hover:to-orange-50 hover:text-amber-700 hover:shadow-md"
            >
              <Search className="h-4 w-4 text-amber-600" />
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, width: 40 }}
            animate={{ opacity: 1, width: "100%" }}
            exit={{ opacity: 0, width: 40 }}
            transition={{
              duration: 0.3,
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
            className="flex w-full items-center"
          >
            <div className="relative flex w-full items-center">
              <Search className="absolute left-3 z-10 h-4 w-4 text-orange-500" />
              <Input
                autoFocus
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={placeholder}
                className="w-full rounded-lg border border-orange-200/70 bg-gradient-to-r from-white/90 to-orange-50/90 py-2 pr-10 pl-10 text-sm text-gray-700 shadow-sm transition-all duration-200 placeholder:text-gray-500 focus:border-orange-400 focus:shadow-md"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggle}
                className="absolute right-1 h-8 w-8 rounded-md p-0 transition-all duration-200 hover:bg-orange-100 hover:text-orange-500"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
