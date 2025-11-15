"use client";
import React from "react";
import { FaFacebook } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import { signIn } from "next-auth/react";

type SocialAuthProps = {
  google?: boolean;
  facebook?: boolean;
  github?: boolean;
};

const SocialAuth: React.FC<SocialAuthProps> = ({ google, facebook, github }) => {
  return (
    <div className="flex gap-4 justify-center items-center">
      {google && (
        <Button size={"icon"} variant={"outline"} onClick={() => signIn("google")}> 
          <FcGoogle className="!size-6" />
        </Button>
      )}
      {facebook && (
        <Button size={"icon"} variant={"outline"} onClick={() => signIn("facebook")}> 
          <FaFacebook className="text-blue-700 !size-6" />
        </Button>
      )}
      {github && (
        <Button size={"icon"} variant={"outline"} onClick={() => signIn("github")}> 
          <Github className="text-black-900 !size-6" />
        </Button>
      )}
    </div>
  );
};

export default SocialAuth;
