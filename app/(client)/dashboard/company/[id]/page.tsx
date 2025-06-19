import React from "react";
import CompanyDetail from "../_components/company-detail";

interface Params {
  params: {
    id: string;
  };
}

const CompanyDetails = ({ params }: Params) => {
  return (
    <div className="my-5">
      <CompanyDetail id={params.id} />
    </div>
  );
};

export default CompanyDetails;
