import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import supabase from "../lib/supabase";

const AuthCallback = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const checkSession = async () => {
            const {data : {session}} = await supabase.auth.getSession()
            if(session){
                navigate("/todo", {replace : true})
            } 
            else{
                navigate("/auth", {replace : true})
            } 
        }
        checkSession()
    }, [navigate]);

    return <></>;
};

export default AuthCallback;
