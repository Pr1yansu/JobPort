"use client";
import {
  useFollowCompany,
  useGetCompanyById,
} from "@/features/companies/api/use-company";
import React, { useMemo } from "react";
import CompanyUpdateForm from "./company-update-form";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "next-auth/react";
import {
  CalendarIcon,
  GlobeIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/utils/date-money";
import { useRouter } from "next/navigation";

const CompanyDetail = ({ id }: { id: string }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const { data, isLoading } = useGetCompanyById(id);
  const { mutate: followCompany, isPending: isFollowing } = useFollowCompany();

  const company = useMemo(() => {
    if (!data) return null;
    return data.company;
  }, [data]);

  const isFollowingCompany = useMemo(() => {
    if (!session) return false;
    if (!company?.followers || !session.user.id) return false;
    return company?.followers.includes(session.user.id);
  }, [session, company]);

  const isRecruiterOrAdmin = useMemo(() => {
    if (!session) return false;
    return session.user.role === "RECRUITER" || session.user.role === "ADMIN";
  }, [session]);

  if (!session) router.push("/auth/register");

  if (isLoading || !company) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-8 w-60" />
              <Skeleton className="h-4 w-80" />
            </div>
            <div className="flex items-center space-x-4 mt-4">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <>
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div className="w-full space-y-2" key={index}>
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-8 w-full" />
                </div>
              ))}
            </div>
            <div className="w-full space-y-2 mt-4">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-24 w-full" />
            </div>
            <div className="w-full space-y-2 mt-4">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-40 w-full" />
            </div>
          </>
        </CardContent>
        <CardFooter>
          <Skeleton className="h-10 w-full" />
        </CardFooter>
      </Card>
    );
  }

  if (!isRecruiterOrAdmin) {
    const handleFollow = () => {
      followCompany({
        param: {
          id: company.id,
        },
      });
    };
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{company.name}</CardTitle>
              <p className="text-sm text-muted-foreground">
                Created on {formatDate(company.createdAt)}
              </p>
            </div>
            {!isRecruiterOrAdmin && (
              <Button
                onClick={handleFollow}
                disabled={isFollowing}
                variant={isFollowingCompany ? "outline" : "default"}
              >
                {isFollowingCompany
                  ? isFollowing
                    ? "Unfollowing..."
                    : "Unfollow"
                  : isFollowing
                    ? "Following..."
                    : "Follow"}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Badge
                variant={
                  company.approved === "PENDING" ? "secondary" : "success"
                }
              >
                {company.approved}
              </Badge>
            </div>
            {company.description && (
              <p className="text-sm text-muted-foreground">
                {company.description}
              </p>
            )}
            {company.website && (
              <div className="flex items-center space-x-2">
                <GlobeIcon className="h-5 w-5 text-muted-foreground" />
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:underline"
                >
                  {company.website}
                </a>
              </div>
            )}
            {company.email && (
              <div className="flex items-center space-x-2">
                <MailIcon className="h-5 w-5 text-muted-foreground" />
                <a
                  href={`mailto:${company.email}`}
                  className="text-sm hover:underline"
                >
                  {company.email}
                </a>
              </div>
            )}
            {company.phone && (
              <div className="flex items-center space-x-2">
                <PhoneIcon className="h-5 w-5 text-muted-foreground" />
                <a
                  href={`tel:${company.phone}`}
                  className="text-sm hover:underline"
                >
                  {company.phone}
                </a>
              </div>
            )}
            {company.address && (
              <div className="flex items-center space-x-2">
                <MapPinIcon className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm">{company.address}</span>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <CalendarIcon className="h-4 w-4" />
            <span>Last updated: {formatDate(company.updatedAt)}</span>
          </div>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div>
      <CompanyUpdateForm company={company} />
    </div>
  );
};

export default CompanyDetail;
