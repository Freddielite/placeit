import { cn } from "@/utils/tailwind";
import { FileUpIcon } from "lucide-react";

type Props = {
  title?: string;
  value?: File; // or your object type
  onChange?: (val: File) => void;
  onBlur?: () => void;
  description?: string;
};

export const FileUploadThing = ({
  title,
  value,
  onChange,
  onBlur,
  description,
  // width = "350px",
}: Props) => {
  return (
    <>
      <label
        className={cn(
          "w-full border-2 border-dashed rounded-xl h-[140px] flex flex-col items-center justify-center px-4 py-3 cursor-pointer hover:border-primary/60 focus-within:ring-2 focus-within:ring-primary/30",
        )}
      >
        <input
          type="file"
          className="hidden"
          onBlur={onBlur}
          accept=".pdf,.jpg,.jpeg,.png,.webp"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;

            // Example: upload and get URL/key back
            // const uploaded = await upload(file);
            // onChange?.(uploaded.url);

            // Temporary: if you just want filename as placeholder
            onChange?.(file);
          }}
        />

        <div className="mb-2 flex items-center justify-center rounded-full border bg-white p-2.5">
          <FileUpIcon size={16} className="text-primary" />
        </div>

        <h1 className="text-sm font-semibold text-primary">
          {title || "Upload file"}
        </h1>

        <p className="mt-0.5 text-xs text-gray-500">
          {value ? `Selected: ${value.name}` : "Click to upload file"}
        </p>
      </label>
      <p className="text-xs text-muted-foreground flex-wrap ml-1">
        {description ||
          "Max file size: 10MB. Accepted formats: PDF, JPG, PNG, WEBP."}
      </p>
    </>
  );
};
