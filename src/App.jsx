import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import { useEffect, useState } from "react";

import { Toaster } from "react-hot-toast";
import Auth from "./pages/Auth";
import Todos from "./pages/Todos";
import Home from "./pages/Home";
import supabase from "./lib/supabase";
import "./App.css";

function App() {
    const [session, setSession] = useState(null);

    const fetchSession = async () => {
        const currentSession = await supabase.auth.getSession();
        console.log(currentSession);
        setSession(currentSession.data.session);
    };

    useEffect(() => {
        fetchSession();
        const { data: authListener } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setSession(session);
            }
        );

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    return (
        <>
            <Router>
                <div className="min-h-screen bg-background text-text overflow-hidden relative z-10">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route
                            path="/todo"
                            element={
                                session ? (
                                    <Todos />
                                ) : (
                                    <Navigate
                                        to="/auth"
                                        replace
                                        state={{ from: "/todo" }}
                                    />
                                )
                            }
                        />
                        <Route path="auth" element={<Auth />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </div>
            </Router>
        </>
    );
}

export default App;
