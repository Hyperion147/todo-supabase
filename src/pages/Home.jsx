import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import Description from "../components/Description";
import Category from "../components/Category";
import Navbar from "../components/Navbar";
import supabase from "../lib/supabase";
import Settings from "../components/Settings";
import Todos from "./Todos";

const Home = () => {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState("");
    const [selected, setSelected] = useState(null);

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

    return (
        <div className="flex flex-col min-w-full">
            <div className="flex items-center border-border">
                <div className="flex min-w-full justify-around">
                    <div className="min-w-[150px] border-r-2 border-primary">
                        <Category />
                    </div>
                    <main className="flex items-center justify-between mt-4">
                        <Todos
                            onSelect={setSelected}
                            setTodos={setTodos}
                            todos={todos}
                            selected={selected}
                        />
                    </main>
                    <div className="min-w-[350px] border-l-2 border-primary">
                        {selected && (
                            <Description
                                todo={selected}
                                onSave={handleUpdateTask}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
