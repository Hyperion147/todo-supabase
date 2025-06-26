import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import Description from "../components/Description";
import Category from "../components/Category";
import Navbar from "../components/Navbar";
import supabase from "../lib/supabase";
import Settings from "./Settings";
import Todos from "./Todos";
import DescriptionSkeleton from "@/ui/DescriptionSkeleton";

const Home = () => {
    const [todos, setTodos] = useState([]);
    const [selected, setSelected] = useState(null);
    const [filtered, setFiltered] = useState("all");
    const [isClosing, setIsClosing] = useState(false);
    const descriptionRef = useRef(null);

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
            toast.error("Error fetching todos", { id: "home-fetch-error" });
            console.log("Error fetching todos", error);
        } else {
            setTodos(data);
        }
    };

    const handleUpdateTask = async (updateTask) => {
        try {
            if (!updateTask?.id) {
                console.error("No Task ID");
            }
            const { error } = await supabase
                .from("TodoList")
                .update(updateTask)
                .eq("id", updateTask.id);

            if (error) throw error;

            setTodos((prev) =>
                prev.map((todo) =>
                    todo.id === updateTask.id ? updateTask : todo
                )
            );
            setSelected(updateTask);
            toast.success("Task updated!", { id: "home-update-success" });
        } catch (error) {
            toast.error("Failed to update task", { id: "home-update-error" });
            console.error("Failed to update task", error);
        }
    };

    const filterTodos = (todos, filter) => {
        switch (filter) {
            case "high":
                return todos.filter((todo) => todo.priority === "high");
            case "medium":
                return todos.filter((todo) => todo.priority === "medium");
            case "low":
                return todos.filter((todo) => todo.priority === "low");
            case "completed":
                return todos.filter((todo) => todo.isCompleted);
            default:
                return todos.filter((todo) => !todo.isCompleted);
        }
    };
    const filter = filterTodos(todos, filtered);

    const handleCloseDescription = () => {
        setIsClosing(true);
        setTimeout(() => {
            setSelected(null);
            setIsClosing(false);
        }, 300);
    };

    return (
        <div className="flex w-full flex-col lg:flex-row justify-between gap-4 lg:gap-0">
            <div className="hidden lg:block lg:min-w-[150px] lg:pr-4 xl:pr-20 transition-all duration-500 order-2 lg:order-1">
                <Category
                    todos={todos}
                    onFilterChange={(filter) => setFiltered(filter)}
                    activeFilter={filtered}
                />
            </div>

            <main className="mt-4 lg:px-0 order-1 lg:order-2 flex-1 relative">
                <Todos
                    onSelect={setSelected}
                    setTodos={setTodos}
                    todos={todos}
                    selected={selected}
                    filter={filter}
                    onFilterChange={(filter) => setFiltered(filter)}
                />
            </main>

            <div
                ref={descriptionRef}
                className="lg:min-w-[350px] lg:max-w-[350px] hidden lg:block order-3"
            >
                {selected ? (
                    <Description todo={selected} onSave={handleUpdateTask} onClose={handleCloseDescription} />
                ) : (
                    <DescriptionSkeleton />
                )}
            </div>
            {(selected || isClosing) && (
                <div
                    className={`fixed inset-0 z-40 bg-background p-4 lg:hidden ${
                        isClosing ? 'description-slide-out' : 'description-slide-in'
                    }`}
                >
                    {selected && (
                        <Description todo={selected} onSave={handleUpdateTask} onClose={handleCloseDescription} />
                    )}
                </div>
            )}
        </div>
    );
};

export default Home;
