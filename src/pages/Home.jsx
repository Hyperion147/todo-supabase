import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import Description from "../components/Description";
import Category from "../components/Category";
import Navbar from "../components/Navbar";
import supabase from "../lib/supabase";
import Settings from "../components/Settings";
import Todos from "./Todos";
import DescriptionSkeleton from "@/ui/DescriptionSkeleton";

const Home = () => {
    const [todos, setTodos] = useState([]);
    const [selected, setSelected] = useState(null);
    const [filtered, setFiltered] = useState("all");

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
            toast.success("Task updated!");
        } catch (error) {
            toast.error("Failed to update task");
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

    return (
        <div className="flex w-full flex-col lg:flex-row justify-between gap-4 lg:gap-0">
            <div className="lg:min-w-[150px] lg:border-r-2 lg:border-border lg:pr-4 xl:pr-20 transition-all duration-500">
                <Category
                    todos={todos}
                    onFilterChange={(filter) => setFiltered(filter)}
                />
            </div>

            <main className="mt-4 px-4 lg:px-0 order-first lg:order-none">
                <Todos
                    onSelect={setSelected}
                    setTodos={setTodos}
                    todos={todos}
                    selected={selected}
                    filter={filter}
                />
            </main>

            <div
                className={`lg:min-w-[350px] max-w-[350px] ${selected ? "fixed lg:static inset-0 z-50 bg-background lg:bg-transparent p-4 lg:p-0" : "hidden lg:block"} lg:border-l-2 lg:border-border`}
            >
                {selected ? (
                    <Description todo={selected} onSave={handleUpdateTask} />
                ) : (
                    <DescriptionSkeleton />
                )}
            </div>
        </div>
    );
};

export default Home;
