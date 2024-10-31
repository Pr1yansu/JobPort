import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bookmark } from "lucide-react";
import { useBookmark } from "@/hooks/use-bookmark";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface JobButtonProps {
  handleBookmarkClick: (
    e: React.MouseEvent<SVGSVGElement, MouseEvent>,
    id: string
  ) => void;
  handleJobSelect: (id: string) => void;
  selected?: boolean;
  job: {
    id: string;
    title: string;
    company: string;
    location: string;
    type: string;
    image?: string;
    description?: string;
    status?: "OPEN" | "CLOSED" | null;
  };
}

const JobButton = ({
  handleJobSelect,
  handleBookmarkClick,
  job,
  selected,
}: JobButtonProps) => {
  const { bookmarks } = useBookmark();
  console.log(job.description);

  return (
    <div
      className={cn(
        "p-2 hover:bg-zinc-100 group transition-all duration-300 cursor-pointer rounded-md flex gap-2 relative border border-primary/5 hover:border-transparent",
        selected && "bg-zinc-100"
      )}
      onClick={() => {
        handleJobSelect(job.id);
      }}
    >
      <Avatar
        className={cn(
          "size-16 rounded-md group-hover:bg-white transition-all duration-300",
          selected && "bg-white"
        )}
      >
        <AvatarImage
          src={job.image}
          alt={job.company}
          className={cn(
            "rounded-md group-hover:bg-white transition-all duration-300",
            selected && "bg-white"
          )}
        />
        <AvatarFallback
          className={cn(
            "rounded-md group-hover:bg-white transition-all duration-300",
            selected && "bg-white"
          )}
        >
          {job.company[0] + job.company[1]}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-1">
        <h4 className="text-sm font-semibold group-hover:text-primary transition-all duration-300 gap-4 flex items-center">
          {job.title}
        </h4>
        <p className="text-muted-foreground text-xs">
          {job.company} - {job.location}
        </p>
      </div>
      <div className="absolute right-2 top-2 flex gap-2 items-center">
        <Badge variant={job.status === "OPEN" ? "success" : "destructive"}>
          {job.status}
        </Badge>
        <Bookmark
          className={cn("", {
            "fill-primary": bookmarks.some(
              (bookmark) => bookmark.id === job.id
            ),
          })}
          size={20}
          onClick={(e: React.MouseEvent<SVGSVGElement, MouseEvent>) =>
            handleBookmarkClick(e, job.id)
          }
        />
      </div>
    </div>
  );
};

export default JobButton;
