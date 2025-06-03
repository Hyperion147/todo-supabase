import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import supabase from "../lib/supabase";

const Todos = () => {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState("");
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        const { data, error } = await supabase.from("TodoList").select("*");
        if (error) {
            console.log("Error fetching todos", error);
        } else {
            setTodos(data);
        }
    };

    const addTodo = async () => {
        if (!newTodo.trim()) return;
        try {
            setIsAdding(true);
            const { error } = await supabase
                .from("TodoList")
                .insert({ name: newTodo, isCompleted: false });
            if (error) {
                console.log("Error adding todo", error);
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
            console.log("Error deleting todo", error);
        } else {
            setTodos((prev) => prev.filter((todo) => todo.id !== id));
            toast.error("Deleted Task!");
        }
    };
    const deleteAllTask = async () => {
        try {
            const { data, error } = await supabase
                .from("TodoList")
                .select("id");
            if (error) toast.error("Error fetching todos: ", error);

            const { error: deletingError } = await supabase
                .from("TodoList")
                .delete()
                .in(
                    "id",
                    data.map((todo) => todo.id)
                );
            if (deletingError) {
                toast.error("Error deleting todos:", error);
            } else {
                setTodos([]);
                toast.error("All tasks deleted!");
            }
        } catch (error) {
            toast.error("Error deleting all todos: ", error);
        }
    };

    return (
        <div className="">
            <div className="flex justify-center">
                <input
                    type="text"
                    placeholder="Add todo..."
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    className="relative w-100 px-6 py-3 pr-20 rounded-l-full border border-border bg-white text-primary shadow-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200"
                />
                <button
                    onClick={addTodo}
                    disabled={isAdding}
                    className="px-4 bg-primary text-text rounded-r-full hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-1 transition-colors duration-200 font-medium cursor-pointer tech"
                >
                    ADD
                </button>
            </div>
            <div className="border-primary border-4 mt-4 min-h-[560px] max-h-[560px] max-w-[750px] mx-auto rounded-2xl overflow-y-auto">
                <ul className="flex flex-col items-center mt-6  max-h-[560px]">
                    {todos.map((todo) => (
                        <li
                            key={todo.id}
                            className="relative flex space-x-6 justify-center items-center bg-primary py-3 mb-2 min-w-[550px] rounded-xl"
                        >
                            <input
                                type="checkbox"
                                onChange={() =>
                                    completeTask(todo.id, todo.isCompleted)
                                }
                                checked={todo.isCompleted}
                                className="absolute left-4 h-6 w-6 text-gray-600 rounded focus:ring-gray-500 cursor-pointer transition-colors duration-200'"
                            />
                            <span
                                className={`text-lg ${todo.isCompleted ? "line-through text-accent" : "text-text"} transition-all duration-300`}
                            >
                                {todo.name}
                            </span>
                            <button onClick={() => deleteTask(todo.id)} className="absolute right-4">
                                <img
                                    src="delete.png"
                                    alt=""
                                    className="w-8 h-8 hover:bg-gradient-to-b p-1 hover:to-gray-800 rounded-b-sm"
                                />
                            </button>
                        </li>
                    ))}
                </ul>
                <div className="relative flex justify-center">
                    <button
                        onClick={deleteAllTask}
                        className={`${todos.length >= 2 ? "flex" : "hidden"} bg-red-700 py-2 border-gray-500 border-2 px-5 rounded-xl font-bold hover:bg-gradient-to-b hover:to-red-900 hover:ring-1`}
                    >
                        Delete All
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Todos;
