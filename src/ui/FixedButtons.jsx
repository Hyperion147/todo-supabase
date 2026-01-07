import { FaGithub } from "react-icons/fa";

const FixedButtons = () => {
    return (
        <div className="fixed bottom-7 left-7 flex flex-col z-50">
            <div className="relative inline-flex h-10 overflow-hidden rounded-full p-[3px]">
                <span
                    className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite]"
                    style={{
                        background:
                            "conic-gradient(from 90deg at 50% 50%, var(--color-text) 0%, var(--color-text) 50%, var(--color-border) 100%)",
                    }}
                />
                <a
                    href="https://github.com/Hyperion147/todo-supabase"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative inline-flex items-center bg-text text-background hover:scale-110 px-4 py-2 rounded-full shadow-lg transition-all duration-300 cursor-pointer gap-2"
                    aria-label="GitHub"
                >
                    <FaGithub className="w-4 h-4 md:w-5 md:h-5 " />
                    <span>Github</span>
                </a>
            </div>
        </div>
    );
};

export default FixedButtons;

<button className="">
    <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
        Border Magic
    </span>
</button>;
