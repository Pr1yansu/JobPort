"use client";
import React, { useEffect, useMemo } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAddSections } from "../_hooks/use-add-sections";
import { Send, X } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { z } from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";
import RenderFields from "@/app/(client)/dashboard/resume/[resumeId]/_components/render-fields";

const AddResumeSectionSchema = z.object({
  type: z.enum([
    "education",
    "experience",
    "skills",
    "projects",
    "certifications",
    "languages",
    "hobbies",
    "custom",
  ]),
  content: z.object({
    title: z.string().optional().default(""),
    items: z.array(z.any()).optional().default([]),
  }),
});

export type AddResumeSectionFormValues = z.infer<typeof AddResumeSectionSchema>;

const AddResumeSectionModal: React.FC = () => {
  const params = useParams();
  const { isOpen, close, section } = useAddSections();

  const addResumeSection = useMutation(api.resumeSections.addSection);
  const updateResumeSection = useMutation(api.resumeSections.updateSection);

  const sectionType = useMemo(() => {
    if (!section) return "custom";
    return section.type as AddResumeSectionFormValues["type"];
  }, [section, isOpen]);

  const form = useForm<AddResumeSectionFormValues>({
    resolver: zodResolver(AddResumeSectionSchema),
    defaultValues: {
      type: sectionType,
      content: {
        title: section?.content.title || "",
        items: section?.content.items || [],
      },
    },
  });

  useEffect(() => {
    form.reset({
      type: sectionType,
      content: {
        title: section?.content.title || "",
        items: section?.content.items || [],
      },
    });
  }, [section]);

  useEffect(() => {
    if (section && form.watch("type") !== sectionType) {
      form.setValue("content.title", "");
    }
  }, [form.watch("type")]);

  if (!params.resumeId) return null;

  const onSubmit: SubmitHandler<AddResumeSectionFormValues> = (values) => {
    if (section) {
      updateResumeSection({
        _id: section._id,
        type: values.type,
        content: {
          title: values.content.title || values.type.toUpperCase(),
          items: values.content.items,
        },
        isVisible: true,
        sectionStyles: {
          backgroundColor: "#ffffff",
          textColor: "#000000",
          fontWeight: "normal",
        },
      })
        .then(() => {
          close();
          form.reset();
        })
        .catch((error) => {
          toast.error("Failed to add section");
        });
    } else {
      addResumeSection({
        content: {
          title: values.content.title || values.type.toUpperCase(),
          items: values.content.items,
        },
        type: values.type,
        resumeId: params.resumeId as Id<"resumes">,
      })
        .then(() => {
          close();
          form.reset();
        })
        .catch((error) => {
          toast.error("Failed to add section");
        });
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed -top-5 inset-0 z-10 flex items-center justify-center bg-black/70"
      onMouseDown={close}
      onKeyDown={(e) => {
        if (e.key === "Escape") close;
      }}
    >
      <div
        className="max-w-lg w-full bg-background shadow-lg rounded-lg p-6 border relative"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <Button
          variant={"ghost"}
          size={"icon"}
          className="absolute top-0 right-0"
          onClick={close}
        >
          <X />
        </Button>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Add a new section!</DialogTitle>
              <Separator />
              <DialogDescription>
                You can add a new section to your resume.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <FormField
                control={form.control}
                key={form.watch("type")}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Section Type <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a section type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[
                          "education",
                          "experience",
                          "skills",
                          "projects",
                          "certifications",
                          "languages",
                          "hobbies",
                          "custom",
                        ].map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {form.watch("type") === "custom" && (
                <FormField
                  control={form.control}
                  name="content.title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Section Title <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter a title..." {...field} />
                      </FormControl>
                      <FormDescription>
                        This will be showing as a title of the section.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <RenderFields form={form} />
            </div>
            <DialogFooter className="!justify-between">
              <Button variant={"destructive"} type="button" onClick={close}>
                <X className="mr-2" />
                Close
              </Button>
              <Button type="submit">
                {section ? "Update Section" : "Add Section"}
                <Send className="ml-2" />
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AddResumeSectionModal;
