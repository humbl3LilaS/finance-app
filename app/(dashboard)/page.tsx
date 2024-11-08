import {UserButton} from "@clerk/nextjs";

export default function Home() {
    return (
        <section>
            <h1 className={"text-3xl text-green-500"}>Header</h1>
            <UserButton/>
        </section>

    );
}
