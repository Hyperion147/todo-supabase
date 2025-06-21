import { useTheme } from "./ThemeProvider";

const Themes = () => {
    const { theme, changeTheme } = useTheme();
    const colorTheme = [
        { id: 1, name: "nord", color: "nord" },
        { id: 2, name: "comfy-dark", color: "comfy-dark" },
        { id: 3, name: "comfy-light", color: "comfy-light" },
        { id: 4, name: "light-forest", color: "light-forest" },
        { id: 5, name: "light-kitchen", color: "light-kitchen" },
        { id: 6, name: "retro-nautical", color: "retro-nautical" },
    ];
    const handleTheme = (newTheme) => {
        changeTheme(newTheme);
    };

    return (
        <div className="">
            {colorTheme.map(({ color, name, id }) => (
                <button
                    key={id}
                    onClick={() => handleTheme(color)}
                    className={`
                        px-4 py-2 rounded-lg border
                        ${
                            theme === color
                                ? "bg-primary text-text"
                                : "bg-background text-text hover:bg-hover"
                        }
                    `}
                >
                    {name}
                </button>
            ))}
        </div>
    );
};

export default Themes;
