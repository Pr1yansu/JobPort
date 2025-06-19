"use client";
import React from "react";
import { FaFacebook } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import { signIn } from "next-auth/react";

const SocialAuth = () => {
  return (
    <div className="flex gap-4 justify-center items-center">
      <Button
        size={"icon"}
        variant={"outline"}
        onClick={() => signIn("google")}
      >
        <FcGoogle className="!size-6" />
      </Button>
      <Button
        size={"icon"}
        variant={"outline"}
        onClick={() => signIn("google")}
      >
        <FaFacebook className="text-blue-700 !size-6" />
      </Button>
      <Button
        size={"icon"}
        variant={"outline"}
        onClick={() => signIn("google")}
      >
        <Github className="text-black-900 !size-6" />
      </Button>
    </div>
  );
};

export default SocialAuth;
