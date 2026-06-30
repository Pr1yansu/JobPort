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
    <div className={`flex flex-col gap-3 ${imageUpload ? "p-3" : ""}`}>
      {imageUpload && (
        <div className="flex justify-start">
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
            <div className="flex items-center justify-center w-24 h-24 bg-zinc-50 border border-zinc-200 border-dashed rounded-xl cursor-pointer overflow-hidden hover:bg-zinc-100 transition-colors group">
              {imageUploadLoading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                  <Loader2 className="w-6 h-6 text-white animate-spin" />
                </div>
              ) : uploadValue ? (
                <img
                  src={uploadValue}
                  alt="Upload"
                  className="w-full h-full object-contain p-2"
                />
              ) : (
                <div className="text-zinc-400 group-hover:text-zinc-600 transition-colors flex flex-col items-center gap-2">
                  <Upload size={20} />
                  <span className="text-[10px] font-medium uppercase tracking-wider">Logo</span>
                </div>
              )}
            </div>
          </UploadWidget>
        </div>
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
        noOptionsMessage={() => "No options available"}
        className="text-sm"
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
        classNames={{
          control: (state) =>
            `!min-h-[44px] !bg-transparent !border-0 !shadow-none outline-none ${
              state.isFocused ? "!ring-0" : ""
            }`,
          valueContainer: () => "!px-3",
          placeholder: () => "!text-zinc-500",
          input: () => "!text-zinc-900",
          singleValue: () => "!text-zinc-900 !font-medium",
          multiValue: () => "!bg-zinc-100 !rounded-md !mr-2",
          multiValueLabel: () => "!text-zinc-800 !font-medium !text-sm",
          multiValueRemove: () => "!text-zinc-500 hover:!bg-zinc-200 hover:!text-zinc-800 !rounded-r-md transition-colors",
          menu: () => "!mt-1 !border !border-zinc-200 !shadow-lg !rounded-xl !overflow-hidden",
          menuList: () => "!p-1",
          option: (state) =>
            `!cursor-pointer !rounded-lg !px-3 !py-2 !text-sm transition-colors ${
              state.isFocused
                ? "!bg-zinc-100 !text-zinc-900"
                : state.isSelected
                ? "!bg-zinc-900 !text-white"
                : "!text-zinc-700"
            }`,
        }}
        styles={{
          control: (base) => ({
            ...base,
            border: "none",
            boxShadow: "none",
            "&:hover": { border: "none" },
          }),
          indicatorSeparator: () => ({ display: "none" }),
          dropdownIndicator: (base) => ({
            ...base,
            color: "#a1a1aa",
            "&:hover": { color: "#52525b" },
          }),
        }}
      />
    </div>
  );
}
