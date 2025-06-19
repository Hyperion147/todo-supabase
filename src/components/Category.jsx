import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { TbCategory } from "react-icons/tb";
import { FaAngleRight } from "react-icons/fa";

const Category = ({ onFilterChange, todos }) => {
    // const [categoryTodo, setCategoryTodo] = useState({
    //     high: [],
    //     medium: [],
    //     low: [],
    // });

    const [activeFilter, setActiveFilter] = useState("all");

    const handleFilter = (priority) => {
        setActiveFilter(priority);
        onFilterChange(priority);
    };

    const filters = [
        { id: "all", label: "All Todos", color: "bg-gray-200" },
        { id: "high", label: "High", color: "bg-red-200" },
        { id: "medium", label: "Medium", color: "bg-green-300" },
        { id: "low", label: "Low", color: "bg-yellow-100" },
        { id: "completed", label: "Completed", color: "bg-blue-200" },
    ];

    // const [open, setOpen] = useState(false);

    // useEffect(() => {
    //     const category = {
    //         high: todos.filter((todo) => todo.priority === "high"),
    //         medium: todos.filter((todo) => todo.priority === "medium"),
    //         low: todos.filter((todo) => todo.priority === "low"),
    //     };
    //     setCategoryTodo(category);
    // }, [todos]);

    return (
        <div className="flex flex-col relative ml-5 w-full">
            <h2 className="mt-10 font-bold text-primary flex items-center gap-1">
                <TbCategory /> Filters
            </h2>
            <hr />
            <div className="mt-4 space-y-2 flex flex-col">
                {filters.map((filter) => (
                    <button
                        key={filter.id}
                        onClick={() => handleFilter(filter.id)}
                        className={`w-full text-left px-4 py-2 rounded-md transition-colors flex items-center justify-between ${
                            activeFilter === filter.id
                                ? filter.color
                                : "hover:bg-gray-100"
                        }`}
                    >
                        {filter.label}
                        <FaAngleRight className="text-primary/70" />
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Category;
