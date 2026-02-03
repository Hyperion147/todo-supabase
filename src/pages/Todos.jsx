import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import gsap from "gsap";
import { MdDelete } from "react-icons/md";
import { TbCategory } from "react-icons/tb";
import supabase from "../lib/supabase";
import Category from "../components/Category";
import { playClickSound } from "../components/ClickSound";
import { ChevronDown, ChevronRight } from "lucide-react";

const Todos = ({ onSelect, todos, setTodos, filter, onFilterChange }) => {
    const [newTodo, setNewTodo] = useState("");
    const [isAdding, setIsAdding] = useState(false);
    const [showCategory, setShowCategory] = useState(false);
    const [activeFilter, setActiveFilter] = useState("all");
    const [isMobile, setIsMobile] = useState(false);
    const itemRef = useRef([]);
    const categoryRef = useRef(null);

    useEffect(() => {
        itemRef.current = itemRef.current.slice(0, todos.length);
    }, [todos]);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        if (categoryRef.current) {
            if (showCategory) {
                gsap.fromTo(categoryRef.current, 
                    { height: 0, opacity: 0 },
                    { height: "auto", opacity: 1, duration: 0.3, ease: "power2.out" }
                );
            } else {
                gsap.to(categoryRef.current, 
                    { height: 0, opacity: 0, duration: 0.3, ease: "power2.in" }
                );
            }
        }
    }, [showCategory]);

    const handleFilterChange = (filter) => {
        setActiveFilter(filter);
        if (onFilterChange) {
            onFilterChange(filter);
        }
    };

    const animateDelete = (id, index) => {
        const element = itemRef.current[index];
        if (!element) {
            deleteTask(id);
            return;
        }
        gsap.to(element, {
            x: 300,
            opacity: 0,
            duration: 0.4,
            stagger: 0.1,
            onComplete: () => {
                deleteTask(id);
            },
        });
    };

    const addTodo = async () => {
        const {
            data: { session },
        } = await supabase.auth.getSession();

        const email = session.user.email;
        if (!newTodo.trim()) return;
        if (!newTodo.trim().split(/\s+/).length > 5) {
            toast.error("Todo name cannot exceed 5 words!", { id: "todo-word-limit" });
            return;
        }
        try {
            if (!session) toast.error("Login First!", { id: "login-required" });
            setIsAdding(true);
            const { data, error } = await supabase
                .from("TodoList")
                .insert({
                    name: newTodo,
                    isCompleted: false,
                    email: email,
                })
                .select();
            if (error) {
                console.log("Error adding todo", error);
                toast.error("Error adding task", { id: "add-error" });
            }
            setTodos([...todos, data[0]]);
            playClickSound()
            setNewTodo("");
            toast.success("Task added!", { id: "task-added" });
        } catch (error) {
            console.log("Error adding task:", error);
        } finally {
            setIsAdding(false);
        }
    };
    const handleInputChange = (e) => {
        const input = e.target.value;
        const words = input.trim().split(/\s+/);

        if (words.length <= 10) {
            setNewTodo(input);
        } else {
            const truncatedInput = words.slice(0, 5).join(" ");
            setNewTodo(truncatedInput);
            toast.error("Maximum 10 words allowed in name!", { id: "word-limit-input" });
        }
    };
    const completeTask = async (id, isCompleted) => {
        setTodos((prev) =>
            prev.map((todo) =>
                todo.id === id ? { ...todo, isCompleted: !isCompleted } : todo
            )
        );
        const { error } = await supabase
            .from("TodoList")
            .update({ isCompleted: !isCompleted })
            .eq("id", id);
        if (error) {
            console.log("Error completing task", error);
            toast.error("Error completing task", { id: "complete-error" });
        } else {
            const updatedTodo = todos.map((todo) =>
                todo.id === id ? { ...todo, isCompleted: !isCompleted } : todo
            );
            setTodos(updatedTodo);
            onSelect(null)
            if (!isCompleted) {
                toast.success("Completed task! Check filter!", { id: "task-completed" });
            } else toast.error("Todo Pending!", { id: "todo-pending" });
        }
    };

    const handleDelete = async (id, index) => {
        if (isMobile) {
            animateDelete(id, index);
        } else {
            toast(
                (t) => (
                    <div className="">
                        <p className="mb-2 text-2xl text-text text-center">
                            Delete todo?
                        </p>
                        <div className="flex space-x-2 w-full justify-center">
                            <button
                                onClick={() => {
                                    toast.dismiss(t.id);
                                    animateDelete(id, index);
                                }}
                                className="cursor-pointer hover:bg-primary text-text hover:text-background px-5 py-2 rounded-md"
                            >
                                Delete
                            </button>
                            <button
                                onClick={() => toast.dismiss(t.id)}
                                className="cursor-pointer bg-primary text-background px-5 py-2 rounded-md"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                ),
                {
                    id: `delete-confirm-${id}`,
                    duration: 5000,
                    style: {
                        background: "var(--color-background)",
                        color: "var(--color-text)",
                        padding: "10px 15px",
                        borderRadius: "0.5rem",
                        boxShadow: "0 4px 12px rgba(50, 120, 140, 0.5)",
                        border: "1px solid var(--color-border)",
                    },
                }
            );
        }
    };
    const deleteTask = async (id) => {
        const { error } = await supabase.from("TodoList").delete().eq("id", id);
        if (error) {
            console.log("Error deleting task", error);
            toast.error("Error deleting task", { 
                id: `delete-error-${id}`,
                duration: 3000
            });
        } else {
            setTodos((prev) => prev.filter((todo) => todo.id !== id));
            toast.success("Task deleted!", {
                id: `delete-success-${id}`,
                duration: 2000
            });
        }
        setTimeout(() => {
                onSelect(null);
        }, 100);
    };

    return (
        <div className="relative">
            <div className="flex justify-end my-2 lg:hidden">
                <button
                    onClick={() => setShowCategory(!showCategory)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-background hover:bg-hover/30 transition-all duration-200 text-text rounded-md"
                >
                    <TbCategory className="w-4 h-4" />
                    <span className="text-xs sm:text-sm">Filters</span>
                    {showCategory ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
            </div>

            <div 
                ref={categoryRef}
                className="absolute top-12 right-0 z-20 overflow-hidden lg:hidden"
                style={{ height: 0, opacity: 0 }}
            >
                <div className="bg-background border border-border rounded-md p-3 shadow-lg min-w-500">
                    <Category 
                        todos={todos} 
                        onFilterChange={handleFilterChange}
                        activeFilter={activeFilter}
                    />
                </div>
            </div>

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    addTodo();
                }}
                className="flex justify-center mx-2"
            >
                <input
                    id="add-todo"
                    name="add-todo"
                    type="text"
                    placeholder="Add todo..."
                    value={newTodo}
                    onChange={handleInputChange}
                    className="relative w-full max-w-md px-4 sm:px-6 pr-4 py-2 rounded-l-md border bg-background text-text shadow-sm focus:outline-none transition-all duration-200 text-sm sm:text-base"
                    aria-describedby="add-todo-error"
                />
                <button
                    type="submit"
                    disabled={isAdding}
                    className="px-3 sm:px-4 py-2 bg-text text-background rounded-r-md hover:bg-primary/90 focus:outline-none transition-colors duration-200 font-medium cursor-pointer tech text-sm sm:text-base"
                >
                    ADD
                </button>
            </form>
            <div className="border-border border-0 md:border-2 mt-4 min-h-[calc(100vh-180px)] max-h-[calc(100vh-180px)] w-full rounded-none md:rounded-md overflow-y-auto overflow-x-hidden scrollbar-hide hover:transition-[colors,box-shadow] duration-500 hover:shadow-[4px_4px_rgba(var(--text-rgb),0.4),8px_8px_rgba(var(--text-rgb),0.2),12px_12px_rgba(var(--text-rgb),0.1)]">
                <ul className="flex flex-col items-center mt-4">
                    {filter
                        .sort((a, b) => a.isCompleted - b.isCompleted)
                        .map((todo, index) =>
                            todo.isCompleted ? (
                                <li
                                    ref={(e) => (itemRef.current[index] = e)}
                                    key={todo.id}
                                    id={`todo-${todo.id}`}
                                    className={`relative flex justify-center items-center py-2 sm:py-3 mb-2 w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl todo-item todo-element border-l-4 ${todo.priority === "low" ? "border-blue-500" : todo.priority === "medium" ? "border-green-700" : todo.priority === "high" ? "border-red-700" : ""} 
                        ${todo.priority === "low" ? "bg-blue-300" : todo.priority === "medium" ? "bg-green-300" : todo.priority === "high" ? "bg-red-300" : ""}
                        ${todo.isCompleted && "opacity-50"}
                        `}
                                >
                                    <input
                                        type="checkbox"
                                        id={`todo-${todo.id}-checkbox`}
                                        aria-describedby={`todo-${todo.id}-checkbox-error`}
                                        onChange={() => {
                                            completeTask(
                                                todo.id,
                                                todo.isCompleted
                                            );
                                        }}
                                        checked={todo.isCompleted}
                                        className={`absolute left-2 sm:left-4 h-5 w-5 sm:h-6 sm:w-6 text-blue-600 cursor-pointer transition-colors duration-200 ring-2 ring-inset ${todo.priority === "low" ? "ring-blue-500" : todo.priority === "medium" ? "ring-green-600 " : todo.priority === "high" ? "ring-red-500" : ""}`}
                                    />
                                    <span
                                        className={`text-base sm:text-lg ${todo.isCompleted ? "line-through text-gray-500" : ""} transition-all duration-300 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg capitalize text-center text-pretty wrap-break-word px-8 sm:px-12 md:px-10 cursor-pointer font-bold
                            `}
                                        onClick={() => onSelect(todo)}
                                    >
                                        {todo.name}
                                    </span>
                                    <button
                                        id={`delete-todo-${todo.id}`}
                                        aria-describedby={`delete-todo-${todo.id}-error`}
                                        onClick={() => {
                                            animateDelete(todo.id, index);
                                        }}
                                        className="absolute right-2 sm:right-3 cursor-pointer"
                                    >
                                        <MdDelete className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
                                    </button>
                                </li>
                            ) : (
                                <li
                                    ref={(e) => (itemRef.current[index] = e)}
                                    key={todo.id}
                                    className={`relative flex justify-center items-center py-2 sm:py-3 mb-2 w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl todo-item todo-element border-l-4 ${todo.priority === "low" ? "border-blue-500" : todo.priority === "medium" ? "border-green-700" : todo.priority === "high" ? "border-red-700" : ""} 
                        ${todo.priority === "low" ? "bg-blue-100" : todo.priority === "medium" ? "bg-green-300" : todo.priority === "high" ? "bg-red-300" : ""} ${todo.isCompleted && "hidden"}
                        `}
                                >
                                    <input
                                        type="checkbox"
                                        id={`todo-${todo.id}-checkbox`}
                                        aria-describedby={`todo-${todo.id}-checkbox-error`}
                                        onChange={() => {
                                            playClickSound();
                                            completeTask(
                                                todo.id,
                                                todo.isCompleted
                                            );
                                        }}
                                        checked={todo.isCompleted}
                                        disabled={todo.isCompleted}
                                        className={`absolute left-2 sm:left-4 h-5 w-5 sm:h-6 sm:w-6 text-blue-600 cursor-pointer transition-colors duration-200 ring-2 ring-inset ${todo.priority === "low" ? "ring-blue-500" : todo.priority === "medium" ? "ring-green-600 " : todo.priority === "high" ? "ring-red-500" : ""}`}
                                    />
                                    <span
                                        className={`text-base sm:text-lg ${todo.isCompleted ? "line-through text-gray-500" : "text-black"} transition-all duration-300 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg capitalize text-center text-pretty wrap-break-word px-8 sm:px-12 md:px-10 cursor-pointer font-bold
                            `}
                                        onClick={() => onSelect(todo)}
                                    >
                                        {todo.name}
                                    </span>
                                    <button
                                        onClick={() => {
                                            handleDelete(todo.id, index);
                                        }}
                                        className="absolute right-2 sm:right-3 cursor-pointer"
                                    >
                                        <MdDelete className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
                                    </button>
                                </li>
                            )
                        )}
                </ul>
            </div>
        </div>
    );
};

export default Todos;
