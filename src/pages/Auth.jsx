import { useState } from "react";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
import supabase from "../lib/supabase";

const Auth = () => {
    const [isRegister, setIsRegister] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [reveal, setReveal] = useState(false);

    // const navigate = useNavigate()

    // const passwordReset = async (e) => {
    //     e.preventDefault()
    //     const newPassword = await supabase.auth.passwordReset({password: "new_password"})
    // }

    const handleSubmit = async (e) => {
        if (e) {
            e.preventDefault();
        }
        setIsLoading(true);

        if (!password || !email) {
            toast.error("Please fill all fields");
            setIsLoading(false);
            return;
        }
        if (isRegister && password != confirmPassword) {
            toast.error("Passwords do not match!");
            setIsLoading(false);
            return;
        }

        try {
            if (isRegister) {
                const { error: registerError } = await supabase.auth.signUp({
                    email,
                    password,
                });

                if (registerError) throw registerError;

                toast.success("Successfull! Login to continue!");
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });

                if (error) throw error;

                toast.success("Login successful!");
            }
        } catch (error) {
            console.error("Auth error:", error);
            toast.error(
                error.message ||
                    (isRegister
                        ? "Registration failed"
                        : "Check your credentials!")
            );
        } finally {
            setIsLoading(false);
        }
    };

    // const signInWithGithub = async () => {
    //     try {
    //         const { error } = await supabase.auth.signInWithOAuth({
    //             provider: "github",
    //             options: {
    //                 redirectTo: "http://localhost:5173/auth/callback",
    //                 queryParams: {
    //                     access_type: "offline",
    //                     prompt: "consent",
    //                 },
    //             },
    //         });
    //         if(error) throw error
    //     } catch (error) {
    //         console.log(error);
    //         toast.error("Github auth error! Try email login!");
    //     }
    // };

    return (
        <div className="text-text flex flex-col items-center mt-30 transition-normal">
            <div className="border-2 border-border text-center px-4 sm:px-8 md:px-15 py-6 md:py-10 rounded-xl w-full max-w-[90vw] sm:max-w-md">
                <Toaster duration="4000" position="bottom-right" />
                <h2 className="text-text font-bold text-xl sm:text-2xl mb-4 tech">
                    {isRegister ? "REGISTER" : "LOGIN"}
                </h2>
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col w-full sm:w-[350px]"
                >
                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border-border border-b-2 px-4 py-2 text-text focus:outline-none mb-4"
                        required
                    />
                    <div className="border-border border-b-2 py-2 px-4 text-text mb-4 flex justify-between">
                        <input
                            type={reveal ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="border-none focus:outline-none w-full"
                            required
                            minLength={6}
                        />
                        <button
                            type="button"
                            onClick={() => {
                                setReveal(!reveal);
                            }}
                            className="ml-2"
                        >
                            {!reveal ? <FaEye /> : <FaEyeSlash />}
                        </button>
                    </div>
                    <div
                        className={`border-border border-b-2 py-2 px-4 text-text mb-4 flex justify-between ${!isRegister ? "hidden" : "flex"}`}
                    >
                        <input
                            type={reveal ? "text" : "password"}
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="border-none focus:outline-none w-full"
                            required={isRegister}
                            minLength={6}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="mt-4 bg-border hover:bg-border/80 text-background px-4 py-2 rounded-md disabled:opacity-50 mb-4 cursor-pointer"
                    >
                        {isLoading
                            ? "Processing..."
                            : isRegister
                              ? "Register"
                              : "Login"}
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsRegister(!isRegister)}
                        className="text-sm text-text hover:underline mt-4 cursor-pointer"
                    >
                        {isRegister
                            ? "Already have an account? Login"
                            : "Need an account? Register"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Auth;
