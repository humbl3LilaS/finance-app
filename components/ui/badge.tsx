import * as React from "react"
import {cva, type VariantProps} from "class-variance-authority"

import {cn} from "@/lib/utils"

const badgeVariants = cva(
    "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors duration-500",
    {
        variants: {
            variant: {
                default:
                    "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
                secondary:
                    "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
                destructive:
                    "border-transparent bg-destructive/20 text-red-500  shadow hover:bg-destructive/50 hover:text-white",
                outline: "text-foreground",
                primary: "border-transparent bg-blue-500/10 py-2.5 hover:bg-blue-500/40"
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof badgeVariants>
{
}

function Badge({className, variant, ...props}: BadgeProps) {
    return (
        <div className={cn(badgeVariants({variant}), className)} {...props} />
    )
}

export {Badge, badgeVariants}
