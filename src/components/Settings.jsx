import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import Themes from "../ui/Themes";

const Settings = () => {
    return (
        <div className="">
            <Toaster
                position="bottom-right"
            />
            <Themes />
        </div>
    );
};

export default Settings;
