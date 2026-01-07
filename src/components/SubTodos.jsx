import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { MdDelete } from "react-icons/md";
import gsap from "gsap";
import supabase from "@/lib/supabase";

const SubTodos = ({ todo }) => {
    const [subTodos, setSubTodos] = useState([]);
    const [newSub, setNewSub] = useState("");
    const [session, setSession] = useState(null);
    const [pendingDeletes, setPendingDeletes] = useState([]);
    const [pendingUpdates, setPendingUpdates] = useState([]);

    useEffect(() => {
        const session = async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession();
            setSession(session);
        };
        session();
    }, []);

    useEffect(() => {
        if (session && todo?.id) {
            fetchSubTodos();
        }
    }, [session, todo?.id]);

    useEffect(() => {
        return () => {
            if (pendingDeletes.length >= 0) {
                supabase
                    .from("SubTodos")
                    .delete()
                    .in("id", pendingDeletes)
                    .then(({ error }) => {
                        if (error) console.error("Batch delete failed:", error);
                    });
            }
            if (pendingUpdates.length > 0) {
                pendingUpdates.forEach((update) => {
                    supabase
                        .from("SubTodos")
                        .update({ isCompleted: update.isCompleted })
                        .eq("id", update.id)
                        .then(({ error }) => {
                            if (error)
                                console.error("Batch update failed:", error);
                        });
                });
            }
        };
    }, [pendingDeletes, pendingUpdates]);

    const fetchSubTodos = async () => {
        const { data, error } = await supabase
            .from("SubTodos")
            .select("*")
            .eq("main_todo", todo.id)
            .eq("email", session.user.email);
        if (error) {
            toast.error("Error fetching todos", { id: "sub-fetch-error" });
            console.log("Error fetching todos", error);
        } else {
            setSubTodos(data || []);
        }
    };

    const addSubTodo = async () => {
        try {
            if (!newSub.trim()) return;

            if (subTodos.length >= 3) {
                toast.error("Sub Todo limit is 3!", { id: "sub-limit-error" });
                return;
            }

            const wordCount = newSub.trim().split(/\s+/).length;
            if (wordCount > 3) {
                toast.error("Sub name cannot exceed 3 words!", {
                    id: "sub-word-limit-error",
                });
                return;
            }

            const { data, error } = await supabase
                .from("SubTodos")
                .insert({
                    name: newSub,
                    isCompleted: false,
                    email: session.user.email,
                    main_todo: todo.id,
                })
                .select();

            if (error) {
                throw error;
            }

            if (!data || data.length === 0) {
                throw new Error("No data returned from insert");
            }

            setSubTodos([...subTodos, data[0]]);
            setNewSub("");
            toast.success("Sub todo added!", { id: "sub-added-success" });
        } catch (error) {
            console.error("Error in addSubTodo:", error);
            toast.error(error.message || "Error adding sub todo", {
                id: "sub-add-error",
            });
        }
    };
    const toggleComplete = async (id, isCompleted) => {
        setSubTodos(
            subTodos.map((sub) =>
                sub.id === id ? { ...sub, isCompleted: !isCompleted } : sub
            )
        );
        setPendingUpdates([
            ...pendingUpdates,
            { id, isCompleted: !isCompleted },
        ]);
    };

    const deleteSubTodo = async (id) => {
        setSubTodos(subTodos.filter((sub) => sub.id !== id));
        setPendingDeletes([...pendingDeletes, id]);
    };

    return (
        <div className="w-full">
            <form
                className={`transition-all duration-300 ease-in-out overflow-hidden ${subTodos.length >= 3 ? "h-0 opacity-0 mb-0" : "h-auto opacity-100 mb-3"}`}
                onSubmit={(e) => {
                    e.preventDefault();
                    addSubTodo();
                }}
            >
                <div className="relative flex items-center">
                    <input
                        type="text"
                        value={newSub}
                        onChange={(e) => setNewSub(e.target.value)}
                        placeholder="Add a subtask..."
                        className="w-full px-4 py-2.5 rounded-xl border border-border/50 bg-background/50 text-text text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-text/40"
                    />
                    <button
                        type="submit"
                        disabled={!newSub.trim()}
                        className="absolute right-2 p-1.5 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 disabled:opacity-0 transition-all font-medium text-xs uppercase tracking-wider"
                    >
                        Add
                    </button>
                </div>
            </form>

            {subTodos.length === 0 && (
                <p className="text-center text-xs text-text/30 italic mb-2">
                    No subtasks added yet
                </p>
            )}

            <ul className="space-y-2">
                {subTodos.map((subTodo) => (
                    <li
                        key={subTodo.id}
                        className="group animate-in slide-in-from-top-1 duration-200"
                    >
                        <div
                            className={`
                            flex justify-between items-center px-3 py-2.5 rounded-xl border transition-all duration-200
                            ${
                                subTodo.isCompleted
                                    ? "bg-green-500/5 border-green-500/10 text-text/50"
                                    : "bg-background border-border/40 hover:border-border text-text"
                            }
                        `}
                        >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div className="relative flex items-center justify-center">
                                    <input
                                        type="checkbox"
                                        id={`todo-${subTodo.id}-checkbox`}
                                        onChange={() =>
                                            toggleComplete(
                                                subTodo.id,
                                                subTodo.isCompleted
                                            )
                                        }
                                        checked={subTodo.isCompleted}
                                        className={`
                                            appearance-none w-5 h-5 border-2 rounded-md cursor-pointer transition-all duration-200
                                            ${
                                                subTodo.isCompleted
                                                    ? "bg-green-500 border-green-500"
                                                    : "border-text/30 hover:border-primary peer"
                                            }
                                        `}
                                    />
                                    <svg
                                        className={`
                                        w-3.5 h-3.5 absolute pointer-events-none text-white transition-opacity duration-200
                                        ${subTodo.isCompleted ? "opacity-100" : "opacity-0"}
                                    `}
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                </div>
                                <span
                                    className={`text-sm truncate font-medium transition-all duration-200 ${subTodo.isCompleted ? "line-through" : ""}`}
                                >
                                    {subTodo.name}
                                </span>
                            </div>
                            <button
                                onClick={() => deleteSubTodo(subTodo.id)}
                                className="ml-2 p-1.5 text-text/30 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                                title="Delete subtask"
                            >
                                <MdDelete className="w-4 h-4" />
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SubTodos;
