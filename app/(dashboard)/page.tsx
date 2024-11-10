import {UserButton} from "@clerk/nextjs";

const Home = async () => {
    return (
            <section>
                <h1 className={"text-3xl text-green-500"}>Header</h1>
                <UserButton/>
            </section>
    );
};

export default Home;