"use client";

import { Upload, Loader2 } from "lucide-react";
import React, { useState } from "react";
import Select from "react-select/creatable";
import { SingleValue, MultiValue, ActionMeta } from "react-select";
import { toast } from "sonner";
import UploadWidget from "./upload-widget";

type OptionType = { label: string; value: string; image?: string | null };

type CustomSelectProps = {
  onChange: (value?: string) => void;
  onCreate?: (value: string) => void;
  options?: OptionType[];
  value?: string[] | string | null | undefined;
  disabled?: boolean;
  placeholder?: string;
  imageUpload?: boolean;
  onUpload?: (logoUrl: string) => void;
  uploadValue?: string | null;
  setLogoUrl?: (logoUrl: string) => void;
  multiple?: boolean;
};

export default function CustomSelect({
  onChange,
  onCreate,
  options = [],
  value,
  disabled,
  placeholder,
  imageUpload = false,
  onUpload,
  uploadValue,
  setLogoUrl,
  multiple = false,
}: CustomSelectProps) {
  const [imageUploadLoading, setImageUploadLoading] = useState(false);

  return (
    <>
      {imageUpload && (
        <UploadWidget
          onUpload={(url) => {
            try {
              setImageUploadLoading(true);
              onUpload?.(url);
              toast.success("Image uploaded successfully");
            } catch (error) {
              toast.error("Failed to upload image");
            } finally {
              setImageUploadLoading(false);
            }
          }}
        >
          <div className="flex items-center justify-center w-32 h-32 bg-gray-100 border border-gray-200 rounded-md cursor-pointer overflow-hidden">
            {imageUploadLoading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </div>
            ) : uploadValue ? (
              <img
                src={uploadValue}
                alt="Upload"
                className="w-full h-full object-contain rounded-md"
              />
            ) : (
              <div className="text-gray-500">
                <Upload size={24} />
              </div>
            )}
          </div>
        </UploadWidget>
      )}
      <Select
        onChange={(
          selectedOption: SingleValue<OptionType> | MultiValue<OptionType>,
          actionMeta: ActionMeta<OptionType>
        ) => {
          if (multiple && Array.isArray(selectedOption)) {
            const selectedValues = selectedOption.map((opt) => opt.value);
            const selectedImages = selectedOption.map((opt) => opt.image || "");
            setLogoUrl?.(selectedImages[0] || "");
            onChange(selectedValues.join(", "));
          } else if (selectedOption) {
            if ("image" in selectedOption) {
              setLogoUrl?.(selectedOption.image || "");
            }
            if ("value" in selectedOption) {
              onChange(selectedOption.value);
            }
          } else {
            onChange();
          }
        }}
        className="text-nowrap"
        onCreateOption={onCreate}
        options={options}
        value={
          multiple
            ? options.filter((option) => value?.includes(option.value))
            : options.find((option) => option.value === value)
        }
        isDisabled={disabled || imageUploadLoading}
        placeholder={placeholder}
        isMulti={multiple}
        styles={{
          control: (base) => ({
            ...base,
            borderColor: "#e2e8f0",
            ":hover": {
              borderColor: "#e2e8f0",
            },
          }),
          indicatorSeparator: () => ({
            display: "none",
          }),
        }}
      />
    </>
  );
}
