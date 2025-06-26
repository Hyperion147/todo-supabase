import { useEffect, useState } from "react";
import supabase from "../lib/supabase";
import { GradientAvatar } from "../ui/GradientAvatar";

const UserProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        const userInfo = async () => {
            try {
                setLoading(true);
                const {
                    data: { session },
                } = await supabase.auth.getSession();
                const { data } = await supabase
                    .from("Profiles")
                    .select("username, email")
                    .eq("email", session.user.email)
                    .single();
                setProfile(data);
            } catch (error) {
                console.error("Error fetching profile", error);
            } finally {
                setLoading(false);
            }
        };
        userInfo();
    }, []);

    return (
        <div className="border-border border-2 p-3 sm:p-4 md:p-5 rounded-xl mx-2 sm:mx-4 md:mx-8 lg:mx-20 mt-3 sm:mt-4 md:mt-5">
            {loading ? (
                <div className="mx-2 sm:mx-4 space-y-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                </div>
            ) : editing ? (
                <div></div>
            ) : (
                <div className="mx-2 sm:mx-4 flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-3 sm:gap-0">
                    <div className="flex flex-row sm:flex-row items-center sm:items-center gap-3 sm:gap-5">
                        <div className="flex items-center justify-center">
                            <GradientAvatar width={40} height={40} className="sm:w-[45px] sm:h-[45px]" />
                        </div>
                        <div className="space-y-1 sm:space-y-2 text-center sm:text-left">
                            <h2 className="flex flex-row sm:flex-row items-center gap-1 sm:gap-2">
                                <span className="tech text-text/80 hover:text-text text-sm sm:text-base">
                                    username:
                                </span>
                                <span className="text-lg sm:text-xl md:text-2xl text-text font-semibold break-all">
                                    {profile.username}
                                </span>
                            </h2>
                            <h2 className="flex flex-row sm:flex-row items-center gap-1 sm:gap-2">
                                <span className="tech text-text/80 hover:text-text text-sm sm:text-base">
                                    email:
                                </span>
                                <span className="text-sm sm:text-base text-text break-all">
                                    {profile.email}
                                </span>
                            </h2>
                        </div>
                    </div>
                    <div className="w-full sm:w-auto">
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserProfile;
