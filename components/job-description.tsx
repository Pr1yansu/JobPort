import {
  convertDescriptionToHTML,
  RichElement,
} from "@/utils/rich-element-converter";

function JobDescription({ description }: RichElement) {
  const descriptionHTML = convertDescriptionToHTML({ description });

  return (
    <div
      className="job-description"
      dangerouslySetInnerHTML={{ __html: descriptionHTML }}
    />
  );
}

export default JobDescription;
