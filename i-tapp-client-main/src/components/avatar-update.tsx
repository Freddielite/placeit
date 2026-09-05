"use client";
import { updateStudentProfilePicture } from "@/actions";
import { Upload } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import Image from "next/image";
import { useState } from "react";

export default function AvatarUpdate() {
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<File | null>>,
  ) => {
    if (e.target.files?.[0]) setter(e.target.files[0]);
    execute({ profileImage: e.target.files?.[0]! });
  };

  // upload profile picture action (company/student)
  const { execute } = useAction(updateStudentProfilePicture, {
    onSuccess: (res) => {
    },
    onError: (error) => {
    },
  });

  // upload banner image action (company only )
  const { execute: banner } = useAction(updateStudentProfilePicture, {
    onSuccess: (res) => {
    },
    onError: (error) => {
    },
  });

  return (
    <div className="flex items-center">
      <label className="cursor-pointer">
        <div className="w-20 h-[70px] border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
          {profileImage ? (
            <Image
              src={URL.createObjectURL(profileImage)}
              alt="Profile"
              width={80}
              height={70}
              className="object-cover rounded-full"
            />
          ) : (
            <div className="flex flex-col items-center">
              <Upload size={16} />
              <span className="text-xs">Photo</span>
            </div>
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleFileChange(e, setProfileImage)}
          className="hidden"
        />
      </label>
    </div>
  );
}
