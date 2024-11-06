"use client";
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";

const PageSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const searchAndHighlight = () => {
      const term = searchTerm.toLowerCase();

      document.querySelectorAll(".highlight").forEach((el) => {
        el.classList.remove("highlight");
      });

      if (!term) return;

      const elements = Array.from(
        document.body.querySelectorAll<HTMLElement>("*")
      ).filter((el) => {
        return (
          el.children.length === 0 &&
          el.textContent?.toLowerCase().includes(term)
        );
      });

      elements.forEach((el) => el.classList.add("highlight"));
    };

    searchAndHighlight();
  }, [searchTerm]);

  return (
    <div className="flex items-center gap-2 flex-1">
      <Input
        placeholder="🔍 Search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <style>{`
        .highlight {
          background-color: #fcd34d; /* Highlight color */
          color: #000;
        }
      `}</style>
    </div>
  );
};

export default PageSearch;
