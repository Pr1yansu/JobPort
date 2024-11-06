"use client";
import React from "react";
import SearchBox from "@/components/search-box";
import { usePathname } from "next/navigation";
import { COMPANY_ROUTES, JOB_ROUTES, NO_SEARCH_ROUTES } from "@/routes";
import PageSearch from "../page-search";

const SearchVariantBox = () => {
  const pathname = usePathname();
  if (NO_SEARCH_ROUTES.some((regex) => regex.test(pathname))) {
    return null;
  }
  if (JOB_ROUTES.includes(pathname)) {
    return (
      <div className="flex-1">
        <SearchBox
          placeholder="🔍 Search job title or skill"
          queryStr="query"
        />
      </div>
    );
  }
  if (COMPANY_ROUTES.includes(pathname)) {
    return (
      <div className="flex-1">
        <SearchBox placeholder="🔍 Search for a company" queryStr="company" />
      </div>
    );
  }
  return (
    <div className="flex-1">
      <PageSearch />
    </div>
  );
};

export default SearchVariantBox;
