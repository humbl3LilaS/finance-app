import {IRoute} from "@/constants";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {cn} from "@/lib/utils";

type NavButtonProps = {
    route: IRoute;
    isActive: boolean;
}

const NavButton = ({route, isActive}: NavButtonProps) => {
    return (
        <Button
            asChild={true}
            size={"sm"}
            variant={"outline"}
            className={cn( "w-full nav-item", isActive ? "bg-white/10 text-white" : "bg-transparent")
            }>
            <Link href={route.href}>
                {route.label}
            </Link>
        </Button>
    );
};
export default NavButton;