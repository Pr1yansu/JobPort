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
    <div className="relative w-full max-w-sm mx-auto">
      {/* Job Saved Notification */}
      {showSaved && lastSaved && (
        <div className="fixed inset-0 bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center z-50 animate-in fade-in duration-300">
          <div className="text-center text-white space-y-4">
            <div className="text-6xl animate-bounce">💼</div>
            <h2 className="text-3xl font-bold">Job Saved!</h2>
            <p className="text-lg">You're interested in {lastSaved.title}</p>
            <p className="text-sm">at {lastSaved.company.name}</p>
          </div>
        </div>
      )}

      {/* Job Card Stack */}
      <div className="relative h-[600px]">
        {currentJobs.map((job, index) => (
          <Card
            key={job.id}
            ref={(el) => {
              cardRefs.current[index] = el;
            }}
            className={`absolute inset-0 cursor-grab active:cursor-grabbing transition-all duration-300 ${
              index === 0
                ? "z-30"
                : index === 1
                  ? "z-20 scale-95"
                  : "z-10 scale-90"
            }`}
            style={{
              transform: `scale(${1 - index * 0.05}) translateY(${index * 8}px)`,
              opacity: 1 - index * 0.2,
            }}
            onMouseDown={
              index === 0 ? (e) => handleCardInteraction(e, 0) : undefined
            }
            onTouchStart={
              index === 0 ? (e) => handleCardInteraction(e, 0) : undefined
            }
          >
            <CardContent className="p-0 h-full relative overflow-hidden">
              {/* Interested/Not Interested Indicators */}
              <div className="interested-indicator absolute top-8 right-8 z-40 opacity-0 transition-opacity">
                <div className="bg-green-500 text-white px-4 py-2 rounded-full font-bold text-lg border-4 border-green-400 rotate-12">
                  INTERESTED
                </div>
              </div>
              <div className="not-interested-indicator absolute top-8 left-8 z-40 opacity-0 transition-opacity">
                <div className="bg-red-500 text-white px-4 py-2 rounded-full font-bold text-lg border-4 border-red-400 -rotate-12">
                  PASS
                </div>
              </div>

              {/* Company Header */}
              <div className="relative h-32 bg-gradient-to-br from-blue-100 to-purple-100 p-6 flex items-center">
                <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center mr-4 shadow-md">
                  {job.company?.logoUrl ? (
                    <img
                      src={job.company.logoUrl || "/placeholder.svg"}
                      alt={job.company.name}
                      className="w-12 h-12 object-contain"
                    />
                  ) : (
                    <Building2 className="w-8 h-8 text-blue-600" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-800">
                    {job.company?.name || "Company Name"}
                  </h3>
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    {job.jobLocation?.label || "Location"}
                  </div>
                </div>
              </div>

              {/* Job Details */}
              <div className="p-6 space-y-4 h-[calc(100%-8rem)] overflow-y-auto">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {job.title}
                  </h2>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-1" />
                      {job.salary && job.currencyType
                        ? formatSalary(job.salary, job.currencyType)
                        : "Salary not specified"}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {job.postedDate
                        ? formatDate(job.postedDate)
                        : "Date not available"}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mb-4">
                  {job.jobType?.label && (
                    <Badge variant="secondary" className="text-xs">
                      {job.jobType.label}
                    </Badge>
                  )}
                  {job.status && (
                    <Badge variant="outline" className="text-xs">
                      {job.status}
                    </Badge>
                  )}
                  {job.approved === "APPROVED" && (
                    <Badge
                      variant="default"
                      className="text-xs bg-green-100 text-green-800"
                    >
                      Verified
                    </Badge>
                  )}
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Job Description</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {job.description
                      ? stripHtml(job.description)
                      : "No description available"}
                  </p>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>
                      Posted by: {job.postedByUser?.name || "Unknown"}
                    </span>
                    <span>
                      Deadline:{" "}
                      {job.deadline
                        ? formatDate(job.deadline)
                        : "Not specified"}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <Button
          variant="outline"
          size="icon"
          className="h-14 w-14 rounded-full border-2 hover:bg-red-50 hover:border-red-200"
          onClick={() => handleSwipe("left")}
          disabled={currentJobs.length === 0 || isAnimating}
        >
          <X className="h-6 w-6 text-red-500" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="h-12 w-12 rounded-full border-2 hover:bg-blue-50 hover:border-blue-200"
          onClick={handleUndo}
          disabled={savedJobs.length === 0 || isAnimating}
        >
          <RotateCcw className="h-5 w-5 text-blue-500" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="h-12 w-12 rounded-full border-2 hover:bg-yellow-50 hover:border-yellow-200"
          disabled={currentJobs.length === 0 || isAnimating}
        >
          <Bookmark className="h-5 w-5 text-yellow-500" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="h-14 w-14 rounded-full border-2 hover:bg-green-50 hover:border-green-200"
          onClick={() => handleSwipe("right")}
          disabled={currentJobs.length === 0 || isAnimating}
        >
          <Heart className="h-6 w-6 text-green-500" />
        </Button>
      </div>

      {/* Stats */}
      <div className="text-center mt-4">
        <p className="text-sm text-muted-foreground">
          {savedJobs.length} saved jobs • {currentJobs.length} jobs remaining
        </p>
      </div>
    </div>
  );
}
