import Image from "next/image";
import clsx from "clsx";

interface AvatarProps {
  src?: string;
  username: string;
  size?: number;
  className?: string;
}

export function Avatar({ src, username, size = 36, className }: AvatarProps) {
  const initials = username.slice(0, 2).toUpperCase();

  if (src) {
    return (
      <Image
        src={src}
        alt={username}
        width={size}
        height={size}
        className={clsx("rounded-full border border-white/10 object-cover", className)}
      />
    );
  }

  return (
    <div
      style={{ width: size, height: size }}
      className={clsx(
        "flex items-center justify-center rounded-full bg-vs-gradient text-xs font-semibold text-white",
        className
      )}
    >
      {initials}
    </div>
  );
}
