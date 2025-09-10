"use client"
import { Menu, Home, Bell, User, LogOut } from "lucide-react"
import { useState } from "react";

const Navbar = () => {


    const [dropDown, setDropDown] = useState(false);

    const dropDownHandler = () => {
        setDropDown(!dropDown);
    }
    return (
        <nav className="w-full ">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">

                
                    <div className="flex items-center">
                        {/* Mobile Menu Button */}
                        {/* <button className="p-2 rounded-md hover:bg-gray-900 lg:hidden">
                            <Menu className="w-6 h-6" />
                        </button> */}
                    </div>

                    {/* Right section */}
                    <div className="flex items-center space-x-4">
                        {/* Notifications */}
                        <button className="p-2 rounded-full hover:bg-gray-300 dark:hover:bg-gray-800">
                            <Bell className="w-5 h-5" />
                        </button>


                        <div className="relative">
                            <button onClick={dropDownHandler} className="flex items-center space-x-2 p-2 rounded-md  hover:bg-gray-300 dark:hover:bg-gray-800">
                                <User className="w-5 h-5 " />
                            </button>
                       
                            {dropDown && <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-black  border rounded-md shadow-lg">
                                <a href="/profile" className="block px-4 py-2 text-sm  hover:bg-gray-300 dark:hover:bg-gray-800">Profile</a>
                                <a href="/settings" className="block px-4 py-2 text-sm  hover:bg-gray-300 dark:hover:bg-gray-800">Settings</a>
                                <button className="w-full text-left px-4 py-2 text-sm  hover:bg-gray-300 dark:hover:bg-gray-800 flex items-center">
                                    <LogOut className="w-4 h-4 mr-2" /> Logout
                                </button>
                            </div>}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
