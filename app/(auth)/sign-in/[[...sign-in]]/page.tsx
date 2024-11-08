import {ClerkLoaded, ClerkLoading, SignIn} from "@clerk/nextjs";
import {Loader2} from "lucide-react";
import Image from "next/image";

const SignInPage = () => {
    return (
        <section className={"min-h-screen grid grid-cols-1 lg:grid-cols-2"}>

            <div className={"h-full lg:flex flex-col items-center justify-center px-4 gap-y-8"}>
                <header className={"text-center space-y-4 pt-16`"}>
                    <h1 className={"font-bold text-3xl text-[#2E2A47]"}>Welcome Back!</h1>
                    <p className={"text-base text-[#7E8CA0]"}>
                        Log in or Create account to get back to your dashboard!
                    </p>
                </header>
                <div className={"flex items-center justify-center"}>
                    <ClerkLoaded>
                        <SignIn path={"/sign-in"}/>
                    </ClerkLoaded>
                    <ClerkLoading>
                        <Loader2 className={"mt-8 animate-spin text-muted-foreground size-10"}/>
                    </ClerkLoading>
                </div>
            </div>

            <div className={"hidden h-full bg-blue-700 lg:flex items-center justify-center"}>
                <Image src={"/logo.svg"} alt={"logo"} width={80} height={80} />
            </div>
        </section>
    );
};

export default SignInPage;