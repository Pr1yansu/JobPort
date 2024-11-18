"use client";
import { useTransition } from "react";
import { useMutation } from "convex/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import { Copy, Plus, CloudOff, CloudUpload, Loader2 } from "lucide-react";
import SearchBox from "@/components/search-box";
import { useSearchUsers } from "@/features/users/api/use-users";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Actions = ({ resume }: { resume: any }) => {
  const { data: searchedUsers, isLoading: searchedUsersPending } =
    useSearchUsers();
  const [isPending, startTransition] = useTransition();
  const resumeUpdate = useMutation(api.resume.updateResume);

  const handlePublish = () => {
    if (!resume) return;
    if (!resume._id) return;
    startTransition(() =>
      resumeUpdate({
        _id: resume._id,
        isPublished: resume.isPublished ? false : true,
      })
        .then(() => {
          toast.success(
            `Resume ${resume.isPublished ? "unpublished" : "published"}`
          );
        })
        .catch(() => {
          toast.error(
            `Failed to ${resume.isPublished ? "unpublish" : "publish"} resume`
          );
        })
    );
  };

  return (
    <div className="flex gap-2">
      <Button
        size={"sm"}
        onClick={() => {
          window.print();
        }}
      >
        Download PDF
      </Button>
      <Popover>
        <PopoverTrigger asChild>
          <Button size={"sm"} variant={"outline"}>
            Share
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="space-y-2">
          <h4 className="text-muted-foreground text-sm font-semibold text-center">
            Share your resume with the world by copying the link below
          </h4>
          {resume.isPublished && (
            <div className="flex items-center gap-2">
              <Input
                type="text"
                className="w-full p-2 rounded-lg"
                value={`${process.env.NEXT_PUBLIC_API_URL}/resume/previews/${resume._id}`}
                readOnly
              />
              <Button
                size={"sm"}
                variant={"outline"}
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${process.env.NEXT_PUBLIC_API_URL}/resume/previews/${resume._id}`
                  );
                  toast.success("Link copied to clipboard");
                }}
              >
                <Copy size={24} />
              </Button>
            </div>
          )}
          <Button
            className="w-full"
            variant={resume.isPublished ? "outline" : "default"}
            onClick={handlePublish}
            disabled={isPending}
          >
            {resume.isPublished ? (
              <>
                Unpublish <CloudOff size={24} />
              </>
            ) : (
              <>
                Publish <CloudUpload size={24} />
              </>
            )}
          </Button>
          <Button
            variant={"outline"}
            className="w-full"
            onClick={() => {
              navigator.clipboard.writeText(
                `${process.env.NEXT_PUBLIC_API_URL}/dashboard/resume/${resume._id}`
              );
              toast.success("Link copied to clipboard to share with others");
            }}
          >
            Share to Collaborators
          </Button>
        </PopoverContent>
      </Popover>
      <Dialog>
        <DialogTrigger asChild>
          <Button size={"icon-sm"} variant={"outline"}>
            <Plus />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Collaborators</DialogTitle>
            <DialogDescription>
              Add your friends and colleagues to collaborate on your resume
            </DialogDescription>
          </DialogHeader>
          <div>
            <SearchBox
              placeholder="Search for friends and colleagues"
              queryStr="collaborators"
            />
            {searchedUsersPending ? (
              <div className="flex items-center justify-center p-5 mt-5">
                <Loader2 className="animate-spin" />
              </div>
            ) : (
              <div>
                {searchedUsers?.success && (
                  <div>
                    {searchedUsers.data.length > 0 &&
                      searchedUsers.data.map((user) => {
                        const alreadyCollaborator =
                          resume.collaboratorIds.includes(user.id);
                        return (
                          <div
                            key={user.id}
                            className="flex items-center justify-between p-5 bg-white rounded-lg shadow-sm"
                          >
                            <div className="flex items-center gap-2">
                              <Avatar>
                                <AvatarImage
                                  src={user.image || undefined}
                                  alt={user.name}
                                />
                                <AvatarFallback>{user.name[0]}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-semibold">{user.name}</p>
                                <p className="text-muted-foreground">
                                  {user.email}
                                </p>
                              </div>
                            </div>
                            <Button
                              size={"sm"}
                              variant={"outline"}
                              onClick={async () => {
                                let response: any;
                                if (alreadyCollaborator) {
                                  response = resumeUpdate({
                                    _id: resume._id,
                                    collaboratorIds:
                                      resume.collaboratorIds.filter(
                                        (id: string) => id !== user.id
                                      ),
                                  });
                                } else {
                                  response = resumeUpdate({
                                    _id: resume._id,
                                    collaboratorIds: [
                                      ...resume.collaboratorIds,
                                      user.id,
                                    ],
                                  });
                                }

                                await response;
                              }}
                            >
                              {alreadyCollaborator ? "Remove" : "Add"}
                            </Button>
                          </div>
                        );
                      })}
                  </div>
                )}
                {searchedUsers?.success === false && (
                  <div className="flex items-center justify-center p-5 mt-5">
                    <p className="text-muted-foreground text-center">
                      {searchedUsers?.message}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              className="w-full"
              onClick={() => {
                toast.success("Collaborators added successfully");
              }}
            >
              Add Collaborators
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Actions;
