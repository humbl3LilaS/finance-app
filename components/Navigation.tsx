"use client"
import {ROUTES} from "@/constants";
import {usePathname} from "next/navigation";
import NavButton from "@/components/NavButton";
import {useState} from "react";
import {useRouter} from "next/navigation";
import {useMedia} from "react-use";
import {Sheet, SheetContent, SheetTitle, SheetTrigger} from "@/components/ui/sheet";
import {Button} from "@/components/ui/button";
import {Menu} from "lucide-react";
import {ClerkLoaded, ClerkLoading, UserButton} from "@clerk/nextjs";


const Navigation = () => {
    const [open, setOpen] = useState(false);

    const router = useRouter();
    const pathname = usePathname();

    const isMobile = useMedia("(max-width: 786px)", false);

    const onClick = (href: string) => {
        router.push(href);
        setOpen(false);
    }

    if (isMobile) {
        return <div className={"flex items-center gap-x-3"}>
            <div>
                <ClerkLoaded>
                    <UserButton/>
                </ClerkLoaded>
                <ClerkLoading>
                    <div className={"size-10 animate-pulse rounded-full bg-gray-400/20"}/>
                </ClerkLoading>
            </div>
            <Sheet open={open} onOpenChange={setOpen}>;
                <SheetTrigger asChild={true}>
                    <Button className={"nav-item bg-white/10"}>
                        <Menu className={"size-4"}/>
                    </Button>
                </SheetTrigger>
                <SheetContent side={"left"} className={"px-4"}>
                    <SheetTitle className={"sr-only"}>Menu</SheetTitle>
                    <nav className={"flex flex-col gap-y-4 pt-10"}>
                        {
                            ROUTES.map(item =>
                                           <Button
                                               key={item.label}
                                               variant={item.href === pathname ? "secondary" : "ghost"}
                                               onClick={() => onClick(item.href)}
                                               className={"justify-start"}
                                           >
                                               {item.label}
                                           </Button>
                            )
                        }
                    </nav>
                </SheetContent>
            </Sheet>
        </div>
    }


    return (
        <nav className={"hidden md:flex items-center gap-x-2"}>
            {
                ROUTES.map(item =>
                               <NavButton
                                   route={item}
                                   isActive={pathname === item.href}
                                   key={item.label}
                               />)
            }
        </nav>
    );
};

export default Navigation;