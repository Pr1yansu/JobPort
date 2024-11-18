import { AddResumeSectionFormValues } from "@/app/_components/_modals/add-resume-section";
import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/date-picker";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Delete, Minus, Plus } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import UploadWidget from "@/components/upload-widget";

const PrevNextButtons = ({
  step,
  gotoNextStep,
  gotoPrevStep,
}: {
  step: number;
  items: any[];
  gotoNextStep: () => void;
  gotoPrevStep: () => void;
}) => {
  return (
    <>
      <div className="flex justify-between items-center">
        <Button
          onClick={gotoPrevStep}
          disabled={step === 0}
          size={"icon-sm"}
          type="button"
        >
          <ArrowLeft />
        </Button>
        <span className="text-sm text-gray-500">Page : {step + 1}</span>
        <Button size={"icon-sm"} onClick={gotoNextStep} type="button">
          <ArrowRight />
        </Button>
      </div>
      <p className="text-sm text-gray-500">
        When you're done adding all the entries, click on the "Add Section"
      </p>
    </>
  );
};

const RenderFields = ({
  form,
}: {
  form: UseFormReturn<AddResumeSectionFormValues>;
}) => {
  const [step, setStep] = useState(0);
  const sectionType = form.watch("type");
  const items = form.watch("content.items") || [];
  const title = form.watch("content.title") || "";

  useEffect(() => {
    if (title.toLowerCase() === "skills") {
      const initializedSkills = items.map((item) => ({
        skillName: item.skillName || "",
        level: item.level || 1,
      }));
      form.setValue("content.items", initializedSkills);
    }

    if (title.toLowerCase() === "languages") {
      const initializedLanguages = items.map((item) => ({
        languageName: item.languageName || "",
        level: item.level || 1,
      }));
      form.setValue("content.items", initializedLanguages);
    }

    if (title.toLowerCase() === "hobbies") {
      const initializedHobbies = items.map((item) => ({
        title: item.title || "",
      }));
      form.setValue("content.items", initializedHobbies);
    }

    setStep(0);
  }, [sectionType, title, form]);

  const gotoNextStep = () => {
    setStep((prev) => Math.min(prev + 1, items.length));
  };
  const gotoPrevStep = () => {
    setStep((prev) => Math.max(prev - 1, 0));
  };

  switch (sectionType) {
    case "education":
      return (
        <>
          <FormField
            control={form.control}
            key={`content.items.${step}.institute`}
            name={`content.items.${step}.institute`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Institute Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter institute name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            key={`content.items.${step}.degree`}
            name={`content.items.${step}.degree`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Degree</FormLabel>
                <FormControl>
                  <Input placeholder="Enter degree" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            key={`content.items.${step}.fieldOfStudy`}
            name={`content.items.${step}.passoutYear`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Passout Year</FormLabel>
                <FormControl>
                  <DatePicker value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <PrevNextButtons
            step={step}
            items={items}
            gotoNextStep={gotoNextStep}
            gotoPrevStep={gotoPrevStep}
          />
        </>
      );
    case "experience":
      return (
        <>
          <FormField
            control={form.control}
            key={`content.items.${step}.company`}
            name={`content.items.${step}.company`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter company name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            key={`content.items.${step}.role`}
            name={`content.items.${step}.role`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <FormControl>
                  <Input placeholder="Enter role" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              key={`content.items.${step}.startDate`}
              name={`content.items.${step}.startDate`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
                  <FormControl>
                    <DatePicker
                      value={field.value || new Date()}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              key={`content.items.${step}.endDate`}
              name={`content.items.${step}.endDate`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Date</FormLabel>
                  <FormControl>
                    <DatePicker value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            key={`content.items.${step}.location`}
            name={`content.items.${step}.location`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="Enter location" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <PrevNextButtons
            step={step}
            items={items}
            gotoNextStep={gotoNextStep}
            gotoPrevStep={gotoPrevStep}
          />
        </>
      );
    case "skills":
      return (
        <>
          <div className="space-y-4">
            <Label>Skills</Label>
            {items.map((skill, index) => (
              <div
                key={index}
                className="flex items-center justify-between gap-4"
              >
                <FormField
                  control={form.control}
                  name={`content.items.${index}`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Skill Name"
                          value={field.value?.skillName || skill.skillName}
                          onChange={(e) => {
                            const updatedSkills = items.map((s, i) =>
                              i === index
                                ? { ...s, skillName: e.target.value }
                                : s
                            );
                            form.setValue("content.items", updatedSkills);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex items-center gap-2">
                  <Button
                    size="icon-sm"
                    variant="outline"
                    type="button"
                    onClick={() => {
                      const updatedSkills = items.map((s, i) =>
                        i === index && s.level > 1
                          ? { ...s, level: s.level - 1 }
                          : s
                      );
                      form.setValue("content.items", updatedSkills);
                    }}
                  >
                    <Minus size={16} />
                  </Button>
                  <span>Level {skill.level}</span>
                  <Button
                    size="icon-sm"
                    variant="outline"
                    type="button"
                    onClick={() => {
                      const updatedSkills = items.map((s, i) =>
                        i === index && s.level < 10
                          ? { ...s, level: s.level + 1 }
                          : s
                      );
                      form.setValue("content.items", updatedSkills);
                    }}
                  >
                    <Plus size={16} />
                  </Button>
                  <Button
                    size="icon-sm"
                    type="button"
                    variant="secondary-destructive"
                    onClick={() => {
                      const updatedSkills = items.filter((_, i) => i !== index);
                      form.setValue("content.items", updatedSkills);
                    }}
                  >
                    <Delete size={16} />
                  </Button>
                </div>
              </div>
            ))}
            <Button
              variant="dashed"
              size="sm"
              className="w-full"
              type="button"
              onClick={() => {
                const newSkill = { skillName: "", level: 1 };
                const updatedSkills = [...items, newSkill];
                form.setValue("content.items", updatedSkills);
              }}
            >
              Add more <Plus />
            </Button>
          </div>
        </>
      );
    case "projects":
      return (
        <>
          <FormField
            control={form.control}
            key={`content.items.${step}.title`}
            name={`content.items.${step}.title`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter project title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            key={`content.items.${step}.description`}
            name={`content.items.${step}.description`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter project description"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              key={`content.items.${step}.startDate`}
              name={`content.items.${step}.startDate`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
                  <FormControl>
                    <DatePicker
                      value={field.value || new Date()}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              key={`content.items.${step}.endDate`}
              name={`content.items.${step}.endDate`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Date</FormLabel>
                  <FormControl>
                    <DatePicker value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <PrevNextButtons
            step={step}
            items={items}
            gotoNextStep={gotoNextStep}
            gotoPrevStep={gotoPrevStep}
          />
        </>
      );
    case "certifications":
      return (
        <>
          <FormField
            control={form.control}
            key={`content.items.${step}.title`}
            name={`content.items.${step}.title`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Certification Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter certification title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            key={`content.items.${step}.description`}
            name={`content.items.${step}.description`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Certification Description</FormLabel>
                <FormControl>
                  <Input placeholder="Enter certification url" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              key={`content.items.${step}.startDate`}
              name={`content.items.${step}.startDate`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
                  <FormControl>
                    <DatePicker
                      value={field.value || new Date()}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              key={`content.items.${step}.endDate`}
              name={`content.items.${step}.endDate`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Date</FormLabel>
                  <FormControl>
                    <DatePicker value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            key={`content.items.${step}.url`}
            name={`content.items.${step}.url`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image</FormLabel>
                <FormControl>
                  <UploadWidget
                    onUpload={(url) => {
                      form.setValue(`content.items.${step}.url`, url);
                    }}
                  >
                    <Button
                      variant="dashed"
                      size="xl"
                      className="w-full z-[99999999]"
                      type="button"
                    >
                      Upload Image
                    </Button>
                  </UploadWidget>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <PrevNextButtons
            step={step}
            items={items}
            gotoNextStep={gotoNextStep}
            gotoPrevStep={gotoPrevStep}
          />
        </>
      );
    case "languages":
      return (
        <>
          <div className="space-y-4">
            <Label>Languages</Label>
            {items.map((language, index) => (
              <div
                key={index}
                className="flex items-center justify-between gap-4"
              >
                <FormField
                  control={form.control}
                  name={`content.items.${index}`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Language Name"
                          value={
                            field.value?.languageName || language.languageName
                          }
                          onChange={(e) => {
                            const updatedLanguages = items.map((s, i) =>
                              i === index
                                ? { ...s, languageName: e.target.value }
                                : s
                            );
                            form.setValue("content.items", updatedLanguages);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex items-center gap-2">
                  <Button
                    size="icon-sm"
                    variant="outline"
                    type="button"
                    onClick={() => {
                      const updatedLanguages = items.map((s, i) =>
                        i === index && s.level > 1
                          ? { ...s, level: s.level - 1 }
                          : s
                      );
                      form.setValue("content.items", updatedLanguages);
                    }}
                  >
                    <Minus size={16} />
                  </Button>
                  <span>Level {language.level}</span>
                  <Button
                    size="icon-sm"
                    variant="outline"
                    type="button"
                    onClick={() => {
                      const updatedLanguages = items.map((s, i) =>
                        i === index && s.level < 10
                          ? { ...s, level: s.level + 1 }
                          : s
                      );
                      form.setValue("content.items", updatedLanguages);
                    }}
                  >
                    <Plus size={16} />
                  </Button>
                  <Button
                    size="icon-sm"
                    type="button"
                    variant="secondary-destructive"
                    onClick={() => {
                      const updatedLanguages = items.filter(
                        (_, i) => i !== index
                      );
                      form.setValue("content.items", updatedLanguages);
                    }}
                  >
                    <Delete size={16} />
                  </Button>
                </div>
              </div>
            ))}
            <Button
              variant="dashed"
              size="sm"
              className="w-full"
              type="button"
              onClick={() => {
                const newLanguage = { languageName: "", level: 1 };
                const updatedLanguages = [...items, newLanguage];
                form.setValue("content.items", updatedLanguages);
              }}
            >
              Add more <Plus />
            </Button>
          </div>
        </>
      );
    case "hobbies":
      return (
        <>
          <div className="space-y-4">
            <Label>Hobbies</Label>
            {items.map((hobby, index) => (
              <div
                key={index}
                className="flex items-center justify-between gap-4"
              >
                <FormField
                  control={form.control}
                  name={`content.items.${index}`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Hobby"
                          value={field.value?.title || hobby.title}
                          onChange={(e) => {
                            const updatedHobbies = items.map((s, i) =>
                              i === index ? { ...s, title: e.target.value } : s
                            );
                            form.setValue("content.items", updatedHobbies);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  size="icon-sm"
                  type="button"
                  variant="secondary-destructive"
                  onClick={() => {
                    const updatedHobbies = items.filter((_, i) => i !== index);
                    form.setValue("content.items", updatedHobbies);
                  }}
                >
                  <Delete size={16} />
                </Button>
              </div>
            ))}
            <Button
              variant="dashed"
              size="sm"
              className="w-full"
              type="button"
              onClick={() => {
                const newHobby = { title: "" };
                const updatedHobbies = [...items, newHobby];
                form.setValue("content.items", updatedHobbies);
              }}
            >
              Add more <Plus />
            </Button>
          </div>
          <PrevNextButtons
            step={step}
            items={items}
            gotoNextStep={gotoNextStep}
            gotoPrevStep={gotoPrevStep}
          />
        </>
      );
    case "custom":
      return (
        <>
          {/* add all type of fields */}
          <FormField
            control={form.control}
            key={`content.items.${step}.title`}
            name={`content.items.${step}.title`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Field Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter field title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            key={`content.items.${step}.description`}
            name={`content.items.${step}.description`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Field Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter field description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            key={`content.items.${step}.url`}
            name={`content.items.${step}.url`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image</FormLabel>
                <FormControl>
                  <UploadWidget
                    onUpload={(url) => {
                      form.setValue(`content.items.${step}.url`, url);
                    }}
                  >
                    <Button
                      variant="dashed"
                      size="xl"
                      className="w-full z-[99999999]"
                      type="button"
                    >
                      Upload Image
                    </Button>
                  </UploadWidget>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            key={`content.items.${step}.startDate`}
            name={`content.items.${step}.startDate`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <DatePicker
                    value={field.value || new Date()}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            key={`content.items.${step}.endDate`}
            name={`content.items.${step}.endDate`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date</FormLabel>
                <FormControl>
                  <DatePicker value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <PrevNextButtons
            step={step}
            items={items}
            gotoNextStep={gotoNextStep}
            gotoPrevStep={gotoPrevStep}
          />
        </>
      );
    default:
      return null;
  }
};

export default RenderFields;
