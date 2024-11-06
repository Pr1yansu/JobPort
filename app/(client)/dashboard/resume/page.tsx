"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Import, PlusCircle } from "lucide-react";
import NewResumeForm from "./_components/new-resume-form";
import UpdateResume from "./_components/update-resume";

const Resume = () => {
  const AddResume = () => {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <div className="border-dashed border-2 w-full h-full rounded-md flex justify-center items-center min-h-60 text-muted-foreground cursor-pointer p-5">
            <div className="flex flex-col items-center">
              <PlusCircle size={64} />
              <p className="text-center mt-2">Add Resume</p>
            </div>
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a new Resume.</DialogTitle>
            <DialogDescription>
              This will create a new resume for you to fill out and customize.
            </DialogDescription>
          </DialogHeader>
          <div>
            <NewResumeForm />
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  const ImportResume = () => {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <div className="border-dashed border-2 w-full h-full rounded-md flex justify-center items-center min-h-60 text-muted-foreground cursor-pointer p-5">
            <div className="flex flex-col items-center">
              <Import size={64} />
              <p className="text-center mt-2">Import Resume</p>
            </div>
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="py-5">
      <h4 className="text-xl font-semibold leading-none tracking-tight">
        Create a Resume
      </h4>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 py-5">
        <AddResume />
        <UpdateResume />
        <ImportResume />
      </div>
    </div>
  );
};

export default Resume;
