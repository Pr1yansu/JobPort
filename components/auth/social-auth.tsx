import React from "react";
import { FaLinkedin, FaFacebook } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";

const SocialAuth = () => {
  return (
    <div className="flex gap-4 justify-center items-center">
      <Button size={"icon"} variant={"outline"}>
        <FcGoogle className="!size-6" />
      </Button>
      <Button size={"icon"} variant={"outline"}>
        <FaFacebook className="text-blue-700 !size-6" />
      </Button>
      <Button size={"icon"} variant={"outline"}>
        <FaLinkedin className="text-blue-600 !size-6" />
      </Button>
    </div>
  );
};

export default SocialAuth;
