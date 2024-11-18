import { Separator } from "@/components/ui/separator";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { useQuery } from "convex/react";
import { Globe2, Mail, Phone } from "lucide-react";
import React, { useMemo } from "react";

interface Props {
  resume: Doc<"resumes">;
  sections: Doc<"sections">[] | undefined | null;
}

const MainResume = ({ resume, sections }: Props) => {
  const {
    primaryColor,
    secondaryColor,
    fontFamily,
    fontSizes,
    margin,
    lineHeight,
    textTransform,
  } = resume.theme;
  const { layout } = resume.metadata;

  const isSingleColumn = layout === "single-column";

  const firstColumnSections = useMemo(() => {
    return sections?.slice(0, Math.ceil((sections?.length || 0) / 2));
  }, [sections]);

  const secondColumnSections = useMemo(() => {
    return sections?.slice(Math.ceil((sections?.length || 0) / 2));
  }, [sections]);

  return (
    <div
      className={cn(
        "w-full h-full bg-white rounded-md shadow-md relative overflow-hidden",
        isSingleColumn
          ? "flex flex-col items-center text-center"
          : "flex flex-col"
      )}
      id="main-resume"
      style={{
        padding: margin || "1.25rem",
        fontFamily: fontFamily || "Arial, sans-serif",
        lineHeight: lineHeight || "1.5",
        textTransform: textTransform || ("none" as any),
      }}
    >
      <div
        className="w-full h-2 absolute left-0 top-0"
        style={{ backgroundColor: primaryColor }}
      />

      <h4
        className={cn("text-2xl font-bold", isSingleColumn && "text-center")}
        style={{
          color: primaryColor,
          fontSize: fontSizes?.h1 ? `${fontSizes.h1}px` : "2rem",
        }}
      >
        {resume.basicDetails.fullName}
      </h4>
      <h5
        className={cn(
          "text-base font-semibold",
          isSingleColumn && "text-center"
        )}
        style={{
          color: secondaryColor,
          fontSize: fontSizes?.h5 ? `${fontSizes.h5}px` : "1.25rem",
        }}
      >
        {resume.title}
      </h5>

      <div
        className={cn(
          "flex gap-x-10 gap-y-2 flex-wrap",
          isSingleColumn && "justify-center"
        )}
      >
        {resume.basicDetails.address && (
          <div className="flex items-center gap-2">
            <Globe2 size={16} color={secondaryColor} />
            <p
              className="text-sm"
              style={{
                color: secondaryColor,
                fontSize: fontSizes?.p ? `${fontSizes.p}px` : "0.875rem",
              }}
            >
              {resume.basicDetails.address}
            </p>
          </div>
        )}
        {resume.basicDetails.contactEmail && (
          <div className="flex items-center gap-2">
            <Mail size={16} color={secondaryColor} />
            <a
              className="text-sm"
              href={`mailto:${resume.basicDetails.contactEmail}`}
              style={{
                color: primaryColor,
                fontSize: fontSizes?.a ? `${fontSizes.a}px` : "0.875rem",
              }}
            >
              {resume.basicDetails.contactEmail}
            </a>
          </div>
        )}
        {resume.basicDetails.phone && (
          <div className="flex items-center gap-2">
            <Phone size={16} color={secondaryColor} />
            <p
              className="text-sm"
              style={{
                color: secondaryColor,
                fontSize: fontSizes?.p ? `${fontSizes.p}px` : "0.875rem",
              }}
            >
              {resume.basicDetails.phone}
            </p>
          </div>
        )}
      </div>

      <Separator className="my-4" />

      {/* Main Sections */}
      <div
        className={cn(
          "grid gap-4",
          isSingleColumn ? "grid-cols-1" : "grid-cols-12"
        )}
      >
        {isSingleColumn ? (
          sections?.map((section) => (
            <div
              key={section._id}
              className="col-span-1"
              style={{
                fontSize: fontSizes?.p ? `${fontSizes.p}px` : "0.875rem",
                color: secondaryColor,
              }}
            >
              {section.content.title}
            </div>
          ))
        ) : (
          <>
            <div className="col-span-7 space-y-2">
              {firstColumnSections?.map((section) => (
                <div
                  key={section._id}
                  style={{
                    fontSize: fontSizes?.p ? `${fontSizes.p}px` : "0.875rem",
                    color: secondaryColor,
                  }}
                >
                  <h4>{section.content.title}</h4>
                  <div className="flex gap-2 flex-wrap flex-col">
                    {section.content.items.map((item, key) => (
                      <div key={key} className="flex gap-1 flex-wrap flex-col">
                        {Object.keys(item).map((key) => (
                          <div key={key} className="flex gap-2 items-center">
                            <h5 className="font-semibold capitalize">
                              {key}:{" "}
                            </h5>
                            <p>{item[key]}</p>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="col-span-5 space-y-2">
              {secondColumnSections?.map((section) => (
                <div
                  key={section._id}
                  style={{
                    fontSize: fontSizes?.p ? `${fontSizes.p}px` : "0.875rem",
                    color: secondaryColor,
                  }}
                >
                  {section.content.title}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MainResume;
