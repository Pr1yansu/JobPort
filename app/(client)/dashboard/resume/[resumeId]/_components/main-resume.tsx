import { Globe2, Mail, Phone } from "lucide-react";
import React from "react";

interface Props {
  resume: any;
}

const MainResume = ({ resume }: Props) => {
  return (
    <div
      className="w-full h-full bg-white rounded-md p-5 shadow-md relative overflow-hidden"
      id="main-resume"
    >
      <div className="block w-full h-2 bg-primary  absolute left-0 top-0" />
      <h4 className="text-2xl font-bold text-primary">
        {resume.basicDetails.fullName}
      </h4>
      <h5 className="text-base text-muted-foreground font-semibold">
        {resume.title}
      </h5>
      <div className="flex gap-x-10 gap-y-2 flex-wrap">
        {resume.basicDetails.address && (
          <div className="flex items-center gap-2">
            <Globe2 size={16} />
            <p className="text-muted-foreground text-sm">
              {resume.basicDetails.address}
            </p>
          </div>
        )}
        {resume.basicDetails.contactEmail && (
          <div className="flex items-center gap-2">
            <Mail size={16} />
            <a
              className="text-blue-500 text-sm"
              href={`mailto:${resume.basicDetails.contactEmail}`}
            >
              {resume.basicDetails.contactEmail}
            </a>
          </div>
        )}
        {resume.basicDetails.phone && (
          <div className="flex items-center gap-2">
            <Phone size={16} />
            <p className="text-muted-foreground text-sm">
              {resume.basicDetails.phone}
            </p>
          </div>
        )}
      </div>
      <div className="flex mt-4">
        <div className="w-2/3">Summary</div>
        <div className="w-1/3">Education</div>
      </div>
    </div>
  );
};

export default MainResume;
