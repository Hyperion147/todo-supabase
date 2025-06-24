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
            if (pendingDeletes.length > 0) {
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
            toast.error("Error fetching todos");
            console.log("Error fetching todos", error);
        } else {
            setSubTodos(data || []);
        }
    };

    const addSubTodo = async () => {
        try {
            if (!newSub.trim()) return;

            if (subTodos.length >= 3) {
                toast.error("Sub Todo limit is 3!");
                return;
            }

            const wordCount = newSub.trim().split(/\s+/).length;
            if (wordCount > 3) {
                toast.error("Sub name cannot exceed 3 words!");
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
            toast.success("Sub todo added!");
        } catch (error) {
            console.error("Error in addSubTodo:", error);
            toast.error(error.message || "Error adding sub todo");
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
        <div className="">
            <form
                className={`${subTodos.length >= 3 ? "hidden" : "flex"} items-center justify-center mb-2`}
                onSubmit={(e) => {
                    e.preventDefault()
                    addSubTodo()
                }}
            > 
                <input
                    type="text"
                    value={newSub}
                    onChange={(e) => setNewSub(e.target.value)}
                    placeholder="Add sub todo!"
                    className="px-2 py-1 w-full rounded-md border border-border bg-background text-text shadow-sm focus:outline-none focus:ring-1 focus:border-transparent transition-all duration-200"
                />
            </form>
            <ul className="space-y-2">
                {subTodos.map((subTodo) => (
                    <li key={subTodo.id}>
                        <div className="border border-border flex justify-between items-center px-2 w-75 rounded-sm">
                            <input
                                type="checkbox"
                                id={`todo-${subTodo.id}-checkbox`}
                                aria-describedby={`todo-${subTodos.id}-checkbox-error`}
                                onChange={() =>
                                    toggleComplete(
                                        subTodo.id,
                                        subTodo.isCompleted
                                    )
                                }
                                checked={subTodo.isCompleted}
                                className="h-4 w-4 text-border cursor-pointer transition-colors duration-200 ring-2 ring-inset "
                            />
                            <span
                                className={`${subTodo.isCompleted ? "line-through text-primary" : "text-text"} py-1 text-center px-2`}
                            >
                                {subTodo.name}
                            </span>
                            <button
                                id={`delete-todo-${subTodo.id}`}
                                aria-describedby={`delete-todo-${subTodo.id}-error`}
                                onClick={() => deleteSubTodo(subTodo.id)}
                                className="cursor-pointer"
                            >
                                <MdDelete className="w-5 h-5 text-red-500" />
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SubTodos;
