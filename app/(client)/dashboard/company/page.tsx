import React from "react";
import CompanyList from "./_components/company-list";

const Companies = () => {
  return (
    <div className="space-y-8 py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">Manage Companies</h1>
        <p className="text-zinc-500 mt-1 text-base">
          Add, edit, or remove companies associated with your job postings.
        </p>
      </div>
      <div>
        <CompanyList />
      </div>
    </div>
  );
};

export default Companies;
