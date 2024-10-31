import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AArrowUp,
  ArrowBigDownDash,
  ArrowBigUpDash,
  Ban,
  Check,
  MoreHorizontal,
} from "lucide-react";
import {
  useAdminPromotion,
  useBan,
  useDemotion,
  useRecruiterPromotion,
  useUnBan,
} from "@/features/auth/api/use-roles";
import { useConfirm } from "@/hooks/use-confirm";

interface UserCellActionsProps {
  userId: string;
  role: "ADMIN" | "RECRUITER" | "USER" | null;
  isBanned: boolean | null;
}

const UserCellActions: React.FC<UserCellActionsProps> = ({
  userId,
  role,
  isBanned,
}) => {
  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "This action cannot be undone."
  );
  const {
    mutate: banUser,
    isPending: isBanPending,
    data: banUserData,
  } = useBan();
  const {
    mutate: demoteUser,
    isPending: isDemotePending,
    data: demoteUserData,
  } = useDemotion();
  const {
    mutate: promoteAdmin,
    isPending: isPromoteAdminPending,
    data: promoteAdminData,
  } = useAdminPromotion();
  const {
    mutate: promoteRecruiter,
    isPending: isPromoteRecruiterPending,
    data: promoteRecruiterData,
  } = useRecruiterPromotion();
  const {
    mutate: unBanUser,
    isPending: isUnBanPending,
    data: unBanUserData,
  } = useUnBan();

  const handleBan = async () => {
    const confirmed = await confirm(
      "Confirm Ban?",
      "This user will be banned."
    );
    if (confirmed) {
      banUser({
        param: {
          id: userId,
        },
      });
    }
  };
  const handleMakeUser = async () => {
    const confirmed = await confirm(
      "Confirm Demotion?",
      "This user will be demoted to a regular user."
    );
    if (confirmed) {
      demoteUser({
        param: {
          id: userId,
        },
      });
    }
  };
  const handleMakeAdmin = async () => {
    const confirmed = await confirm(
      "Confirm Promotion?",
      "This user will be promoted to an admin."
    );
    if (confirmed) {
      promoteAdmin({
        param: {
          id: userId,
        },
      });
    }
  };
  const handleMakeRecruiter = async () => {
    const confirmed = await confirm(
      "Confirm Promotion?",
      "This user will be promoted to a recruiter."
    );
    if (confirmed) {
      promoteRecruiter({
        param: {
          id: userId,
        },
      });
    }
  };

  const handleUnBan = async () => {
    const confirmed = await confirm(
      "Confirm Unban?",
      "This user will be unbanned."
    );
    if (confirmed) {
      unBanUser({
        param: {
          id: userId,
        },
      });
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <MoreHorizontal />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {role !== "ADMIN" && !isBanned && (
            <DropdownMenuItem onClick={handleBan} disabled={isBanPending}>
              <Ban />
              Ban
            </DropdownMenuItem>
          )}
          {role === "USER" && (
            <DropdownMenuItem
              onClick={handleMakeRecruiter}
              disabled={isPromoteRecruiterPending}
            >
              <ArrowBigUpDash />
              Make Recruiter
            </DropdownMenuItem>
          )}
          {role !== "ADMIN" && (
            <DropdownMenuItem
              onClick={handleMakeAdmin}
              disabled={isPromoteAdminPending}
            >
              <AArrowUp />
              Make Admin
            </DropdownMenuItem>
          )}
          {role === "RECRUITER" && (
            <DropdownMenuItem
              onClick={handleMakeUser}
              disabled={isDemotePending}
            >
              <ArrowBigDownDash />
              Make User
            </DropdownMenuItem>
          )}

          {isBanned && (
            <DropdownMenuItem onClick={handleUnBan} disabled={isUnBanPending}>
              <Check />
              Unban
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <ConfirmDialog />
    </>
  );
};

export default UserCellActions;
