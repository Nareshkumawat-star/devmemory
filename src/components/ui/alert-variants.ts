import { cva, type VariantProps } from "class-variance-authority";

export const alertVariants = cva(
  "rounded-md border p-4",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive: "bg-destructive text-destructive-foreground",
        warning: "bg-yellow-50 border-yellow-500 text-yellow-800",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export type AlertVariants = VariantProps<typeof alertVariants>;
