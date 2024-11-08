"use client"
import {useUser} from "@clerk/nextjs";

const WelcomeMessage = () => {
    const {user, isLoaded} = useUser();
    return (
        <div className={"space-y-2 mb-4"}>
            <h2 className={"text-2xl text-white font-medium lg:text-4xl"}>
                Welcome back {isLoaded && `, ${user?.username} 👋`}
            </h2>
            <p className={"text-sm text-[#89b6fd] lg:text-base"}>
                This is your financial overview report
            </p>
        </div>
    );
};

export default WelcomeMessage;