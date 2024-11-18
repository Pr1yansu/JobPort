"use client";
import { CldUploadWidget } from "next-cloudinary";
import React from "react";

const UploadWidget = ({
  children,
  onUpload,
  className,
}: {
  children: React.ReactNode;
  onUpload: (url: string) => void;
  className?: string;
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
        return (
          <div
            onClick={(e) => {
              e.stopPropagation();
              open();
            }}
            className={className}
          >
            {children}
          </div>
        );
      }}
    </CldUploadWidget>
  );
};

export default UploadWidget;
