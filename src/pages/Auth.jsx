import { useState } from "react";
import toast from "react-hot-toast";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { FaLockOpen } from "react-icons/fa";
import supabase from "../lib/supabase";

const Auth = () => {
    const [isRegister, setIsRegister] = useState(false);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [reveal, setReveal] = useState(false);

    const handleSubmit = async (e) => {
        if (e) {
            e.preventDefault();
        }
        setIsLoading(true);

        if (!password || !email) {
            toast.error("Please fill all fields", { id: "auth-fields-error" });
            setIsLoading(false);
            return;
        }
        if (isRegister && password != confirmPassword) {
            toast.error("Passwords do not match!", {
                id: "auth-password-match-error",
            });
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

                const { error: profileError } = await supabase
                    .from("Profiles")
                    .insert({
                        email: email,
                        username: username,
                    });

                if (profileError) throw profileError;
                toast.success("Registered Successfully!", {
                    id: "auth-register-success",
                });
                toast.custom(
                    <div className="px-4 py-2 bg-border text-text rounded-md">
                        <p className="text-xl text-ellipsis">
                            Welcome {username}
                        </p>
                    </div>,
                    {
                        id: "auth-welcome-message",
                        position: "top-center",
                        duration: 4000,
                        icon: "🔥",
                    }
                );
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;

                toast.success("Login successful!", {
                    id: "auth-login-success",
                });
            }
        } catch (error) {
            console.log(error.message);
            toast.error(
                isRegister ? "Registration failed" : "Check your credentials!",
                { id: "auth-error" }
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="text-text flex flex-col items-center h-[85vh] justify-center transition-normal">
            <div className="border-2 border-border text-center flex flex-col justify-center items-center px-6 py-6 md:py-10 rounded-xl w-full max-w-[90vw] sm:max-w-md">
                <h2 className="text-text font-bold text-xl sm:text-2xl mb-4 tech">
                    {isRegister ? "REGISTER" : "LOGIN"}
                </h2>
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col w-full sm:w-[340px]"
                >
                    <input
                        id="username"
                        name="username"
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className={`border-border border-b-2 px-4 py-2 text-text focus:outline-none mb-4 
                            ${!isRegister ? "hidden" : "flex"}`}
                        required={isRegister}
                        aria-describedby="email-error"
                    />
                    <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border-border border-b-2 px-4 py-2 text-text focus:outline-none mb-4"
                        required
                        aria-describedby="email-error"
                    />
                    <div className="border-border border-b-2 py-2 px-4 text-text mb-4 flex justify-between">
                        <input
                            id="password"
                            name="password"
                            type={reveal ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="border-none focus:outline-none w-full"
                            required
                            minLength={6}
                            aria-describedby="password-error"
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
                            id="confirm-password"
                            name="confirm-password"
                            type={reveal ? "text" : "password"}
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="border-none focus:outline-none w-full"
                            required={isRegister}
                            minLength={6}
                            aria-describedby="confirm-password-error"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="mt-4 bg-border hover:bg-border/80 text-text px-4 py-2 rounded-md disabled:opacity-50 mb-4 cursor-pointer"
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
                        className="text-sm text-text hover:underline mt-2 cursor-pointer"
                    >
                        {isRegister
                            ? "Already have an account? Login"
                            : "Need an account? Register"}
                    </button>
                </form>
                <button
                    className={`text-text text-sm hover:underline mt-2 cursor-pointer gap-2 items-center justify-center ${!isRegister ? "flex" : "hidden"}`}
                    onClick={() => {
                        setEmail("test@gmail.com");
                        setPassword("todo@1234");
                    }}
                >
                    <p className="opacity-50">Dummy Credentials For Testing</p>
                </button>
            </div>
        </div>
    );
};

export default Auth;
