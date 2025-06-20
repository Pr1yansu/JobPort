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
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Job Swipe</h1>
        <p className="text-gray-600">
          Swipe right to save jobs you're interested in
        </p>
      </div>
      <JobMatchCards />
    </main>
  );
};

export default AiSuggestion;
