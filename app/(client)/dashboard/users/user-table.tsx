"use client";
import React from "react";
import { DataTable } from "@/components/data-table";
import { useGetAllUsers } from "@/features/auth/api/use-get-all-users";
import { columns } from "./columns";
import { Skeleton } from "@/components/ui/skeleton";

const UserTable = () => {
  const { data, isLoading } = useGetAllUsers();

  if (isLoading) {
    return (
      <>
        <Skeleton className="h-8 w-80 mb-4" />
        <div className="border w-full rounded-md p-2 grid grid-cols-4 gap-4">
          <div className="grid grid-cols-4 gap-4 border-b col-span-4 pb-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-4 w-full" />
            ))}
          </div>
          {Array.from({ length: 16 }).map((_, index) => (
            <Skeleton key={index} className="h-4 w-full" />
          ))}
        </div>
        <div className="mt-4 justify-end gap-4 flex items-center">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-24" />
        </div>
      </>
    );
  }

  return <DataTable columns={columns} data={data || []} />;
};

export default UserTable;
