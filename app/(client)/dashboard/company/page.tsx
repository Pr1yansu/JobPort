import React from "react";
import CompanyList from "./_components/company-list";

const Companies = () => {
  return (
    <div className="p-5">
      <h4 className="text-2xl font-bold">Choose a company.</h4>
      <p className="text-muted-foreground">
        Here you can edit or delete a company. You can also add a new company.
      </p>
      <div>
        <CompanyList />
      </div>
    </div>
  );
};

export default Companies;
