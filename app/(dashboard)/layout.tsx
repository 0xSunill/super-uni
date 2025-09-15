// app/(dashboard)/layout.tsx
// import { ModeToggle } from "@/components/ModeToggle";
import { ModeToggle } from "@/components/ ModeToggle";
import Menu from "@/components/Menu";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";

export default function AdminLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <div className="h-screen flex overflow-hidden">
            {/* Sidebar only visible on large screens */}
            <aside className="hidden lg:flex flex-none w-44 xl:w-56 border-r-2 p-4 flex-col items-center">
                <div className="sticky top-0 h-screen flex flex-col items-center gap-10 ">
                    <div className="h-16 flex items-center">
                        <Link href="/" className="flex items-center justify-center gap-2.5">
                            <Image
                                src="/logo1.png"
                                alt="logo"
                                width={200}
                                height={200}
                                className="w-12 h-12"
                            />
                            <span className="hidden lg:block font-bold text-lg">SUPER UNI</span>
                        </Link>
                    </div>

                    <nav className="flex flex-col items-center gap-3 w-full">
                        <Menu labelsVisible={false} />
                    </nav>

                    <div className="mt-auto mb-4 w-full lg:flex lg:justify-start">
                        <ModeToggle />
                    </div>
                </div>
            </aside>

            <main className="flex-1 min-w-0 overflow-auto p-4">

                <Navbar />

                <div className="pt-4 mb-24 ">{children}</div>
            </main>
        </div>
    );
}
