import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SocialAuth from "@/components/auth/social-auth";
import Link from "next/link";

interface AuthCardWrapperProps {
  title: string;
  redirectLink: string;
  redirectText: string;
  children: React.ReactNode;
  socials?: boolean;
}

const AuthCardWrapper = ({
  title,
  redirectLink,
  redirectText,
  children,
  socials = true,
}: AuthCardWrapperProps) => {
  return (
    <Card className="max-w-[400px] w-full shadow-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center tracking-wide">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {socials && (
          <>
            <SocialAuth />
            <span className="text-muted-foreground text-center block my-4">
              or
            </span>
          </>
        )}
        {children}
      </CardContent>
      <CardFooter className="justify-center">
        New job seeker?{" "}
        <Link
          href={redirectLink}
          className="text-primary hover:underline ms-4 font-semibold"
        >
          {redirectText}
        </Link>
      </CardFooter>
    </Card>
  );
};

export default AuthCardWrapper;
