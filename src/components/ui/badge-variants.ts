import { cva, type VariantProps } from "class-variance-authority";

export const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        outline: "border border-input bg-background",
        destructive: "bg-destructive text-destructive-foreground",
        success: "bg-green-500/10 text-green-600 border-green-500/20",
        warning: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
        info: "bg-blue-500/10 text-blue-600 border-blue-500/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export type BadgeVariants = VariantProps<typeof badgeVariants>;
