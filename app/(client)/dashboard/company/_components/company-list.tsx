"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useDeleteCompany } from "@/features/companies/api/use-company";
import { useGetCompaniesByAuthenticatedUser } from "@/features/jobs/api/use-company";
import { useConfirm } from "@/hooks/use-confirm";
import { AtSign, Building2, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useMemo } from "react";
import { FaLocationPin } from "react-icons/fa6";

const CompanyList = () => {
  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure you want to delete this company?",
    "This action cannot be undone. All posted jobs will be deleted."
  );
  const { data: session } = useSession();
  const { mutate: deleteCompany, isPending: isDeleting } = useDeleteCompany();

  const router = useRouter();
  const { data, isLoading } = useGetCompaniesByAuthenticatedUser();

  const companies = useMemo(() => {
    if (!data) return [];
    return data.companies;
  }, [data]);

  if (!session) router.push("/auth/login");

  if (isLoading) {
    return (
      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-2 my-4">
        {Array.from({ length: 12 }).map((_, index) => (
          <Skeleton key={index} className="h-40" />
        ))}
      </div>
    );
  }

  const handleDeleteCompany = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const isConfirmed = await confirm();
    if (!isConfirmed) return;
    deleteCompany({
      param: {
        id,
      },
    });
  };

  return (
    <>
      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-2 my-4">
        {companies.map((company) => {
          return (
            <Link key={company.id} href={`/dashboard/company/${company.id}`}>
              <Card className="bg-white rounded-lg shadow-md cursor-pointer relative">
                <Button
                  size={"icon"}
                  variant={"ghost-destructive"}
                  className="absolute top-2 right-2 cursor-default"
                  disabled={isDeleting}
                  onClick={(e) => {
                    handleDeleteCompany(e, company.id);
                  }}
                >
                  <Trash2 size={24} />
                </Button>
                <CardHeader>
                  <h4 className="text-lg font-semibold capitalize flex items-center gap-2">
                    <Building2 size={24} className="mr-1" />
                    {company.name}
                  </h4>
                  {company.email && (
                    <div className="flex items-center gap-1">
                      <AtSign size={16} className="mr-1" />
                      <p className="text-muted-foreground  w-20 overflow-hidden text-ellipsis text-xs">
                        {company.email}
                      </p>
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <div>
                    {company.address && (
                      <p className="text-muted-foreground flex items-center gap-2">
                        <FaLocationPin size={16} className="mr-1" />
                        {company.address}
                      </p>
                    )}
                    {company.followers && (
                      <p className="text-muted-foreground flex items-center gap-2 justify-between w-full">
                        FOLLOWERS:{" "}
                        <span className="text-primary font-semibold">
                          {company.followers?.length}
                        </span>
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
      <ConfirmDialog />
    </>
  );
};

export default CompanyList;
