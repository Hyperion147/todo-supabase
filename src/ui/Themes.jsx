import { useTheme } from "./ThemeProvider";

const Themes = () => {
    const { theme, changeTheme } = useTheme();
    const colorTheme = [
        {
            id: 1,
            name: "default-nord",
            varColor: "nord",
            primary: "#8fbcbb",
            background: "#242933",
            text: "#e5e9f0",
        },
        {
            id: 2,
            name: "comfy-dark",
            varColor: "comfy-dark",
            primary: "#7AA2F7",
            background: "#1A1A2A",
            text: "#E0E0E6",
        },
        {
            id: 3,
            name: "comfy-light",
            varColor: "comfy-light",
            primary: "#FF9494",
            background: "#FFF5E4",
            text: "#5A3E3E",
        },
        {
            id: 4,
            name: "dark-carbon",
            varColor: "dark-carbon",
            primary: "#3A7CA5",
            background: "#1E1E1E",
            text: "#E0E0E0",
        },
        {
            id: 5,
            name: "light-forest",
            varColor: "light-forest",
            primary: "#609966",
            background: "#EDF1D6",
            text: "#40513B",
        },
        {
            id: 6,
            name: "light-kitchen",
            varColor: "light-kitchen",
            primary: "#F4CE14",
            background: "#F5F7F8",
            text: "#45474B",
        },
        {
            id: 7,
            name: "retro-nautical",
            varColor: "retro-nautical",
            primary: "#954C2E",
            background: "#EFE4D2",
            text: "#131D4F",
        },
        {
            id: 8,
            name: "cosmic-dream",
            varColor: "cosmic-dream",
            primary: "#F8B55F",
            background: "#3D365C",
            text: "#C95792",
        },
        {
            id: 9,
            name: "dreamy-pastel",
            varColor: "dreamy-pastel",
            primary: "#7F669D",
            background: "#FBFACD",
            text: "#3A2D4D",
        },
        {
            id: 10,
            name: "soft-dawn",
            varColor: "soft-dawn",
            primary: "#C0C9EE",
            background: "#2A2A4A",
            text: "#FFF2E0",
        },
    ];
    const handleTheme = (newTheme) => {
        changeTheme(newTheme);
    };

    return (
        <div className="border-border border-2 p-5 rounded-xl gap-4 mx-20 mt-5 grid grid-cols-5">
            {colorTheme.map(
                ({ varColor, name, id, primary, background, text }) => (
                    <button
                        key={id}
                        onClick={() => handleTheme(varColor)}
                        className={`
                        px-5 py-2 rounded-lg border w-60 cursor-pointer flex justify-around items-center hover:scale-110 transition-all mx-auto
                        ${
                            theme === varColor
                                ? "bg-primary/80 text-text"
                                : "bg-gray-400 text-white hover:text-black hover:bg-white"
                        }
                    `}
                    >
                        {" "}
                        <p>{name}</p>
                        <span
                            className={`rounded-full w-4 h-4`}
                            style={{ backgroundColor: primary }}
                        ></span>
                        <span
                            className={` rounded-full w-4 h-4`}
                            style={{ backgroundColor: text }}
                        ></span>
                        <span
                            className={` rounded-full w-4 h-4`}
                            style={{ backgroundColor: background }}
                        ></span>
                    </button>
                )
            )}
        </div>
    );
};

export default Themes;
