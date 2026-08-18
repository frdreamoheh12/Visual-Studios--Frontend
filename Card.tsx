import clsx from "clsx";
import { HTMLAttributes } from "react";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx("vs-panel vs-panel-hover rounded-xl2 p-6", className)}
      {...props}
    />
  );
}
