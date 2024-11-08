import HeaderLogo from "@/components/header-logo";
import Navigation from "@/components/Navigation";
import {ClerkLoaded, ClerkLoading, UserButton} from "@clerk/nextjs";
import WelcomeMessage from "@/components/WelcomeMessage";

const Header = () => {
    return (
        <header className={"px-4 pt-8 pb-20 bg-gradient-to-b from-blue-700 to-blue-500 lg:px-14 lg:pb-36"}>
            <div className={"max-w-screen-2xl mx-auto"}>
                <div className={"w-full mb-14  flex items-center justify-between"}>
                    <div className={"w-full flex items-center justify-between lg:gap-x-16"}>
                        <HeaderLogo/>
                        <Navigation/>
                    </div>
                    <div className={"ml-8 hidden md:block"}>
                        <ClerkLoaded>
                            <UserButton/>
                        </ClerkLoaded>
                        <ClerkLoading>
                            <div className={"size-10 animate-pulse rounded-full bg-gray-400/20"}/>
                        </ClerkLoading>
                    </div>
                </div>
                <WelcomeMessage/>
            </div>
        </header>
    );
};

export default Header;