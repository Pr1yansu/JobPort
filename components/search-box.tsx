"use client";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";

const SearchBox = ({
  queryStr = "query",
  placeholder = "Search",
}: {
  queryStr?: string;
  placeholder?: string;
}) => {
  const searchParams = useSearchParams();
  const [input, setInput] = useState("");
  const pathname = usePathname();
  const { replace } = useRouter();

  useEffect(() => {
    const debouncedSearch = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      if (input) {
        params.set(queryStr, input);
      } else {
        params.delete(queryStr);
      }
      replace(`${pathname}?${params.toString()}`);
    }, 300);

    return () => clearTimeout(debouncedSearch);
  }, [input]);

  return (
    <Input
      placeholder={placeholder}
      value={input}
      onChange={(e) => setInput(e.target.value)}
    />
  );
};

export default SearchBox;
