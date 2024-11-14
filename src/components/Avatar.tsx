import { cn } from "@/lib/utils";

interface AvatarProps {
  src: string;
  alt: string;
  online?: boolean;
  className?: string;
}

export const Avatar = ({ src, alt, online, className }: AvatarProps) => {
  return (
    <div className={cn("relative inline-block", className)}>
      <img
        src={src}
        alt={alt}
        className="w-10 h-10 rounded-full object-cover ring-2 ring-white"
      />
      {online && (
        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
      )}
    </div>
  );
};