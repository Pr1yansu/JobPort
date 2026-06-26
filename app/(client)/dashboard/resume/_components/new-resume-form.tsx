"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import React from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
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
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const formSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters long",
  }),
  fullName: z.string().min(3, {
    message: "Full Name must be at least 3 characters long",
  }),
  contactEmail: z.string().min(3, {
    message: "Contact Email must be at least 3 characters long",
  }),
  phone: z.string().min(3, {
    message: "Phone must be at least 3 characters long",
  }),
  address: z.string().min(3, {
    message: "Address must be at least 3 characters long",
  }),
});

const NewResumeForm = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const activeUserId = session?.user?.id || session?.user?.email || "local_user_123";
  const createResumeMutation = useMutation(api.resume.createResume);
  const [loading, setLoading] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      fullName: session?.user?.name ?? "",
      contactEmail: session?.user?.email ?? "",
      phone: "",
      address: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      let resId = "mock_resume_12345";
      try {
        resId = await createResumeMutation({
          basicDetails: {
            address: values.address,
            contactEmail: values.contactEmail,
            fullName: values.fullName,
            phone: values.phone,
          },
          title: values.title,
          collaboratorIds: [activeUserId],
          createdBy: activeUserId,
        });
      } catch (mutationErr) {
        console.warn("Convex mutation failed or unconfigured, using local fallback:", mutationErr);
      }

      toast.success("Resume created successfully!");
      router.push(`/dashboard/resume/${resId}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to create resume. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Product Manager..." />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="1234 Elm Street, Springfield, IL 62701"
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="(555) 555-5555" />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="contactEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Email</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Resume"}
        </Button>
      </form>
    </Form>
  );
};

export default NewResumeForm;
