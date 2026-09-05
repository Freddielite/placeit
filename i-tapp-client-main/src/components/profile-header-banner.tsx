import AvatarCard from "./avatar-card";
import Image from "next/image";
import UploadThing from "./upload-thing";
import { useAction } from "next-safe-action/hooks";
import { useQueryClient } from "@tanstack/react-query";
import {
  updateCompanyBanner,
  updateCompanyLogo,
  updateStudentProfilePicture,
} from "@/actions";

type type = "student" | "company";

interface profileData {
  type: type;
  // logoImage?: string;
  bannerImage?: string;
  profileImage?: string;
}

interface ProfileHeaderBannerProps {
  profile: profileData;
  icon?: React.ReactNode;
}

export default function ProfileHeaderBanner({
  icon,
  profile,
}: ProfileHeaderBannerProps) {
  const { profileImage, bannerImage } = profile;

  const queryClient = useQueryClient();

  // upload profile picture action (company/student)
  const { execute } = useAction(updateStudentProfilePicture, {
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["student-profile"] });
    },
    onError: (error) => {
    },
  });

  const { execute: logo } = useAction(updateCompanyLogo, {
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["student-profile"] });
    },
    onError: (error) => {
    },
  });

  // upload banner image action (company only )
  const { execute: banner } = useAction(updateCompanyBanner, {
    onSuccess: (res) => {
    },
    onError: (error) => {
    },
  });

  return (
    <div className="relative">
      {/* Banner */}
      <UploadThing
        onSelect={(img) => {
          banner({ banner: img! });
        }}
        disabled={profile.type !== "company"}
      >
        {bannerImage ? (
          <Image
            src={bannerImage}
            alt="Banner"
            width={40}
            height={40}
            className="w-full h-40 object-cover"
          />
        ) : (
          <div className="w-full h-40 bg-linear-to-r from-primary to-primary" />
        )}
      </UploadThing>


      {/* Profile Picture */}
      <div className="absolute -bottom-10 left-8">
        <UploadThing
          onSelect={(img) => {
            execute({ profileImage: img! });
            profile.type === "company" && logo({ logo: img! });
          }}
        >
          {profileImage ? (
            <Image
              src={profileImage}
              alt="Profile"
              width={40}
              height={40}
              className="w-22 h-22 rounded-2xl object-cover border-4 border-white shadow-xl bg-white"
            />
          ) : (
            <AvatarCard icon={icon} />
          )}
        </UploadThing>
      </div>
    </div>
  );
}
