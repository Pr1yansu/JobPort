"use client";
import React, { useEffect } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useInboxModal } from "../_hooks/use-inbox-hook";
import { useSession } from "next-auth/react";
import { FaSuitcase } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const InboxModal = () => {
  const { data } = useSession();
  const { isOpen, onClose, isShown, onShow, open } = useInboxModal();

  useEffect(() => {
    if (!data) return;
    if (!data.user) return;

    if (data.user.id) {
      open();
    }
  }, [data]);

  if (isShown) return null;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        onClose();
        onShow();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Welcome to JobPort!</DialogTitle>
          <Separator />
          <DialogDescription>
            Thank you for choosing JobPort for your career partner. We are here
            to help you find your dream job.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button>
              Find Jobs
              <FaSuitcase className="ml-2" />
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InboxModal;
