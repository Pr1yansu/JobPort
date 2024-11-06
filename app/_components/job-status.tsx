import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Link from "next/link";

interface JobStatusProps {
  status: "loading" | "not-found";
  onRetry?: () => void;
}

export default function Component(
  { status, onRetry }: JobStatusProps = { status: "loading" }
) {
  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardContent className="pt-6 pb-4 text-center">
        {status === "loading" ? (
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
        ) : (
          <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
        )}
        <h2 className="mt-4 text-2xl font-semibold">
          {status === "loading" ? "Loading..." : "Job Not Found"}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {status === "loading"
            ? "Please wait while we fetch the job details."
            : "The job you're looking for doesn't exist or has been removed."}
        </p>
      </CardContent>
      {status === "not-found" && (
        <CardFooter className="justify-center gap-2">
          <Link href="/dashboard/jobs">
            <Button variant="outline">Go Back</Button>
          </Link>
          <Button onClick={onRetry} variant="outline">
            Try Again
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

export { Component as JobStatus };
