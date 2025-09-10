import { ModeToggle } from "@/components/ ModeToggle";
import Menu from "@/components/Menu";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";

export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="h-screen flex  overflow-hidden">
            <aside className="flex-none w-16 sm:w-20 md:w-24 lg:w-44 xl:w-56 border-r-2 p-4 flex flex-col items-center">

                <div className="sticky top-0 h-screen flex flex-col items-center gap-10">
                    <Link href="/" className="flex items-center gap-2.5">
                        <Image
                            src="/logo1.png"
                            alt="logo"
                            width={200}
                            height={200}
                            className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12"
                        />
                        <span className="hidden lg:block font-bold text-lg">SUPER UNI</span>
                    </Link>
                    <nav className="flex flex-col items-center gap-3">
                        <Menu />
                    </nav>

                    <div className="mt-auto mb-4">

                        <ModeToggle />
                    </div>
                </div>
            </aside>


            <main className="flex-1 min-w-0 overflow-auto p-6">

                <Navbar />
                <div className="">right side</div>


                <div className="mt-6 space-y-6">
                    {Array.from({ length: 30 }).map((_, i) => (
                        <div key={i} className="h-40 rounded bg-black/60" />
                    ))}
                </div>

                {children}
            </main>
        </div>
    );
}
