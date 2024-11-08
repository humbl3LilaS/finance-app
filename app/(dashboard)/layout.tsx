import Header from "@/components/Header";

const DashboardLayout = ({children}: Readonly<{ children: React.ReactNode; }>) => {
    return (
        <>
            <Header/>
            {children}
        </>
    );
};

export default DashboardLayout;