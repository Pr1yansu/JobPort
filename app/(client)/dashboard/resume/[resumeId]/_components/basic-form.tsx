"use client";

import { z } from "zod";
import { useCallback } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { debounce } from "lodash";

const BasicFormSchema = z.object({
  title: z.string(),
  basicDetails: z.object({
    fullName: z.string(),
    contactEmail: z.string(),
    phone: z.string(),
    address: z.string(),
  }),
});

interface BasicFormProps {
  resume: any;
  currentWidth: number;
}

export const BasicForm = ({ resume, currentWidth }: BasicFormProps) => {
  const resumeUpdate = useMutation(api.resume.updateResume);

  const form = useForm<z.infer<typeof BasicFormSchema>>({
    resolver: zodResolver(BasicFormSchema),
    defaultValues: {
      title: resume?.title || "",
      basicDetails: {
        fullName: resume?.basicDetails?.fullName || "",
        contactEmail: resume?.basicDetails?.contactEmail || "",
        phone: resume?.basicDetails?.phone || "",
        address: resume?.basicDetails?.address || "",
      },
    },
  });

  const debouncedUpdate = useCallback(
    debounce(() => {
      resumeUpdate({
        _id: resume._id,
        title: form.getValues("title"),
        basicDetails: {
          fullName: form.getValues("basicDetails.fullName"),
          contactEmail: form.getValues("basicDetails.contactEmail"),
          phone: form.getValues("basicDetails.phone"),
          address: form.getValues("basicDetails.address"),
        },
      });
    }, 500),
    [resumeUpdate, resume._id, form]
  );

  const handleFieldChange = () => {
    debouncedUpdate();
  };

  return (
    <Form {...form}>
      <form className="space-y-4">
        <div
          className={cn(
            "",
            currentWidth > 1210 ? "grid space-x-2 grid-cols-2 " : "space-y-4"
          )}
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Resume Title"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      handleFieldChange();
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="basicDetails.fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Full Name"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      handleFieldChange();
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div
          className={cn(
            "",
            currentWidth > 1210 ? "grid space-x-2 grid-cols-2 " : "space-y-4"
          )}
        >
          <FormField
            control={form.control}
            name="basicDetails.contactEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Email"
                    type="email"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      handleFieldChange();
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="basicDetails.phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Phone"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      handleFieldChange();
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="basicDetails.address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input
                  placeholder="Address"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    handleFieldChange();
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
