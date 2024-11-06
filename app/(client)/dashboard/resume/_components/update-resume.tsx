"use client";
import React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useSession } from "next-auth/react";
import { UpdateIcon } from "@radix-ui/react-icons";
import Link from "next/link";

const UpdateResume = () => {
  const { data: session } = useSession();
  const data = useQuery(api.resume.getAllResumes, {
    userId: session?.user.id as string,
  });
  console.log(data);
  if (!session || !data) return null;

  return (
    <>
      {data.map((resume) => (
        <Link key={resume._id} href={`/dashboard/resume/${resume._id}`}>
          <div className="border-dashed border-2 w-full h-full rounded-md flex justify-center items-center min-h-60 text-muted-foreground cursor-pointer p-5">
            <div className="flex flex-col items-center">
              <UpdateIcon className="size-16" />
              <p className="text-center mt-2">Update Resume</p>
              <p className="text-center mt-1 text-xs text-muted-foreground">
                {resume.title}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </>
  );
};

export default UpdateResume;

// const UpdateResume = () => {
//   return (
//     <Dialog>
//       <DialogTrigger asChild>
//         <div className="border-dashed border-2 w-full h-full rounded-md flex justify-center items-center min-h-60 text-muted-foreground cursor-pointer p-5">
//           <div className="flex flex-col items-center">
//             <UpdateIcon className="size-16" />
//             <p className="text-center mt-2">Update Resume</p>
//           </div>
//         </div>
//       </DialogTrigger>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Are you absolutely sure?</DialogTitle>
//           <DialogDescription>
//             This action cannot be undone. This will permanently delete your
//             account and remove your data from our servers.
//           </DialogDescription>
//         </DialogHeader>
//       </DialogContent>
//     </Dialog>
//   );
// };
