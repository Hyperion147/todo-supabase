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
        <div className="border-border border-2 p-5 rounded-xl mx-20 mt-5">
            {loading ? (
                <div className="mx-4 space-y-2"></div>
            ) : editing ? (
                <div></div>
            ) : (
                <div className="mx-4 flex justify-between">
                    <div className="flex">
                        <div className="mr-5 flex items-center justify-center">
                            <GradientAvatar width={45} height={45} />
                        </div>
                        <div className="space-y-2">
                            <h2>
                                <span className="tech text-text/80 hover:text-text">
                                    {" "}
                                    username :{" "}
                                </span>
                                <span className="text-2xl text-text">
                                    {profile.username}
                                </span>
                            </h2>
                            <h2>
                                <span className="tech text-text/80 hover:text-text">
                                    {" "}
                                    email :{" "}
                                </span>
                                <span className="text-text">
                                    {profile.email}
                                </span>
                            </h2>
                        </div>
                    </div>
                    <div>
                        
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserProfile;
