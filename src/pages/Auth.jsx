import { useState } from "react";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
// import { useNavigate } from "react-router-dom";
import supabase from "../lib/supabase";

const Auth = () => {
    const [isRegister, setIsRegister] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // const navigate = useNavigate()

    // const passwordReset = async (e) => {
    //     e.preventDefault()
    //     const newPassword = await supabase.auth.passwordReset({password: "new_password"})
    // }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        if (!email || !password) {
            toast.error("Please fill all fields");
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
        <div className="text-text bg-background flex flex-col justify-center items-center min-h-screen ">
            <div className="border-2 border-primary text-center px-15 py-10 rounded-xl">
                <Toaster duration="4000" position="bottom-right" />
                <h2 className="text-primary font-bold text-2xl mb-4 tech">
                    {isRegister ? "REGISTER" : "LOGIN"}
                </h2>
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col w-[350px]"
                >
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border-primary border-b-2 px-4 py-2 text-primary focus:outline-none mb-4"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border-primary border-b-2 px-4 py-2 text-primary focus:outline-none mb-4"
                        required
                        minLength={6}
                    />
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="mt-4 bg-primary hover:bg-primary/80 text-text px-4 py-2 rounded-md disabled:opacity-50 mb-4 cursor-pointer"
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
                        className="text-sm text-primary hover:underline mt-4 cursor-pointer"
                    >
                        {isRegister
                            ? "Already have an account? Login"
                            : "Need an account? Register"}
                    </button>
                    {/* <button
                        type="button"
                        className="text-sm text-primary hover:underline mt-4 cursor-pointer"
                    >
                        Reset password?
                    </button> */}
                </form>
                {/* <button
                    className="text-sm text-primary hover:underline mt-4 cursor-pointer"
                    onClick={signInWithGithub}
                >
                    Sign in with Github
                </button> */}
            </div>
        </div>
    );
};

export default Auth;
