import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import gsap from "gsap";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import clsx from "clsx";
import supabase from "../lib/supabase";
import Navbar from "../components/Navbar";
import Description from "../components/Description";

const Todos = ({ onSelect, todos, setTodos, filter }) => {
    const [newTodo, setNewTodo] = useState("");
    const [isAdding, setIsAdding] = useState(false);
    const itemRef = useRef([]);

    useEffect(() => {
        itemRef.current = itemRef.current.slice(0, todos.length);
    }, [todos]);
    
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
        if(todos.length >= 15){
            toast.error("Todo limit is 15! Delete some todos!")
            return;
        }
        if (!newTodo.trim()) return;
        if (!newTodo.trim().split(/\s+/).length > 5) {
            toast.error("Todo name cannot exceed 5 words!");
            return;
        }
        try {
            if (!session) toast.error("Login First!");
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
                toast.error("Error adding task");
            }
            setTodos([...todos, data[0]]);
            setNewTodo("");
            toast.success("Task added!");
        } catch (error) {
            console.log("Error adding task:", error);
        } finally {
            setIsAdding(false);
        }
    };
    const handleInputChange = (e) => {
        const input = e.target.value;
        const words = input.trim().split(/\s+/);

        if (words.length <= 5) {
            setNewTodo(input);
        } else {
            const truncatedInput = words.slice(0, 5).join(" ");
            setNewTodo(truncatedInput);
            toast.error("Maximum 5 words allowed in name!");
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
            toast.error("Error completing task");
        } else {
            const updatedTodo = todos.map((todo) =>
                todo.id === id ? { ...todo, isCompleted: !isCompleted } : todo
            );
            setTodos(updatedTodo);
            if (!isCompleted) {
                toast.success("Completed task! Check filter!");
            } else toast.error("Todo Pending!");
        }
    };

    const handleDelete = async (id, index) => {
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
                            className="cursor-pointer hover:bg-primary text-text hover:text-background px-5 py-2 rounded-xl"
                        >
                            Delete
                        </button>
                        <button
                            onClick={() => toast.dismiss(t.id)}
                            className="cursor-pointer bg-primary text-background px-5 py-2 rounded-xl"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ),
            {
                duration: 3000,
                style: {
                    background: "var(--color-background)",
                    padding: "10px 15px",
                    borderRadius: "0.5rem",
                    boxShadow: "0 4px 12px rgba(50, 120, 140, 0.5)",
                },
            }
        );
    };
    const deleteTask = async (id) => {
        const { error } = await supabase.from("TodoList").delete().eq("id", id);
        if (error) {
            console.log("Error deleting task", error);
            toast.error("Error deleting task");
        } else {
            setTodos((prev) => prev.filter((todo) => todo.id !== id));
            toast.error("Deleted Task!");
            onSelect(null);
        }
    };

    return (
        <div>
            <Toaster position="bottom-right" />
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    addTodo();
                }}
                className="flex justify-center mx-2"
            >
                <input
                    type="text"
                    placeholder="Add todo..."
                    value={newTodo}
                    onChange={handleInputChange}
                    className="relative w-100 px-6 py-3 pr-4 rounded-l-full border bg-background text-text shadow-sm focus:outline-none focus:ring-1 focus:border-transparent transition-all duration-200"
                />
                <button
                    type="submit"
                    disabled={isAdding}
                    className="px-4 bg-text text-background rounded-r-full hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-border transition-colors duration-200 font-medium cursor-pointer tech"
                >
                    ADD
                </button>
            </form>
            <div className="border-border border-0 md:border-2 mt-4 min-h-[590px] md:min-h-[570px] max-h-[570px] min-w-[750px]  max-w-[750px] rounded-none md:rounded-xl overflow-y-auto overflow-x-hidden scrollbar-hide hover:transition-[colors,box-shadow] duration-400 hover:shadow-[5px_5px_rgba(42,42,74,0.3),10px_10px_rgba(42,42,74,0.2),15px_15px_rgba(42,42,74,0.1)]">
                <ul className="flex flex-col items-center mt-5">
                    {filter
                        .sort((a, b) => a.isCompleted - b.isCompleted)
                        .map((todo, index) =>
                            todo.isCompleted ? (
                                <li
                                    ref={(e) => (itemRef.current[index] = e)}
                                    key={todo.id}
                                    className={`relative flex justify-center items-center py-3 mb-2 max-w-[350px]  min-w-[350px] md:min-w-[700px] todo-item todo-element border-l-4 ${todo.priority === "low" ? "border-blue-500" : todo.priority === "medium" ? "border-green-700" : todo.priority === "high" ? "border-red-700" : ""} 
                                ${todo.priority === "low" ? "bg-blue-300" : todo.priority === "medium" ? "bg-green-300" : todo.priority === "high" ? "bg-red-300" : ""}
                                ${todo.isCompleted && "opacity-50"}
                                `}
                                >
                                    <input
                                        type="checkbox"
                                        onChange={() =>
                                            completeTask(
                                                todo.id,
                                                todo.isCompleted
                                            )
                                        }
                                        checked={todo.isCompleted}
                                        className={`absolute left-4 h-6 w-6 text-blue-600 cursor-pointer transition-colors duration-200 ring-2 ring-inset ${todo.priority === "low" ? "ring-blue-500" : todo.priority === "medium" ? "ring-green-600 " : todo.priority === "high" ? "ring-red-500" : ""}`}
                                    />
                                    <span
                                        className={`text-lg ${todo.isCompleted ? "line-through text-gray-500" : ""} transition-all duration-300 md:min-w-[300px] max-w-[350px] capitalize  md:max-w-[650px] text-center text-pretty wrap-break-word px-12 md:px-10  cursor-pointer font-bold
                                `}
                                        onClick={() => onSelect(todo)}
                                    >
                                        {todo.name}
                                    </span>
                                    <button
                                        onClick={() =>
                                            animateDelete(todo.id, index)
                                        }
                                        className="absolute right-3 cursor-pointer"
                                    >
                                        <MdDelete className="w-6 h-6 text-red-500" />
                                    </button>
                                </li>
                            ) : (
                                <li
                                    ref={(e) => (itemRef.current[index] = e)}
                                    key={todo.id}
                                    className={`relative flex justify-center items-center py-3 mb-2 max-w-[350px]  min-w-[350px] md:min-w-[700px] todo-item todo-element border-l-4 ${todo.priority === "low" ? "border-blue-500" : todo.priority === "medium" ? "border-green-700" : todo.priority === "high" ? "border-red-700" : ""} 
                                ${todo.priority === "low" ? "bg-blue-100" : todo.priority === "medium" ? "bg-green-300" : todo.priority === "high" ? "bg-red-300" : ""} ${todo.isCompleted && "hidden"}
                                `}
                                >
                                    <input
                                        type="checkbox"
                                        onChange={() =>
                                            completeTask(
                                                todo.id, todo.isCompleted
                                            )
                                        }
                                        checked={todo.isCompleted}
                                        disabled={todo.isCompleted}
                                        className={`absolute left-4 h-6 w-6 text-blue-600 cursor-pointer transition-colors duration-200 ring-2 ring-inset ${todo.priority === "low" ? "ring-blue-500" : todo.priority === "medium" ? "ring-green-600 " : todo.priority === "high" ? "ring-red-500" : ""}`}
                                    />
                                    <span
                                        className={`text-lg ${todo.isCompleted ? "line-through text-gray-500" : "text-black"} transition-all duration-300 md:min-w-[300px] max-w-[350px] capitalize  md:max-w-[650px] text-center text-pretty wrap-break-word px-12 md:px-10  cursor-pointer font-bold
                                `}
                                        onClick={() => onSelect(todo)}
                                    >
                                        {todo.name}
                                    </span>
                                    <button
                                        onClick={() => {
                                            handleDelete(todo.id, index);
                                        }}
                                        className="absolute right-3 cursor-pointer"
                                    >
                                        <MdDelete className="w-6 h-6 text-red-500" />
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
