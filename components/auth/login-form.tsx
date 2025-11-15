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
import { useRouter } from "next/navigation";
import { DEFAULT_ROUTE } from "@/routes";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";

export default function LoginForm() {
  const router = useRouter();
  const { mutate, isPending } = useLogin();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof loginSchema>) {
    mutate(values, {
      onSuccess: () => {
        router.push(DEFAULT_ROUTE);
      },
    });
  }

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

        <div className="mt-2">
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="outline" className="w-full" type="button">
                Use Demo Accounts
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Demo Accounts</DrawerTitle>
                <DrawerDescription>
                  Click a role to autofill email and password.
                </DrawerDescription>
              </DrawerHeader>
              <div className="grid gap-2 p-4">
                <Button
                  type="button"
                  onClick={() => {
                    form.setValue("email", "admin@demo.com");
                    form.setValue("password", "demo1234");
                  }}
                >
                  Admin — admin@demo.com
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    form.setValue("email", "recruiter@demo.com");
                    form.setValue("password", "demo1234");
                  }}
                >
                  Recruiter — recruiter@demo.com
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    form.setValue("email", "user@demo.com");
                    form.setValue("password", "demo1234");
                  }}
                >
                  User — user@demo.com
                </Button>
              </div>
              <DrawerFooter>
                <DrawerClose asChild>
                  <Button variant="secondary" type="button">
                    Close
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
      </form>
    </Form>
  );
}
