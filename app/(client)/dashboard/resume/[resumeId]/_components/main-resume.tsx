import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Globe2, Mail, Phone } from "lucide-react";
import React, { useMemo } from "react";
import { Doc } from "@/convex/_generated/dataModel";

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

  // ✅ Group sections by title
  const groupedSections = useMemo(() => {
    const map = new Map<string, Doc<"sections">[]>();
    sections?.forEach((section) => {
      const title = section.content.title.trim();
      if (!map.has(title)) map.set(title, []);
      map.get(title)?.push(section);
    });
    return Array.from(map.entries()).map(([title, grouped]) => ({
      title,
      items: grouped.flatMap((s) => s.content.items),
    }));
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
        padding: margin || 20,
        fontFamily: fontFamily || "Arial, sans-serif",
        lineHeight: lineHeight || "1.5",
        textTransform: (textTransform ||
          "none") as React.CSSProperties["textTransform"],
      }}
    >
      {/* Top Bar */}
      <div
        className="w-full h-2 absolute left-0 top-0"
        style={{ backgroundColor: primaryColor }}
      />

      {/* Header */}
      <h4
        className={cn(
          "text-2xl font-bold mt-2",
          isSingleColumn && "text-center"
        )}
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

      {/* Contact Info */}
      <div
        className={cn(
          "flex gap-x-10 gap-y-2 flex-wrap my-2",
          isSingleColumn && "justify-center"
        )}
      >
        {resume.basicDetails.address && (
          <div className="flex items-center gap-2">
            <Globe2 size={16} color={secondaryColor} />
            <p
              style={{
                color: secondaryColor,
                fontSize: `${fontSizes?.p || 12}px`,
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
              href={`mailto:${resume.basicDetails.contactEmail}`}
              className="underline"
              style={{
                color: primaryColor,
                fontSize: `${fontSizes?.a || 12}px`,
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
              style={{
                color: secondaryColor,
                fontSize: `${fontSizes?.p || 12}px`,
              }}
            >
              {resume.basicDetails.phone}
            </p>
          </div>
        )}
      </div>

      <Separator className="my-4" />

      {/* Sections */}
      <div
        className={cn(
          "grid gap-6",
          isSingleColumn ? "grid-cols-1 w-full" : "grid-cols-12"
        )}
      >
        {isSingleColumn ? (
          groupedSections.map((group, i) => (
            <MergedSectionBlock
              key={i}
              title={group.title}
              items={group.items}
              primaryColor={primaryColor || "#000"}
              secondaryColor={secondaryColor || "#555"}
              fontSize={fontSizes?.p || 12}
            />
          ))
        ) : (
          <>
            <div className="col-span-7 space-y-4">
              {groupedSections
                .filter((_, idx) => idx % 2 === 0)
                .map((group, i) => (
                  <MergedSectionBlock
                    key={i}
                    title={group.title}
                    items={group.items}
                    primaryColor={primaryColor || "#000"}
                    secondaryColor={secondaryColor || "#555"}
                    fontSize={fontSizes?.p || 12}
                  />
                ))}
            </div>
            <div className="col-span-5 space-y-4">
              {groupedSections
                .filter((_, idx) => idx % 2 === 1)
                .map((group, i) => (
                  <MergedSectionBlock
                    key={i}
                    title={group.title}
                    items={group.items}
                    primaryColor={primaryColor || "#000"}
                    secondaryColor={secondaryColor || "#555"}
                    fontSize={fontSizes?.p || 12}
                  />
                ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const MergedSectionBlock = ({
  title,
  items,
  primaryColor,
  secondaryColor,
  fontSize,
}: {
  title: string;
  items: Record<string, string>[];
  primaryColor: string;
  secondaryColor: string;
  fontSize: number;
}) => {
  return (
    <div>
      <h4 className="font-bold text-lg mb-1" style={{ color: primaryColor }}>
        {title}
      </h4>
      <div className="flex flex-col gap-4">
        {items.map((item, idx) => (
          <div key={idx} className="flex flex-col gap-1 ml-2">
            {Object.entries(item).map(([key, value]) => (
              <div key={key} className="flex gap-2 items-baseline flex-wrap">
                <span className="capitalize font-semibold text-sm">{key}:</span>
                <span
                  className="text-sm"
                  style={{ fontSize: `${fontSize}px`, color: secondaryColor }}
                >
                  {value}
                </span>
              </div>
            ))}
            {idx !== items.length - 1 && <Separator className="mt-2" />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainResume;
