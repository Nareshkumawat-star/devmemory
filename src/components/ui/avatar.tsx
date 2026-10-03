import * as React from "react";
import { clsx } from "~/utils";

const Avatar = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={clsx("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className)}
      {...props}
    />
  ),
);
Avatar.displayName = "Avatar";

const AvatarImage = React.forwardRef<HTMLImageElement, React.ImgHTMLAttributes<HTMLImageElement>>(
  ({ className, alt = "", ...props }, ref) => (
    // Deliberately a plain <img>: this is a generic avatar primitive that accepts
    // any URL, so next/image would require remotePatterns for every host.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={ref}
      className={clsx("aspect-square h-full w-full object-cover", className)}
      alt={alt}
      {...props}
    />
  ),
);
AvatarImage.displayName = "AvatarImage";

const AvatarFallback = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      className={clsx(
        "flex h-full w-full items-center justify-center text-sm font-medium text-white",
        className,
      )}
      {...props}
    />
  ),
);
AvatarFallback.displayName = "AvatarFallback";

export { Avatar, AvatarImage, AvatarFallback };
