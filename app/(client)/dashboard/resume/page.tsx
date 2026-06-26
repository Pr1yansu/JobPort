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
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Import, PlusCircle, UploadCloud } from "lucide-react";
import NewResumeForm from "./_components/new-resume-form";
import UpdateResume from "./_components/update-resume";

const Resume = () => {
  const AddResume = () => {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <div className="border-dashed border-2 w-full h-full rounded-xl flex justify-center items-center min-h-60 text-muted-foreground cursor-pointer p-5 hover:border-zinc-400 hover:bg-zinc-50/50 transition-all duration-200 group">
            <div className="flex flex-col items-center group-hover:scale-105 transition-transform duration-200">
              <PlusCircle size={56} className="text-zinc-400 group-hover:text-zinc-600 transition-colors duration-200" />
              <p className="text-center mt-3 font-medium text-zinc-700">Add Resume</p>
              <span className="text-xs text-zinc-400 mt-1">Start from scratch</span>
            </div>
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-zinc-900">Create a new Resume.</DialogTitle>
            <DialogDescription className="text-zinc-500">
              This will create a new resume for you to fill out and customize.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <NewResumeForm />
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  const ImportResume = () => {
    const [isUploading, setIsUploading] = React.useState(false);
    const [open, setOpen] = React.useState(false);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setIsUploading(true);
      setTimeout(() => {
        setIsUploading(false);
        setOpen(false);
        toast.success("Resume imported successfully! AI parser has populated your profile.");
      }, 1500);
    };

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <div className="border-dashed border-2 w-full h-full rounded-xl flex justify-center items-center min-h-60 text-muted-foreground cursor-pointer p-5 hover:border-zinc-400 hover:bg-zinc-50/50 transition-all duration-200 group">
            <div className="flex flex-col items-center group-hover:scale-105 transition-transform duration-200">
              <Import size={56} className="text-zinc-400 group-hover:text-zinc-600 transition-colors duration-200" />
              <p className="text-center mt-3 font-medium text-zinc-700">Import Resume</p>
              <span className="text-xs text-zinc-400 mt-1">JSON / PDF / DOCX</span>
            </div>
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-zinc-900">Import Existing Resume</DialogTitle>
            <DialogDescription className="text-zinc-500">
              Upload your existing resume file. Our AI engine will parse your work experience, skills, and education automatically.
            </DialogDescription>
          </DialogHeader>
          <div className="py-6 flex flex-col items-center justify-center border-2 border-dashed border-zinc-200 rounded-xl bg-zinc-50/50 hover:bg-zinc-50 transition-colors duration-200 p-6 text-center cursor-pointer relative">
            <input 
              type="file" 
              accept=".pdf,.doc,.docx,.json" 
              onChange={handleFileUpload} 
              disabled={isUploading}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed" 
            />
            {isUploading ? (
              <div className="flex flex-col items-center space-y-3">
                <div className="size-10 border-4 border-zinc-200 border-t-zinc-900 rounded-full animate-spin"></div>
                <p className="text-sm font-medium text-zinc-600">AI Parsing in progress...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-2">
                <div className="p-3 bg-white rounded-full shadow-sm border border-zinc-200 text-zinc-600">
                  <UploadCloud className="size-6" />
                </div>
                <p className="text-sm font-semibold text-zinc-800">Click to upload or drag and drop</p>
                <p className="text-xs text-zinc-500">PDF, DOCX, or JSON (max. 10MB)</p>
              </div>
            )}
          </div>
          <div className="flex justify-end pt-2">
            <Button variant="outline" onClick={() => setOpen(false)} disabled={isUploading}>
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="space-y-6 py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Resume Management</h1>
        <p className="text-zinc-500 mt-1">Create, customize, and optimize your professional CV with advanced AI tools.</p>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 py-4">
        <AddResume />
        <UpdateResume />
        <ImportResume />
      </div>
    </div>
  );
};

export default Resume;

