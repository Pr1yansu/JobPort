"use client";

import { InferResponseType } from "hono";
import { ColumnDef } from "@tanstack/react-table";

import { client } from "@/lib/rpc";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import UserCellActions from "./user-actions";

type ResponseType = InferResponseType<
  (typeof client.api.data.users.user)[":id"]["$get"]
>;

export const columns: ColumnDef<ResponseType>[] = [
  {
    header: "Avatar",
    cell: ({ row }) => {
      return (
        <Avatar>
          <AvatarImage src={row.original.image || undefined} />
          <AvatarFallback>{row.original.name[0]}</AvatarFallback>
        </Avatar>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      return (
        <a
          href={`mailto:${row.original.email}`}
          className="text-blue-600 hover:underline flex"
        >
          <span className=" w-40 text-ellipsis overflow-hidden whitespace-nowrap">
            {row.original.email}
          </span>
        </a>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    header: "Role",
    cell: ({ row }) => {
      if (row.original.isBanned) {
        return <Badge variant="danger">Banned</Badge>;
      }
      return (
        <Badge
          variant={
            row.original.role === "ADMIN"
              ? "destructive"
              : row.original.role === "RECRUITER"
                ? "secondary"
                : "default"
          }
        >
          {row.original.role}
        </Badge>
      );
    },
  },
  {
    header: "Actions",
    cell: ({ row }) => {
      return (
        <UserCellActions
          userId={row.original.id}
          role={row.original.role}
          isBanned={row.original.isBanned}
        />
      );
    },
  },
];
