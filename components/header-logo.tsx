import Link from "next/link";
import Image from "next/image";

const HeaderLogo = () => {
    return (
        <Link href="/">
            <Image src={"/logo-full.svg"} alt="logo" width={150} height={28}/>
        </Link>
    );
};

export default HeaderLogo;