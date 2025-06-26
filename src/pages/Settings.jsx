import Themes from "../components/Themes";
import UserProfile from "../components/UserProfile";

const Settings = () => {
    return (
        <div className="p-0 sm:p-4 md:p-6 flex flex-col gap-4 sm:gap-6 md:gap-8">
            <div className="flex-1">
                <UserProfile />
            </div>
            <div className="flex-1">
                <Themes />
            </div>
        </div>
    );
};

export default Settings;
