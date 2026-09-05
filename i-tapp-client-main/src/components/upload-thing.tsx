import { ChangeEvent, useRef } from "react";

type UploadThingProps = {
  onSelect: (file: File | null) => void;
  accept?: string;
  onCancel?: () => void;
  children?: React.ReactNode;
  disabled?: boolean;
};

export default function UploadThing({
  onSelect,
  accept,
  onCancel,
  children,
  disabled = false,
}: UploadThingProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (disabled) return;
    inputRef.current?.click();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onSelect(e.target.files[0]);
      e.target.value = "";
    }
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleChange}
      />
      <div
        onClick={handleClick}
        className={disabled ? " pointer-events-none" : "cursor-pointer"}
        style={{ cursor: "pointer" }}
      >
        {children || <button type="button">Upload File</button>}
      </div>
    </>
  );
}
