"use client";
import React from "react";
import { Button } from "@/components/ui/button";

const InviteFriends = () => {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Invite Friends",
        text: "Invite your friends and earn referral bonus from us.",
        url: process.env.NEXT_PUBLIC_API_URL,
      });
    }
  };
  return (
    <div className="p-4 bg-primary/10 rounded-md space-y-2">
      <h4 className="text-base font-semibold">Invite Friends</h4>
      <p className="text-sm text-primary/60">
        Invite your friends and earn referral bonus from us.
      </p>
      <Button onClick={handleShare}>Invite Friends</Button>
    </div>
  );
};

export default InviteFriends;
