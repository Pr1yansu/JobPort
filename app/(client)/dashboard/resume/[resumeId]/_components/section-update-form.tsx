import React from "react";
import { Doc } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { useAddSections } from "@/app/_components/_hooks/use-add-sections";
import AddResumeSectionModal from "@/app/_components/_modals/add-resume-section";

interface Props {
  sections: Doc<"sections">[] | undefined | null;
}

const SectionUpdateForm = ({ sections }: Props) => {
  const { open } = useAddSections();
  return (
    <div className="space-y-4 mt-4">
      <h2 className="text-lg font-semibold">Sections</h2>
      <div className="space-y-4">
        {sections?.map((section) => (
          <Button
            className="w-full"
            size={"xl"}
            key={section._id}
            onClick={() => {
              open(section);
            }}
          >
            {section.content.title}
          </Button>
        ))}
      </div>
      <Button
        variant={"dashed"}
        className="w-full"
        size={"xl"}
        onClick={() => open(null)}
      >
        Add new section
      </Button>
      <AddResumeSectionModal />
    </div>
  );
};

export default SectionUpdateForm;
