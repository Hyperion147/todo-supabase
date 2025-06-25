import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import Themes from "../components/Themes";
import UserProfile from "../components/UserProfile";

const Settings = () => {
    return (
        <div className="h-[100vh] justify-center items-center">
            <Toaster
                position="top-center"
            />
            <UserProfile />
            <Themes />
        </div>
    );
};

export default Settings;
