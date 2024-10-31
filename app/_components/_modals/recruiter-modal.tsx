"use client";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { toast } from "sonner";

import { useApplyRecruiter } from "@/features/jobs/api/use-apply-recruiter";
import { useRecruiterModal } from "@/hooks/use-recruiter-modal";
import { useSession } from "next-auth/react";

const RecruiterModal = () => {
  const { data: session } = useSession();
  const { isOpen, close } = useRecruiterModal();
  const { mutate, isPending, data } = useApplyRecruiter();

  const handleAccept = () => {
    if (!session?.user?.id) return;
    mutate({
      userId: session?.user?.id,
      approved: "PENDING",
    });
  };

  useEffect(() => {
    if (data) {
      if (data.success) {
        toast.success(data.message);
        close();
      } else {
        toast.error(data.message);
      }
    }
  }, [data]);

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently make you a
            recruiter. Then you will be able to post jobs and hire candidates.
            Your account will be reviewed by our team before you can start.
            Please check your email for further instructions.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={close} variant={"outline"} disabled={isPending}>
            Cancel
          </Button>
          <Button
            onClick={handleAccept}
            variant={"destructive"}
            disabled={isPending}
          >
            Yes, I'm sure
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RecruiterModal;
