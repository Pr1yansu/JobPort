"use client";

import React, { useEffect } from "react";
import { useState, useRef } from "react";
import {
  Heart,
  X,
  RotateCcw,
  Bookmark,
  MapPin,
  Calendar,
  DollarSign,
  Building2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useGetJob } from "@/features/jobs/api/use-job";

export default function JobMatchCards() {
  const { data, isPending } = useGetJob();
  const [currentJobs, setCurrentJobs] = useState<any[]>([]);
  const [savedJobs, setSavedJobs] = useState<any[]>([]);
  const [showSaved, setShowSaved] = useState(false);
  const [lastSaved, setLastSaved] = useState<any>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Initialize current jobs when data is loaded
  React.useEffect(() => {
    if (data?.jobs && currentJobs.length === 0) {
      const savedJobIds = new Set(savedJobs.map((job) => job.id));
      const filteredJobs = data.jobs.filter(
        (job: any) => !savedJobIds.has(job.id)
      );
      setCurrentJobs(filteredJobs);
      cardRefs.current = Array(filteredJobs.length).fill(null);
    }
  }, [data?.jobs, currentJobs.length]);

  if (isPending || !data || !data.jobs) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center space-y-6 p-8">
          {/* AI Brain Animation */}
          <div className="relative">
            <div className="w-24 h-24 mx-auto mb-4 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse"></div>
              <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                <div className="text-3xl animate-bounce">🧠</div>
              </div>
            </div>
            {/* Floating dots */}
            <div className="absolute -top-2 -right-2 w-3 h-3 bg-blue-400 rounded-full animate-ping"></div>
            <div className="absolute -bottom-2 -left-2 w-2 h-2 bg-purple-400 rounded-full animate-ping animation-delay-300"></div>
            <div className="absolute top-1/2 -right-4 w-2 h-2 bg-green-400 rounded-full animate-ping animation-delay-700"></div>
          </div>

          {/* Loading Text */}
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-gray-800">
              AI is finding perfect matches
            </h2>
            <div className="flex items-center justify-center space-x-1">
              <span className="text-gray-600">Analyzing your preferences</span>
              <div className="flex space-x-1">
                <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce animation-delay-200"></div>
                <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce animation-delay-400"></div>
              </div>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="space-y-2 text-sm text-gray-500">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Scanning job database</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Matching skills and preferences</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span>Ranking best opportunities</span>
            </div>
          </div>

          {/* Loading Bar */}
          <div className="w-64 mx-auto">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const formatSalary = (salary: number, currency: string) => {
    return `₹${salary.toLocaleString("en-IN")} ${currency}/month`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>/g, "");
  };

  const handleSwipe = (direction: "left" | "right", cardIndex = 0) => {
    if (isAnimating) return;

    const card = cardRefs.current[cardIndex];
    if (!card || currentJobs.length === 0) return;

    setIsAnimating(true);
    const job = currentJobs[cardIndex];

    // Animate card out
    card.style.transition = "transform 0.3s ease-out, opacity 0.3s ease-out";
    card.style.transform =
      direction === "right"
        ? "translateX(100%) rotate(30deg)"
        : "translateX(-100%) rotate(-30deg)";
    card.style.opacity = "0";

    // Update state immediately
    setCurrentJobs((prev) => {
      const newJobs = [...prev];
      newJobs.splice(cardIndex, 1);
      return newJobs;
    });

    if (direction === "right") {
      setSavedJobs((prev) => [...prev, job]);
      setLastSaved(job);
      setShowSaved(true);
      setTimeout(() => setShowSaved(false), 2000);
    }

    // Clean up after animation
    setTimeout(() => {
      cardRefs.current = cardRefs.current.filter((_, i) => i !== cardIndex);
      setIsAnimating(false);
    }, 300);
  };

  const handleUndo = () => {
    if (savedJobs.length === 0 || isAnimating) return;

    const lastSavedJob = savedJobs[savedJobs.length - 1];
    setSavedJobs((prev) => prev.slice(0, -1));
    setCurrentJobs((prev) => [lastSavedJob, ...prev]);
    setLastSaved(null);

    // Reset refs
    setTimeout(() => {
      cardRefs.current = [null, ...cardRefs.current];
    }, 0);
  };

  const handleReset = () => {
    if (data?.jobs) {
      setCurrentJobs([...data.jobs]);
      setSavedJobs([]);
      setLastSaved(null);
      cardRefs.current = [];
    }
  };

  const handleCardInteraction = (
    e: React.MouseEvent | React.TouchEvent,
    cardIndex: number
  ) => {
    if (isAnimating || cardIndex !== 0) return;

    const card = cardRefs.current[cardIndex];
    if (!card) return;

    let startX = 0;
    let currentX = 0;
    let isDragging = false;

    const getClientX = (event: MouseEvent | TouchEvent) => {
      return "touches" in event ? event.touches[0].clientX : event.clientX;
    };

    const handleStart = (event: MouseEvent | TouchEvent) => {
      isDragging = true;
      startX = getClientX(event);
      card.style.transition = "none";
    };

    const handleMove = (event: MouseEvent | TouchEvent) => {
      if (!isDragging) return;

      currentX = getClientX(event);
      const deltaX = currentX - startX;
      const rotation = deltaX * 0.1;

      card.style.transform = `translateX(${deltaX}px) rotate(${rotation}deg)`;
      card.style.opacity = String(1 - Math.abs(deltaX) / 300);

      // Show interested/not interested indicators
      const interestedIndicator = card.querySelector(
        ".interested-indicator"
      ) as HTMLElement;
      const notInterestedIndicator = card.querySelector(
        ".not-interested-indicator"
      ) as HTMLElement;

      if (interestedIndicator && notInterestedIndicator) {
        if (deltaX > 50) {
          interestedIndicator.style.opacity = String(Math.min(deltaX / 150, 1));
          notInterestedIndicator.style.opacity = "0";
        } else if (deltaX < -50) {
          notInterestedIndicator.style.opacity = String(
            Math.min(Math.abs(deltaX) / 150, 1)
          );
          interestedIndicator.style.opacity = "0";
        } else {
          interestedIndicator.style.opacity = "0";
          notInterestedIndicator.style.opacity = "0";
        }
      }
    };

    const handleEnd = () => {
      if (!isDragging) return;
      isDragging = false;

      const deltaX = currentX - startX;
      card.style.transition = "transform 0.3s ease-out, opacity 0.3s ease-out";

      if (Math.abs(deltaX) > 100) {
        handleSwipe(deltaX > 0 ? "right" : "left", cardIndex);
      } else {
        // Snap back
        card.style.transform = "translateX(0) rotate(0deg)";
        card.style.opacity = "1";

        // Hide indicators
        const interestedIndicator = card.querySelector(
          ".interested-indicator"
        ) as HTMLElement;
        const notInterestedIndicator = card.querySelector(
          ".not-interested-indicator"
        ) as HTMLElement;
        if (interestedIndicator) interestedIndicator.style.opacity = "0";
        if (notInterestedIndicator) notInterestedIndicator.style.opacity = "0";
      }
    };

    if ("touches" in e) {
      handleStart(e.nativeEvent);
      document.addEventListener("touchmove", handleMove);
      document.addEventListener("touchend", handleEnd, { once: true });
    } else {
      handleStart(e.nativeEvent);
      document.addEventListener("mousemove", handleMove);
      document.addEventListener("mouseup", handleEnd, { once: true });
    }
  };

  if (currentJobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] p-8">
        <div className="text-center space-y-4">
          <div className="text-6xl">🎯</div>
          <h2 className="text-2xl font-bold">No more jobs!</h2>
          <p className="text-muted-foreground">
            You've seen all available positions.
          </p>
          <p className="text-sm text-muted-foreground">
            You have {savedJobs.length} saved jobs!
          </p>
          <Button onClick={handleReset} className="mt-4">
            Reset Jobs
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-xl mx-auto py-4">
      {/* Job Saved Notification */}
      {showSaved && lastSaved && (
        <div className="fixed inset-0 bg-zinc-900/80 backdrop-blur-md flex items-center justify-center z-50 animate-in fade-in duration-300">
          <div className="text-center text-white space-y-4 max-w-md p-8 bg-zinc-900 border border-zinc-700 rounded-3xl shadow-2xl">
            <div className="text-6xl animate-bounce">💼</div>
            <h2 className="text-3xl font-extrabold tracking-tight">Job Saved!</h2>
            <p className="text-lg text-zinc-300">You matched with <span className="text-white font-bold">{lastSaved.title}</span></p>
            <p className="text-sm text-zinc-400">at {lastSaved.company?.name || "Company"}</p>
          </div>
        </div>
      )}

      {/* Job Card Stack */}
      <div className="relative h-[580px] w-full">
        {currentJobs.map((job, index) => (
          <Card
            key={job.id}
            ref={(el) => {
              cardRefs.current[index] = el;
            }}
            className={`absolute inset-0 cursor-grab active:cursor-grabbing transition-all duration-300 border-2 border-zinc-200 bg-white shadow-2xl rounded-3xl overflow-hidden ${
              index === 0
                ? "z-30"
                : index === 1
                  ? "z-20 scale-[0.96]"
                  : "z-10 scale-[0.92]"
            }`}
            style={{
              transform: `scale(${1 - index * 0.04}) translateY(${index * 12}px)`,
              opacity: 1 - index * 0.15,
            }}
            onMouseDown={
              index === 0 ? (e) => handleCardInteraction(e, 0) : undefined
            }
            onTouchStart={
              index === 0 ? (e) => handleCardInteraction(e, 0) : undefined
            }
          >
            <CardContent className="p-0 h-full relative flex flex-col overflow-hidden">
              {/* Interested/Not Interested Indicators */}
              <div className="interested-indicator absolute top-8 right-8 z-40 opacity-0 transition-opacity">
                <div className="bg-emerald-500 text-white px-6 py-2 rounded-full font-black text-xl tracking-wider shadow-lg border-4 border-white rotate-12">
                  MATCH
                </div>
              </div>
              <div className="not-interested-indicator absolute top-8 left-8 z-40 opacity-0 transition-opacity">
                <div className="bg-rose-500 text-white px-6 py-2 rounded-full font-black text-xl tracking-wider shadow-lg border-4 border-white -rotate-12">
                  PASS
                </div>
              </div>

              {/* Company Header */}
              <div className="relative h-36 bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 p-6 flex items-center text-white">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
                <div className="relative z-10 w-20 h-20 bg-white rounded-2xl flex items-center justify-center mr-5 shadow-xl border border-zinc-200 p-2">
                  {job.company?.logoUrl ? (
                    <img
                      src={job.company.logoUrl || "/placeholder.svg"}
                      alt={job.company.name}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <Building2 className="w-10 h-10 text-zinc-800" />
                  )}
                </div>
                <div className="relative z-10 flex-1">
                  <h3 className="font-bold text-2xl text-white tracking-tight">
                    {job.company?.name || "Company Name"}
                  </h3>
                  <div className="flex items-center text-sm text-zinc-300 mt-1 font-medium">
                    <MapPin className="w-4 h-4 mr-1.5 text-zinc-400" />
                    {job.jobLocation?.label || "Location"}
                  </div>
                </div>
              </div>

              {/* Job Details */}
              <div className="p-8 space-y-6 flex-1 overflow-y-auto bg-zinc-50/50">
                <div>
                  <h2 className="text-3xl font-extrabold text-zinc-900 tracking-tight mb-3">
                    {job.title}
                  </h2>
                  <div className="flex flex-wrap items-center gap-6 text-sm text-zinc-600 font-semibold mb-4">
                    <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-zinc-200 shadow-sm">
                      <DollarSign className="w-4 h-4 text-zinc-900" />
                      {job.salary && job.currencyType
                        ? formatSalary(job.salary, job.currencyType)
                        : "Salary not specified"}
                    </div>
                    <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-zinc-200 shadow-sm">
                      <Calendar className="w-4 h-4 text-zinc-900" />
                      {job.postedDate
                        ? formatDate(job.postedDate)
                        : "Date not available"}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {job.jobType?.label && (
                    <Badge variant="secondary" className="text-xs font-bold uppercase tracking-wider bg-zinc-200 text-zinc-800 px-3 py-1">
                      {job.jobType.label}
                    </Badge>
                  )}
                  {job.status && (
                    <Badge variant="outline" className="text-xs font-bold uppercase tracking-wider border-zinc-300 text-zinc-700 px-3 py-1">
                      {job.status}
                    </Badge>
                  )}
                  {job.approved === "APPROVED" && (
                    <Badge className="text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-700 border border-emerald-500/30 px-3 py-1">
                      Verified
                    </Badge>
                  )}
                </div>

                <div className="space-y-2">
                  <h4 className="text-base font-bold text-zinc-900">Job Description</h4>
                  <p className="text-sm text-zinc-600 leading-relaxed font-normal">
                    {job.description
                      ? stripHtml(job.description)
                      : "No description available"}
                  </p>
                </div>

                <div className="pt-6 border-t border-zinc-200/80 mt-auto">
                  <div className="flex justify-between text-xs font-bold text-zinc-500 uppercase tracking-wider">
                    <span>
                      Posted by: {job.postedByUser?.name || "Hiring Manager"}
                    </span>
                    <span>
                      Deadline:{" "}
                      {job.deadline
                        ? formatDate(job.deadline)
                        : "Flexible"}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center items-center gap-6 mt-8">
        <Button
          variant="outline"
          size="icon"
          className="h-16 w-16 rounded-full border-2 border-red-200 bg-white hover:bg-red-500 hover:border-red-500 hover:text-white group shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-110 active:scale-95"
          onClick={() => handleSwipe("left")}
          disabled={currentJobs.length === 0 || isAnimating}
        >
          <X className="h-8 w-8 text-red-500 group-hover:text-white transition-colors duration-200" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="h-14 w-14 rounded-full border-2 border-blue-200 bg-white hover:bg-blue-500 hover:border-blue-500 hover:text-white group shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-110 active:scale-95"
          onClick={handleUndo}
          disabled={savedJobs.length === 0 || isAnimating}
        >
          <RotateCcw className="h-6 w-6 text-blue-500 group-hover:text-white transition-colors duration-200" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="h-14 w-14 rounded-full border-2 border-amber-200 bg-white hover:bg-amber-500 hover:border-amber-500 hover:text-white group shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-110 active:scale-95"
          disabled={currentJobs.length === 0 || isAnimating}
        >
          <Bookmark className="h-6 w-6 text-amber-500 group-hover:text-white transition-colors duration-200" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="h-16 w-16 rounded-full border-2 border-emerald-200 bg-white hover:bg-emerald-500 hover:border-emerald-500 hover:text-white group shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-110 active:scale-95"
          onClick={() => handleSwipe("right")}
          disabled={currentJobs.length === 0 || isAnimating}
        >
          <Heart className="h-8 w-8 text-emerald-500 group-hover:text-white transition-colors duration-200" />
        </Button>
      </div>

      {/* Stats */}
      <div className="text-center mt-6">
        <p className="text-sm font-semibold text-zinc-500 bg-zinc-100 py-2 px-4 rounded-full inline-block border border-zinc-200">
          <span className="text-emerald-600 font-bold">{savedJobs.length} saved</span> • <span className="text-zinc-700 font-bold">{currentJobs.length} remaining</span>
        </p>
      </div>
    </div>
  );
}
