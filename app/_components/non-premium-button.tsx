import { Lock } from "lucide-react";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const NonPremiumButton = ({ feature }: { feature: string }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="text-sm ml-2 flex items-center justify-center">
          <Lock className="inline mr-2 size-4" />
          {feature}
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>
            You need a PREMIUM account to access this feature
          </DialogTitle>
          <DialogDescription>
            Upgrade to premium to unlock this feature and enjoy a better
            experience on JobPort.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default NonPremiumButton;
