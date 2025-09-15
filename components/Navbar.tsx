// components/Navbar.tsx
"use client";
import { Menu as MenuIcon, Home, Users, Bell, Mail, X, Search, Settings, Wallet, LogOut, User } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import Menu from "./Menu"; // reuse the same Menu component
import { ModeToggle } from "./ ModeToggle";
import Image from "next/image";
// import { ModeToggle } from "./ModeToggle";

export default function Navbar() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    function close() {
        setDrawerOpen(false);
    }
    function toggle() {
        setDrawerOpen((s) => !s);
    }

    return (
        <>
            <nav className="relative  top-0 z-30 w-full bg-background">
                <div className="max-w-7xl mx-auto px-1 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        {/* left: mobile menu button (visible on small screens) */}
                        <div className="flex items-center">
                            <button
                                onClick={toggle}
                                aria-label="Open menu"
                                className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 lg:hidden"
                            >
                                <MenuIcon className="w-6 h-6" />
                            </button>
                        </div>

                        {/* center: logo / X for all screens */}
                        <div className="flex-1 lg:hidden flex items-center justify-center">
                            <Link href="/" className="flex items-center gap-2" onClick={close}>
                                {/* Small centered 'X' or logo - keep size compact */}
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
                                <span className="hidden sm:block lg:hidden font-semibold">SUPER UNI</span>
                                <span className="hidden lg:block font-bold text-lg">SUPER UNI</span>
                            </Link>
                        </div>

                        {/* right: user actions (always visible) */}
                        <div className="flex items-center space-x-3">
                            <div className="">
                                <ModeToggle />
                            </div>

                            <button className="hidden lg:block p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800">
                                <Bell className="w-5 h-5" />
                            </button>

                            <button className=" hidden lg:block p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800">
                                <Mail className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile slide-over drawer */}
            <div
                className={`fixed inset-0 z-40 transition-all ${drawerOpen ? "pointer-events-auto" : "pointer-events-none"
                    }`}
                aria-hidden={!drawerOpen}
            >
                {/* backdrop */}
                <div
                    onClick={close}
                    className={`fixed inset-0 bg-black/40 transition-opacity ${drawerOpen ? "opacity-100" : "opacity-0"
                        }`}
                />

                {/* drawer panel */}
                <aside
                    className={`fixed left-0 top-0 bottom-0 w-60 max-w-full transform transition-transform ${drawerOpen ? "translate-x-0" : "-translate-x-full"
                        } bg-background border-r border-border shadow-lg p-2`}
                >
                    <div className="flex items-center justify-between my-4">
                        <Link href="/" className="flex items-center justify-center gap-2">
                            <Image
                                src="/logo1.png"
                                alt="logo"
                                width={200}
                                height={200}
                                className="w-12 h-12"
                            />
                            <span className=" font-bold ">SUPER UNI</span>
                        </Link>

                        <button
                            onClick={close}
                            aria-label="Close menu"
                            className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Menu with labels visible inside drawer */}
                    <nav className="overflow-y-auto h-[calc(100vh-140px)]">
                        <Menu labelsVisible={true} />
                    </nav>

                    <div className="mt-auto pt-4 border-t border-border">
                        <div className="flex items-center justify-between">
                            <div className="text-sm">Theme</div>
                            <ModeToggle />
                        </div>
                    </div>
                </aside>
            </div>

            {/* Bottom navigation for phones */}
            <div className="fixed left-1/2  -translate-x-1/2 z-30 bottom-0  w-full max-w-3xl sm:hidden"  >
                <div className="bg-popover text-popover-foreground backdrop-blur-sm shadow-lg px-4 py-3 flex justify-between items-center ">
                    <Link href="/" className="flex flex-col items-center text-xs" aria-label="Home">
                        <Home className="w-6 h-6" />
                        <span className="mt-0.5">Home</span>
                    </Link>

                    <button className="flex flex-col items-center text-xs" >
                        <User className="w-6 h-6" />
                        <span className="mt-0.5">Profile</span>
                    </button>

                    <button
                        // onClick={ }
                        className="flex flex-col items-center text-xs"
                        aria-label="Open Menu"
                    >
                        <Settings className="w-6 h-6" />
                        <span className="mt-0.5">Settings</span>
                    </button>

                    <button className="flex flex-col items-center text-xs" >
                        <Wallet className="w-6 h-6" />
                        <span className="mt-0.5">Wallet</span>
                    </button>

                    <button className="flex flex-col items-center text-xs">
                        <LogOut className="w-6 h-6" />
                        <span className="mt-0.5">Logout</span>
                    </button>
                </div>
            </div>
        </>
    );
}
