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
    // const [isMobile, setisMobile] = useState(false)


    // const mobileMenu = () => {

    // }
    const handleInOut = async () => {
        if (session) {
            toast(
                (t) => (
                    <div className="flex flex-col">
                        <p className="mb-2 w-full text-lg text-text">Are you sure you want to log out?</p>
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
                    duration: 3000,
                    style: {
                        background: "var(--color-background)",
                        padding: "10px 15px",
                        borderRadius: "0.5rem",
                        boxShadow: "0 4px 12px rgba(50, 120, 140, 0.5)",
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
            className="bg-background border border-gray-700 shadow-md flex justify-around bgImg"
        >
            <div className="container px-4 sm:px-10 py-3 sm:py-5 flex justify-between items-center gap-2 sm:gap-0 z-10 mx-20">
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-l from-text to-text/60 bg-clip-text text-transparent tech cursor-default ml-5">
                    {session ? <Link to="/todo">TODO</Link> : <span>TODO</span>}
                </h1>
                <div className="flex items-center gap-3 sm:gap-8">
                    <Link to="settings" element={<Settings />}>
                        <GradientAvatar width={26} height={26} />
                    </Link>
                    <span className="text-2xl text-text/50 cursor-default">
                        |
                    </span>
                    <button
                        className="hover:text-text/70 transition-colors cursor-pointer text-text text-base sm:text-xl"
                        onClick={() => handleInOut()}
                    >
                        <Link to={!session && "/auth"}>
                            <IoMdLogOut className="w-6 h-6" />
                        </Link>
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
