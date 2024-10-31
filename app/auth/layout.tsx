import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication",
  description: "JobPort is a job finding platform",
};

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>;
};

export default AuthLayout;
