import { Link } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef, useState } from "react";
import { IoMdLogOut } from "react-icons/io";
import { IoSettingsOutline } from "react-icons/io5";
import { IoMdLogIn } from "react-icons/io";
import toast from "react-hot-toast";
import Settings from "../pages/Settings";
import supabase from "../lib/supabase";
import { useTheme } from "../ui/ThemeProvider";
import { GradientAvatar } from "@/ui/GradientAvatar";

gsap.registerPlugin(useGSAP);

const Navbar = ({ session, handleSignOut }) => {
    const navbarRef = useRef(null);

    const handleInOut = async () => {
        if (session) {
            toast(
                (t) => (
                    <div className="flex flex-col items-center">
                        <p className="mb-4 w-full text-lg text-text">Are you sure you want to log out?</p>
                        <div className="flex space-x-2 w-full justify-center">
                            <button
                                onClick={() => {
                                    toast.dismiss(t.id);
                                    handleSignOut();
                                }}
                                className="cursor-pointer hover:bg-primary text-text hover:text-background px-5 py-2 rounded-xl"
                            >
                                Log Out
                            </button>
                            <button
                                onClick={() => toast.dismiss(t.id)}
                                className="cursor-pointer bg-primary text-background px-5 py-2 rounded-xl"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                ),
                {
                    id: "navbar-logout-confirm",
                    duration: 3000,
                    style: {
                        background: "var(--color-background)",
                        color: "var(--color-text)",
                        padding: "10px 14px",
                        borderRadius: "0.5rem",
                        boxShadow: "0 4px 12px rgba(50, 120, 140, 0.5)",
                        border: "1px solid var(--color-border)",
                    },
                }
            );
        } else {
            return;
        }
    };

    return (
        <nav
            ref={navbarRef}
            className="bg-background border border-gray-700 shadow-md flex justify-between md:justify-around bgImg"
        >
            <div className="container px-2 sm:px-4 md:px-10 py-2 sm:py-3 md:py-5 flex justify-between items-center gap-2 sm:gap-0 z-10 mx-2 sm:mx-4 md:mx-20">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-l from-text to-text/60 bg-clip-text text-transparent tech cursor-default ml-2 sm:ml-5">
                    {session ? <Link to="/todo">TODO</Link> : <span>TODO</span>}
                </h1>
                <div className={`items-center gap-2 sm:gap-3 md:gap-8 ${session ? "flex" : "hidden"}`}>
                    <Link to="settings" element={<Settings />}>
                        <GradientAvatar width={22} height={22} className="sm:w-6 sm:h-6 md:w-7 md:h-7" />
                    </Link>
                    <span className="text-lg sm:text-2xl text-text/50 cursor-default">
                        |
                    </span>
                    <button
                        className="hover:text-text/70 transition-colors cursor-pointer text-text text-sm sm:text-base md:text-xl"
                        onClick={() => handleInOut()}
                    >
                        <Link to={!session && "/auth"}>
                            <IoMdLogOut className="w-5 h-5 sm:w-6 sm:h-6" />
                        </Link>
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
