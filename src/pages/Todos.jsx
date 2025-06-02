import { useEffect, useState } from "react";
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
    }
  };
  const deleteTask = async (id) => {
    const { error } = await supabase.from("TodoList").delete().eq("id", id);
    if (error) {
      console.log("Error deleting todo", error);
    } else {
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
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
          className="relative w-100 px-6 py-3 pr-20 rounded-l-full border border-border bg-white text-primary shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:border-transparent transition-all duration-200"
        />
        <button
          onClick={addTodo}
          disabled={isAdding}
          className="px-4 bg-primary text-text rounded-r-full hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-1 transition-colors duration-200 font-medium cursor-pointer tech"
        >
          {isAdding ? "Adding..." : "ADD"}
        </button>
      </div>
      <ul className="flex flex-col items-center mt-10">
        {todos.map((todo) => (
          <li key={todo.id} className="flex space-x-6">
            <input
              type="checkbox"
              onChange={() => completeTask(todo.id, todo.isCompleted)}
              checked={todo.isCompleted}
              className="h-5 w-5 text-gray-600 rounded focus:ring-gray-500 cursor-pointer transition-colors duration-200'"
            />
            <span
              className={`text-lg ${todo.isCompleted ? "line-through text-accent" : "text-text"} transition-all duration-300`}
            >
              {todo.name}
            </span>
            <button onClick={() => deleteTask(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Todos;
