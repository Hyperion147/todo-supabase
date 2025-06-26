import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Auth from "./pages/Auth";
import Todos from "./pages/Todos";
import AuthCallback from "./pages/AuthCallback";
import Home from "./pages/Home";
import Settings from "./pages/Settings";
import Navbar from "./components/Navbar";
import { ThemeProvider } from "./ui/ThemeProvider";
import supabase from "./lib/supabase";
import FixedButtons from "./ui/FixedButtons";
import "./App.css";
import Favicon from "./ui/Favicon";

function AppWrap() {
    const [session, setSession] = useState(null);
    const navigate = useNavigate();
    const fetchSession = async () => {
        const currentSession = await supabase.auth.getSession();
        setSession(currentSession.data.session);
    };

    useEffect(() => {
        fetchSession();
        const { data: authListener } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                setSession(session);
                if (event === "SIGNED_IN" && !session) {
                    if (window.location.pathname.includes("/auth")) {
                        navigate("/todo", { replace: true });
                    }
                }
            }
        );
        return () => {
            authListener.subscription.unsubscribe();
        };
    }, [navigate]);

    const handleSignOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            toast.error("Failed to log out!", { id: "logout-error" });
        } else {
            toast.success("Logged out successfully!", { id: "logout-success" });
        }
    };

    return (
        <>
            <Toaster 
                position="bottom-right"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: "var(--color-background)",
                        color: "var(--color-text)",
                        border: "1px solid var(--color-border)",
                        zIndex: 9999,
                    },
                }}
                containerStyle={{
                    zIndex: 9999,
                    position: "fixed",
                    bottom: "1rem",
                    right: "1rem",
                }}
                gutter={8}
            />
            <div className="h-screen bg-background text-text relative z-10 transition-all duration-500 overflow-x-hidden">
                {session ? (
                    <div className="hidden lg:block">
                        <FixedButtons />
                    </div>
                ) : (
                    ""
                )}
                <Navbar handleSignOut={handleSignOut} session={session} />
                <div className="px-2 sm:px-4 lg:px-6">
                    <Routes>
                        <Route
                            path="/todo"
                            element={
                                session ? (
                                    <Home />
                                ) : (
                                    <Navigate to="/auth" replace />
                                )
                            }
                        />
                        <Route
                            path="/auth"
                            element={
                                session ? <Navigate to="/todo" /> : <Auth />
                            }
                        />
                        <Route
                            path="/"
                            element={
                                session ? (
                                    <Todos session={session} />
                                ) : (
                                    <Navigate to="/auth" replace />
                                )
                            }
                        />
                        <Route
                            path="/auth/callback"
                            element={<AuthCallback />}
                        />
                        <Route
                            path="/settings"
                            element={
                                session ? (
                                    <Settings />
                                ) : (
                                    <Navigate to="/auth" replace />
                                )
                            }
                        />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </div>
            </div>
        </>
    );
}

function App() {
    return (
        <ThemeProvider>
            <Favicon />
            <AppWrap />
        </ThemeProvider>
    );
}

export default App;
