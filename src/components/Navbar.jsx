import { Link } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { IoMdLogOut } from "react-icons/io";
import { IoSettingsOutline } from "react-icons/io5";
import { IoMdLogIn } from "react-icons/io";
import toast from "react-hot-toast";
import Settings from "../components/Settings";
import supabase from "../lib/supabase";

gsap.registerPlugin(useGSAP);

const Navbar = ({ session }) => {
    const navbarRef = useRef(null);

    // useGSAP(
    //     () => {
    //         const mm = gsap.matchMedia();
    //         const commonAnimation = {
    //             opacity: 1,
    //             duration: 2,
    //             ease: "power3.out",
    //         };
    //         mm.add("(min-width: 768px)", () => {
    //             gsap.set(navbarRef.current, {
    //                 height: "75px",
    //                 borderRadius: "12px",
    //                 width: "75%",
    //                 margin: "10px auto",
    //                 opacity: 0,
    //             });

    //             gsap.to(navbarRef.current, {
    //                 width: "45%",
    //                 borderRadius: "9999px",
    //                 ...commonAnimation,
    //             });
    //         });
    //         mm.add("(max-width: 767px)", () => {
    //             gsap.set(navbarRef.current, {
    //                 height: "65px",
    //                 width: "100%",
    //                 margin: "8px auto",
    //                 opacity: 0,
    //             });

    //             gsap.to(navbarRef.current, {
    //                 width: "100%",
    //                 ...commonAnimation,
    //             });
    //         });

    //         return () => mm.revert();
    //     },
    //     { scope: navbarRef }
    // );

    const handleInOut = async () => {
        if (session) {
            toast(
                (t) => (
                    <div>
                        <p>Are you sure you want to log out?</p>
                        <div>
                            <button
                                onClick={() => {
                                    toast.dismiss(t.id);
                                    handleSignOut();
                                }}
                                className="cursor-pointer"
                            >
                                Log Out
                            </button>
                            <button
                                onClick={() => toast.dismiss(t.id)}
                                className="cursor-pointer"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                ),
                {
                    duration: 3000,
                    style: {
                        background: "white",
                        padding: "1rem",
                        borderRadius: "0.5rem",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                    },
                }
            );
        } else {
            return;
        }
    };

    const handleSignOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            toast.error("Failed to log out!");
        } else {
            toast.success("Logged out successfully!");
        }
    };

    return (
        <nav
            ref={navbarRef}
            className="bg-primary border border-gray-700 shadow-md flex justify-around bgImg"
        >
            <div className="container px-4 sm:px-10 py-3 sm:py-5 flex justify-between items-center gap-2 sm:gap-0 z-10 mx-20">
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-l from-text to-text/60 bg-clip-text text-transparent tech cursor-default ml-5">
                    {session ? <Link to="/todo">TODO</Link> : <span>TODO</span>}
                </h1>
                <div className="flex items-center gap-3 sm:gap-8">
                    <Link to="settings" element={<Settings />}>
                        <IoSettingsOutline className="w-6 h-6 cursor-pointer text-text hover:text-text/70" />
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
