import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import gsap from "gsap";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import supabase from "../lib/supabase";
import Navbar from "../components/Navbar";
import Description from "../components/Description";

const Todos = ({ onTodoSelect }) => {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState("");
    const [isAdding, setIsAdding] = useState(false);
    const itemRef = useRef([]);

    const animateDeleteAll = () => {
        const items = gsap.utils.toArray(".todo-item");
        const tl = gsap.timeline({
            onComplete: () => deleteAllTask(),
        });

        tl.to(items, {
            x: 300,
            opacity: 0,
            duration: 0.4,
            stagger: 0.1,
        });
    };
    const animateDelete = (id, index) => {
        const element = itemRef.current[index];
        if (!element) return;
        gsap.to(element, {
            x: 300,
            opacity: 0,
            duration: 0.4,
            stagger: 0.1,
            onComplete: () => deleteTask(id),
        });
    };

    useEffect(() => {
        fetchTodos();
    }, []);
    const fetchTodos = async () => {
        const {
            data: { session },
        } = await supabase.auth.getSession();
        const emailCheck = session.user.email;
        if (!emailCheck) {
            setTodos([]);
            return;
        }
        const { data, error } = await supabase
            .from("TodoList")
            .select("*")
            .eq("email", emailCheck);
        if (error) {
            toast.error("Error fetching todos");
            console.log("Error fetching todos", error);
        } else {
            setTodos(data);
        }
    };
    const addTodo = async () => {
        const {
            data: { session },
        } = await supabase.auth.getSession();
        const email = session.user.email;

        if (!newTodo.trim()) return;
        if (todos.length >= 8) {
            toast.error("Maximum limit of 8 todos reached!");
            return;
        }
        try {
            setIsAdding(true);
            const { error } = await supabase.from("TodoList").insert({
                name: newTodo,
                isCompleted: false,
                email: email,
            });
            if (error) {
                console.log("Error adding todo", error);
                toast.error("Error adding task");
            } else {
                await fetchTodos();
                setNewTodo("");
                toast.success("Task added!");
            }
        } catch (error) {
            console.log("Error adding task:", error);
        } finally {
            setIsAdding(false);
        }
    };
    const completeTask = async (id, isCompleted) => {
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
            if (!isCompleted) toast.success("Completed Task!");
        }
    };
    const deleteTask = async (id) => {
        const { error } = await supabase.from("TodoList").delete().eq("id", id);
        if (error) {
            console.log("Error deleting task", error);
            toast.error("Error deleting task");
        } else {
            setTodos((prev) => prev.filter((todo) => todo.id !== id));
            toast.error("Deleted Task!");
        }
    };
    const deleteAllTask = async () => {
        try {
            const { data, error: fetchingError } = await supabase
                .from("TodoList")
                .select("id");
            if (fetchingError) {
                toast.error("Error fetching todos to delete");
                console.log("Error fetching todos: ", fetchingError);
            }

            const { error: deletingError } = await supabase
                .from("TodoList")
                .delete()
                .in(
                    "id",
                    data.map((todo) => todo.id)
                );
            if (deletingError) {
                toast.error("Error deleting todos");
                console.log("Error deleting todos:", deletingError);
            } else {
                setTodos([]);
                toast.error("All tasks deleted!");
            }
        } catch (error) {
            toast.error("Error deleting all todos: ", error);
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
                    onChange={(e) => setNewTodo(e.target.value)}
                    className="relative w-100 px-6 py-3 pr-4 rounded-l-full border bg-white text-primary shadow-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200"
                />
                <button
                    type="submit"
                    disabled={isAdding || todos.length >= 8}
                    className="px-4 bg-primary text-text rounded-r-full hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-1 transition-colors duration-200 font-medium cursor-pointer tech"
                >
                    ADD
                </button>
            </form>
            <div className="border-primary/30 border-0 md:border-2 mt-4 min-h-[680px] md:min-h-[560px] max-h-[560px] min-w-[750px]  max-w-[750px] rounded-none md:rounded-xl overflow-y-auto overflow-x-hidden mx-2 md:mx-auto">
                <ul className="flex flex-col items-center mt-4 max-h-[560px]">
                    {todos.map((todo, index) => (
                        <li
                            ref={(e) => (itemRef.current[index] = e)}
                            key={todo.id}
                            className="relative flex justify-center items-center bg-primary py-3 mb-2 max-w-[350px]  min-w-[350px] md:min-w-[700px] rounded-sm md:rounded-lg todo-item todo-element"
                        >
                            <input
                                type="checkbox"
                                onChange={() =>
                                    completeTask(todo.id, todo.isCompleted)
                                }
                                checked={todo.isCompleted}
                                className="absolute left-4 h-6 w-6 text-gray-600 rounded focus:ring-gray-500 cursor-pointer transition-colors duration-200"
                            />
                            <span
                                className={`text-lg ${todo.isCompleted ? "line-through text-accent" : "text-text"} transition-all duration-300 md:min-w-[300px] max-w-[350px] capitalize  md:max-w-[650px] text-center text-pretty wrap-break-word px-12 md:px-10  cursor-pointer`}
                                onClick={() => onTodoSelect(todo)}
                            >
                                {todo.name}
                            </span>
                            <button
                                onClick={() => animateDelete(todo.id, index)}
                                className="absolute right-3 cursor-pointer"
                            >
                                <MdDelete className="w-6 h-6" />
                            </button>
                        </li>
                    ))}
                </ul>
                <div className="flex justify-center">
                    <button
                        onClick={animateDeleteAll}
                        className={`${todos.length >= 2 ? "flex" : "hidden"} bg-red-600 py-2 border-gray-500 border-2 px-5 rounded-xl font-bold hover:bg-red-800 hover:ring-1 cursor-pointer`}
                    >
                        Delete All
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Todos;
