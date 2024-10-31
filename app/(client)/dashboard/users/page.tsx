import React from "react";
import UserTable from "./user-table";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Users",
};

const Users = () => {
  return (
    <div className="container mx-auto py-10">
      <UserTable />
    </div>
  );
};

export default Users;
