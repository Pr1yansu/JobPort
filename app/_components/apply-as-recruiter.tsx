"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { useRecruiterModal } from "@/hooks/use-recruiter-modal";

const ApplyAsRecruiter = () => {
  const { open } = useRecruiterModal();
  return <Button onClick={open}>Apply as a Recruiter</Button>;
};

export default ApplyAsRecruiter;
