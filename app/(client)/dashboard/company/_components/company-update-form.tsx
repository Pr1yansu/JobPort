"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  GetCompanyByIdResponse,
  useUpdateCompany,
} from "@/features/companies/api/use-company";
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
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { companySchema } from "@/schema/job-schema";
import { z } from "zod";
import UploadWidget from "@/components/upload-widget";
import {
  Building,
  Mail,
  Phone,
  Globe,
  MapPin,
  FileText,
  Image,
  Upload,
  Edit2,
} from "lucide-react";
import { FcCancel } from "react-icons/fc";
import { motion, AnimatePresence } from "framer-motion";

type CompanyUpdateFormProps = {
  company: GetCompanyByIdResponse["company"];
};

export default function CompanyUpdateForm({ company }: CompanyUpdateFormProps) {
  const { mutate: updateCompany, isPending: isUpdating } = useUpdateCompany();
  const [editMode, setEditMode] = React.useState(false);
  const form = useForm<z.infer<typeof companySchema>>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      address: company?.address || undefined,
      name: company?.name || undefined,
      description: company?.description || undefined,
      email: company?.email || undefined,
      phone: company?.phone || undefined,
      logoUrl: company?.logoUrl || undefined,
      website: company?.website || undefined,
    },
  });

  function onSubmit(values: z.infer<typeof companySchema>) {
    if (!company) return;
    updateCompany(
      {
        param: {
          id: company.id,
        },
        json: values,
      },
      {
        onSuccess: () => {
          setEditMode(false);
          form.reset();
        },
      }
    );
  }

  function resetForm() {
    form.reset();
  }

  const fadeInOut = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 },
  };

  const slideUp = {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { duration: 0.5 },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-4xl mx-auto bg-gray-50">
        <CardHeader className="space-y-1 bg-white">
          <div className="flex justify-between items-center">
            <motion.div {...slideUp}>
              <h3 className="text-2xl font-bold capitalize">
                {company?.name || "Update Company"}
              </h3>
              <p className="text-sm text-muted-foreground">
                Provide the most accurate and up-to-date information for your
                company.
              </p>
            </motion.div>
            <div className="flex items-center gap-2">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  size="icon"
                  onClick={resetForm}
                  type="reset"
                >
                  <FcCancel className="w-6 h-6" />
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  size="icon"
                  type="button"
                  onClick={() => setEditMode(!editMode)}
                >
                  <Edit2 className="w-6 h-6" />
                </Button>
              </motion.div>
            </div>
          </div>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="grid gap-6 mt-4">
              <motion.div className="grid md:grid-cols-2 gap-4" {...slideUp}>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Building className="w-4 h-4" />
                        Company Name <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="bg-white"
                          disabled={!editMode || isUpdating}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value || undefined}
                          className="bg-white"
                          disabled={!editMode || isUpdating}
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
                      <FormLabel className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Phone <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value || undefined}
                          className="bg-white"
                          disabled={!editMode || isUpdating}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        Website{" "}
                        <span className="text-muted-foreground">
                          (add http:// or https://)
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value || undefined}
                          className="bg-white"
                          disabled={!editMode || isUpdating}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>
              <motion.div {...slideUp}>
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Address
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value || undefined}
                          className="bg-white"
                          disabled={!editMode || isUpdating}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>
              <motion.div {...slideUp}>
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Description
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          value={field.value || undefined}
                          className="bg-white min-h-[100px]"
                          disabled={!editMode || isUpdating}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>
              <motion.div {...slideUp}>
                <FormField
                  control={form.control}
                  name="logoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Image className="w-4 h-4" />
                        Company Logo
                      </FormLabel>
                      <FormControl>
                        <div className="flex flex-col items-start gap-4">
                          <AnimatePresence>
                            {field.value && (
                              <motion.div
                                className="flex items-center gap-4 w-full"
                                {...fadeInOut}
                              >
                                <img
                                  src={field.value}
                                  alt="Company Logo"
                                  className="w-20 h-20 object-cover rounded-md"
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => form.setValue("logoUrl", "")}
                                  disabled={!editMode || isUpdating}
                                >
                                  Remove Logo
                                </Button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                          <AnimatePresence>
                            {editMode && (
                              <motion.div className="w-full" {...fadeInOut}>
                                <UploadWidget
                                  onUpload={(url) =>
                                    form.setValue("logoUrl", url)
                                  }
                                  className="w-full"
                                >
                                  <div className="flex items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
                                    <span className="flex items-center space-x-2">
                                      <Upload className="w-6 h-6 text-gray-600" />
                                      <span className="font-medium text-muted-foreground">
                                        {field.value
                                          ? "Change logo"
                                          : "Drop files to Attach, or Browse"}
                                      </span>
                                    </span>
                                  </div>
                                </UploadWidget>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>
            </CardContent>
            <CardFooter className="bg-white mt-6 w-full">
              <Button
                type="submit"
                className="w-full"
                disabled={!editMode || isUpdating}
              >
                Update Company
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </motion.div>
  );
}
