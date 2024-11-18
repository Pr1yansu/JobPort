import React, { useState, useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DashboardIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Doc } from "@/convex/_generated/dataModel";
import { Label } from "@/components/ui/label";
import { ColorPicker } from "@/components/ui/color-picker";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { debounce } from "lodash";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSaving } from "@/hooks/use-saving";

interface TemplateThemeChangerProps {
  resume: Doc<"resumes">;
}

interface Theme {
  templateName: string;
  fontFamily: string;
  fontSizes: Record<string, number>;
  margin: string;
  primaryColor: string;
  secondaryColor: string;
  lineHeight?: string;
  textTransform?: string;
}

const TemplateThemeChanger: React.FC<TemplateThemeChangerProps> = ({
  resume,
}) => {
  const { setSaving } = useSaving();
  const resumeUpdate = useMutation(api.resume.updateResume);

  const initialTheme = resume.theme;
  const initialMetadata = resume.metadata;
  const [theme, setTheme] = useState<Theme>({
    templateName: initialTheme.templateName,
    fontFamily: initialTheme.fontFamily || "Arial",
    fontSizes: initialTheme.fontSizes || {
      h1: 24,
      h2: 20,
      h3: 18,
      h4: 16,
      h5: 14,
      h6: 12,
      p: 16,
      a: 16,
      li: 16,
    },
    margin: initialTheme.margin?.toString() || "10",
    primaryColor: initialTheme.primaryColor || "#000000",
    secondaryColor: initialTheme.secondaryColor || "#888888",
    lineHeight: initialTheme.lineHeight?.toString() || "1.5",
    textTransform: initialTheme.textTransform || "none",
  });
  const [metadata, setMetadata] = useState(initialMetadata);

  const debouncedUpdate = debounce((updatedTheme: Theme) => {
    setSaving(true);
    resumeUpdate({
      _id: resume._id,
      theme: {
        fontFamily: updatedTheme.fontFamily,
        fontSizes: updatedTheme.fontSizes,
        margin: parseInt(updatedTheme.margin),
        primaryColor: updatedTheme.primaryColor,
        secondaryColor: updatedTheme.secondaryColor,
        templateName: updatedTheme.templateName,
        lineHeight: updatedTheme.lineHeight
          ? parseFloat(updatedTheme.lineHeight)
          : undefined,
        textTransform: updatedTheme.textTransform,
      },
      metadata: { layout: metadata?.layout },
    }).finally(() => setSaving(false));
  }, 500);

  useEffect(() => {
    debouncedUpdate(theme);
  }, [theme, metadata]);

  const templatePresets: Record<string, Theme> = {
    default: {
      templateName: "default",
      fontFamily: "Arial",
      fontSizes: {
        h1: 24,
        h2: 20,
        h3: 18,
        h4: 16,
        h5: 14,
        h6: 12,
        p: 12,
        a: 12,
        li: 12,
      },
      margin: "10",
      primaryColor: "#000000",
      secondaryColor: "#888888",
      lineHeight: "1.5",
      textTransform: "none",
    },
    modern: {
      templateName: "modern",
      fontFamily: "Helvetica",
      fontSizes: {
        h1: 24,
        h2: 20,
        h3: 18,
        h4: 16,
        h5: 14,
        h6: 12,
        p: 12,
        a: 12,
        li: 12,
      },
      margin: "10",
      primaryColor: "#1a73e8",
      secondaryColor: "#34a853",
      lineHeight: "1.5",
      textTransform: "uppercase",
    },
    classic: {
      templateName: "classic",
      fontFamily: "Poppins",
      fontSizes: {
        h1: 24,
        h2: 20,
        h3: 18,
        h4: 16,
        h5: 14,
        h6: 12,
        p: 12,
        a: 12,
        li: 12,
      },
      margin: "10",
      primaryColor: "#333333",
      secondaryColor: "#555555",
      lineHeight: "1.5",
      textTransform: "none",
    },
  };

  const handleTemplateChange = (templateName: string) => {
    const preset = templatePresets[templateName];
    setTheme((prev) => ({
      ...prev,
      ...preset,
    }));
  };

  const handleFontSizeChange = (key: string, value: string) => {
    setTheme((prev) => ({
      ...prev,
      fontSizes: { ...prev.fontSizes, [key]: parseInt(value) },
    }));
  };

  const handleSelectChange = (key: keyof Theme, value: string) => {
    setTheme((prev) => ({ ...prev, [key]: value }));
  };

  interface CustomSelectProps {
    label: string;
    value: string | undefined;
    options: string[];
    placeholder: string;
    onChange: (value: string) => void;
  }

  const CustomSelect: React.FC<CustomSelectProps> = ({
    label,
    value,
    options,
    placeholder,
    onChange,
  }) => (
    <div className="space-y-1">
      <Label>{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="sm" variant="ghost">
          <DashboardIcon fontSize={24} />
          Select Template
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="max-w-screen-sm md:w-[520px] overflow-y-scroll p-0"
        align="start"
      >
        <div className="md:max-h-[600px] max-h-96 w-full ">
          <div className="w-full md:flex gap-2 p-4">
            <div className="w-full md:w-1/2 space-y-2">
              <CustomSelect
                label="Presets"
                value={theme.templateName}
                options={Object.keys(templatePresets)}
                placeholder="Theme"
                onChange={handleTemplateChange}
              />
              <div className="flex items-center justify-between gap-2 my-1 text-muted-foreground">
                <hr className="w-full" />
                or <hr className="w-full" />
              </div>
              <h5 className="text-xs text-center text-muted-foreground">
                Custom
              </h5>
              <CustomSelect
                label="Font Family"
                value={theme.fontFamily}
                options={[
                  "Arial",
                  "Times New Roman",
                  "Helvetica",
                  "Poppins",
                  "Roboto",
                  "Montserrat",
                  "Lato",
                  "Open Sans",
                  "Nunito",
                ]}
                placeholder="Choose a font"
                onChange={(value) => handleSelectChange("fontFamily", value)}
              />

              <CustomSelect
                label="Margin"
                value={theme.margin}
                options={["0", "5", "10", "15", "20", "25", "30"]}
                placeholder="Choose a margin"
                onChange={(value) => handleSelectChange("margin", value)}
              />
              <div className="space-y-2">
                <Label>Primary Color</Label>
                <ColorPicker
                  value={theme.primaryColor}
                  onChange={(color) =>
                    handleSelectChange("primaryColor", color)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Secondary Color</Label>
                <ColorPicker
                  value={theme.secondaryColor}
                  onChange={(color) =>
                    handleSelectChange("secondaryColor", color)
                  }
                />
              </div>
              <CustomSelect
                label="Layout"
                value={metadata?.layout || "single-column"}
                options={["single-column", "two-column"]}
                placeholder="Choose a layout"
                onChange={(value) =>
                  setMetadata({ ...metadata, layout: value })
                }
              />

              <CustomSelect
                label="Text Transform"
                value={theme.textTransform}
                options={["none", "uppercase", "capitalize", "lowercase"]}
                placeholder="Choose a text transform"
                onChange={(value) => handleSelectChange("textTransform", value)}
              />
              <CustomSelect
                label="Line Height"
                value={theme.lineHeight}
                options={["1.25", "1.5", "1.75", "2"]}
                placeholder="Choose a line height"
                onChange={(value) => handleSelectChange("lineHeight", value)}
              />
            </div>
            <div className="w-full md:w-1/2 space-y-4">
              {["h1", "h2", "h3", "h4", "h5", "h6"].map((key) => (
                <CustomSelect
                  key={key}
                  label={`Font Size (${key.toUpperCase()})`}
                  value={theme.fontSizes[key].toString()}
                  options={["14", "16", "18", "20", "22", "24", "26"]}
                  placeholder="Choose a font size"
                  onChange={(value) => handleFontSizeChange(key, value)}
                />
              ))}
              {["p", "a", "li"].map((key) => (
                <CustomSelect
                  key={key}
                  label={`Font Size (${key.toUpperCase()})`}
                  value={theme.fontSizes[key].toString()}
                  options={["12", "14", "16", "18", "20", "22", "24"]}
                  placeholder="Choose a font size"
                  onChange={(value) => handleFontSizeChange(key, value)}
                />
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default TemplateThemeChanger;
