import { User } from "iconsax-reactjs";

export default function AvatarCard({ icon }: { icon: React.ReactNode }) {
  return (
    <div className="w-24 h-24 rounded-2xl bg-linear-to-br from-primary to-primary border-4 border-white shadow-xl flex items-center justify-center">
      {icon || <User className="w-16 h-16 text-white" />}
    </div>
  );
}
