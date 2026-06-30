import React from "react";
import JobMatchCards from "./_components/job-match-card";
import { auth } from "@/auth";
import Link from "next/link";

const AiSuggestion = async () => {
  const session = await auth();
  const user = session?.user;
  if (!user?.premium) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Premium Feature</h1>
        <p className="text-gray-600 mb-6">
          Upgrade to premium to access AI job suggestions.
        </p>
        <Link
          href="/"
          className="px-4 py-2 bg-zinc-600 text-white rounded hover:bg-zinc-700 transition-all duration-300"
        >
          Upgrade Now
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-zinc-50/30 rounded-2xl border border-zinc-200/60 p-6">
      <div className="mb-8 text-center space-y-2">
        <h1 className="text-3xl font-black text-zinc-900 tracking-tighter">AI Job Match</h1>
        <p className="text-zinc-500 font-medium">
          Swipe right to save jobs, left to pass. Our AI learns your preferences.
        </p>
      </div>
      <JobMatchCards />
    </div>
  );
};

export default AiSuggestion;
