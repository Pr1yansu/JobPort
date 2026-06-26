import { Metadata } from "next";
import React from "react";
import { auth } from "@/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { User, Mail, Star, ShieldCheck, Key, Calendar, ArrowUpRight, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Profile | JobPort",
};

const Profile = async () => {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <p className="text-muted-foreground">Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-6 max-w-5xl mx-auto">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Account Profile</h1>
        <p className="text-zinc-500 mt-1">Manage your personal information, security credentials, and subscription status.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Avatar & Tier Info */}
        <div className="space-y-6 md:col-span-1">
          <Card className="border-zinc-200 shadow-sm bg-white/80 backdrop-blur-lg overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-zinc-800 to-zinc-900 relative">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
            </div>
            <CardContent className="pt-0 relative flex flex-col items-center text-center">
              <Avatar className="size-24 border-4 border-white shadow-xl -mt-12 mb-4 bg-zinc-100">
                <AvatarImage src={user.image || "/placeholder.svg"} alt={user.name || "User"} />
                <AvatarFallback className="text-2xl font-bold bg-zinc-800 text-white">
                  {user.name ? user.name[0].toUpperCase() : user.email?.[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-bold text-zinc-900">{user.name || "User Account"}</h2>
              <p className="text-sm text-zinc-500 mb-4">{user.email}</p>

              <div className="flex flex-wrap gap-2 justify-center mb-6">
                <Badge variant="secondary" className="bg-zinc-100 text-zinc-800 border border-zinc-200 px-3 py-1 text-xs font-semibold uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className="size-3.5 text-zinc-600" /> {user.role}
                </Badge>
                {user.premium ? (
                  <Badge className="bg-amber-500/10 text-amber-600 border border-amber-500/30 px-3 py-1 text-xs font-semibold uppercase tracking-wider flex items-center gap-1">
                    <Star className="size-3.5 fill-amber-500 text-amber-500" /> Premium
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-zinc-500 border-zinc-300 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
                    Free Tier
                  </Badge>
                )}
              </div>

              {!user.premium && (
                <div className="w-full bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 rounded-xl p-4 text-left">
                  <div className="flex items-center gap-2 text-amber-700 font-bold text-sm mb-1">
                    <Sparkles className="size-4" /> Upgrade to Premium
                  </div>
                  <p className="text-xs text-zinc-600 mb-3">Unlock AI resume analysis and unlimited job swipe matching.</p>
                  <Link href="/">
                    <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs shadow-md transition-all duration-200">
                      Upgrade Now <ArrowUpRight className="ml-1 size-3.5" />
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: General Info Form */}
        <div className="space-y-6 md:col-span-2">
          <Card className="border-zinc-200 shadow-sm bg-white/80 backdrop-blur-lg">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-zinc-900">Personal Details</CardTitle>
              <CardDescription className="text-zinc-500">Update your account identity and contact information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700 flex items-center gap-2">
                  <User className="size-4 text-zinc-500" /> Full Name
                </label>
                <Input defaultValue={user.name || ""} placeholder="John Doe" className="border-zinc-300 focus-visible:ring-zinc-500" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700 flex items-center gap-2">
                  <Mail className="size-4 text-zinc-500" /> Email Address
                </label>
                <Input defaultValue={user.email || ""} disabled className="bg-zinc-50 border-zinc-200 text-zinc-500 cursor-not-allowed" />
                <p className="text-xs text-zinc-400">Your email address is managed through your authentication provider.</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700 flex items-center gap-2">
                  <Key className="size-4 text-zinc-500" /> Account Role & Permissions
                </label>
                <Input defaultValue={user.role || "USER"} disabled className="bg-zinc-50 border-zinc-200 text-zinc-500 cursor-not-allowed font-mono text-sm" />
              </div>

              <div className="pt-4 border-t border-zinc-100 flex justify-end">
                <Button className="bg-zinc-900 hover:bg-zinc-800 text-white font-semibold px-6 shadow-md transition-all duration-200">
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
