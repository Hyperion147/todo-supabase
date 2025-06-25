import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
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
            toast.error("Failed to log out!");
        } else {
            toast.success("Logged out successfully!");
        }
    };

    return (
        <>
            <div className="h-screen bg-background text-text overflow-hidden relative z-10 transition-all duration-500">
                {session ? <FixedButtons /> : ""}
                <Navbar handleSignOut={handleSignOut} session={session} />
                <Routes>
                    <Route
                        path="/todo"
                        element={
                            session ? <Home /> : <Navigate to="/auth" replace />
                        }
                    />
                    <Route
                        path="/auth"
                        element={session ? <Navigate to="/todo" /> : <Auth />}
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
                    <Route path="/auth/callback" element={<AuthCallback />} />
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
