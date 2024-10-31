"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { loginSchema } from "@/schema/auth";
import Link from "next/link";
import { useLogin } from "@/features/auth/api/use-login";
import { useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { DEFAULT_ROUTE } from "@/routes";

export default function LoginForm() {
  const router = useRouter();
  const { mutate, isPending, data } = useLogin();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof loginSchema>) {
    mutate(values);
  }

  useEffect(() => {
    if (data) {
      if (data.success) {
        toast.success(data.message);
        router.push(DEFAULT_ROUTE);
      } else {
        toast.error(data.message);
      }
    }
  }, [data]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="dummymail@gmail.com"
                  {...field}
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="******" {...field} disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full"
          disabled={isPending}
          size={"lg"}
        >
          Login
        </Button>
        <div className="flex justify-end items-center w-full">
          <Link
            href={"/auth/forgot-password"}
            className="text-primary hover:underline p-2"
          >
            Forgot Password?
          </Link>
        </div>
      </form>
    </Form>
  );
}
