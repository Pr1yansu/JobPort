import { CldUploadWidget } from "next-cloudinary";

import React from "react";
import { Button } from "@/components/ui/button";

const UploadWidget = ({
  children,
  onUpload,
}: {
  children: React.ReactNode;
  onUpload: (url: string) => void;
}) => {
  return (
    <CldUploadWidget
      uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
      onSuccess={(response) => {
        if (!response.info) return;
        if (typeof response.info === "string") return;
        onUpload(response.info.secure_url);
      }}
    >
      {({ open }) => {
        return <div onClick={() => open()}>{children}</div>;
      }}
    </CldUploadWidget>
  );
};

export default UploadWidget;
