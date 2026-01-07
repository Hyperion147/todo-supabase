import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import Description from "../components/Description";
import Category from "../components/Category";
import supabase from "../lib/supabase";
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
        <div className="flex flex-col w-full h-full max-w-[1600px] mx-auto overflow-hidden">
            <div className="flex flex-col lg:flex-row flex-1 lg:gap-8 lg:p-4 h-full relative">
                {/* Left Sidebar - Categories */}
                <aside className="hidden lg:flex flex-col lg:w-48 xl:w-64 flex-shrink-0 transition-all duration-300">
                    <div className="sticky top-4">
                        <Category
                            todos={todos}
                            onFilterChange={(filter) => setFiltered(filter)}
                            activeFilter={filtered}
                        />
                    </div>
                </aside>

                {/* Main Content - Todos */}
                <main className="flex-1 w-full min-w-0 flex flex-col h-full z-0 order-1 lg:order-2">
                    <Todos
                        onSelect={setSelected}
                        setTodos={setTodos}
                        todos={todos}
                        selected={selected}
                        filter={filter}
                        onFilterChange={(filter) => setFiltered(filter)}
                    />
                </main>

                {/* Right Sidebar - Description */}
                <aside 
                    ref={descriptionRef}
                    className="hidden lg:flex flex-col w-[350px] xl:w-[400px] flex-shrink-0 border-l border-border/50 pl-6 lg:order-3"
                >
                    <div className="sticky top-4 h-full">
                        {selected ? (
                            <Description todo={selected} onSave={handleUpdateTask} onClose={handleCloseDescription} />
                        ) : (
                            <DescriptionSkeleton />
                        )}
                    </div>
                </aside>

                {/* Mobile Description Overlay */}
                {(selected || isClosing) && (
                    <div
                        className={`fixed inset-0 z-50 bg-background/80 backdrop-blur-sm lg:hidden flex items-end sm:items-center justify-center p-4 transition-all duration-300 ${
                            isClosing ? "opacity-0 pointer-events-none" : "opacity-100"
                        }`}
                        onClick={handleCloseDescription}
                    >
                        <div 
                            className={`w-full max-w-md bg-background border border-border rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[85vh] overflow-y-auto ${
                                isClosing ? "translate-y-full sm:scale-95" : "translate-y-0 sm:scale-100"
                            } transition-all duration-300 ease-out`}
                            onClick={e => e.stopPropagation()}
                        >
                            <Description todo={selected} onSave={handleUpdateTask} onClose={handleCloseDescription} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
