import { useState } from "react";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import supabase from "../lib/supabase";

const Auth = () => {
    const [isRegister, setIsRegister] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

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
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                });

                if (error) throw error;

                toast.success("Successfull! Check your email for confirmation");
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

    return (
        <div className="bg-background text-text flex flex-col justify-center items-center min-h-screen">
            <Toaster duration="4000" position="bottom-right" />
            <h2 className="text-primary font-bold text-2xl mb-4 tech">
                {isRegister ? "REGISTER" : "LOGIN"}
            </h2>
            <form
                onSubmit={handleSubmit}
                className="flex flex-col space-y-2 w-[350px]"
            >
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-primary px-4 py-2 rounded-md text-text"
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-primary px-4 py-2 rounded-md text-text"
                    required
                    minLength={6}
                />
                <button
                    type="submit"
                    disabled={isLoading}
                    className="mt-4 bg-primary hover:bg-primary/80 text-text px-4 py-2 rounded-md disabled:opacity-50"
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
                    className="text-sm text-primary hover:underline mt-2"
                >
                    {isRegister
                        ? "Already have an account? Login"
                        : "Need an account? Register"}
                </button>
            </form>
        </div>
    );
};

export default Auth;
